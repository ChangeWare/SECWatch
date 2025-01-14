import json
from redis import Redis
from typing import List, Dict, Any, Set
from datetime import datetime, timedelta
from sec_miner.config import Config
from sec_miner.persistence.mongodb.database import MongoDbContext
from sec_miner.persistence.sql.database import DbContext
from sec_miner.sec.processors.company_processor import CompanyProcessor
from sec_miner.sec.processors.types import UnprocessedFiling
from sec_miner.sec.sec_client import SECClient
from sec_miner.sec.utils import normalize_cik
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


class FilingProcessor:
    def __init__(self, redis_client: Redis,
                 sec_client: SECClient,
                 company_processor: CompanyProcessor,
                 mongodb_context: MongoDbContext,
                 db_context: DbContext):
        self.redis_client = redis_client
        self.company_processor = company_processor
        self.mongodb_context = mongodb_context
        self.sec_client = sec_client
        self.db_context = db_context

        # Constants for queue names and processing
        self.FILING_QUEUE = Config.FILING_QUEUE
        self.FAILED_QUEUE = Config.FILING_QUEUE_FAILURES
        self.MAX_RETRIES = Config.FILING_QUEUE_MAX_RETRIES
        self.RETRY_DELAY = Config.FILING_QUEUE_RETRY_DELAY

    @staticmethod
    def _group_filings_by_cik(filings: List[UnprocessedFiling]) -> Dict[str, List[UnprocessedFiling]]:
        """Group filings by CIK and sort each group by date"""
        filings_by_cik: Dict[str, List[UnprocessedFiling]] = {}
        for filing in filings:
            cik = normalize_cik(filing.cik)
            if cik not in filings_by_cik:
                filings_by_cik[cik] = []
            filings_by_cik[cik].append(filing)

        # Sort each group by date descending
        for cik_filings in filings_by_cik.values():
            cik_filings.sort(key=lambda x: x.date_filed, reverse=True)

        return filings_by_cik

    def _requeue_filings(self, filings: List[UnprocessedFiling], error: str):
        """Re-queue filings with retry metadata"""
        for filing in filings:
            filing.retry_count += 1
            filing.last_error = error
            filing.last_attempt = datetime.utcnow().isoformat()

            if filing.retry_count <= self.MAX_RETRIES:
                # Add to delayed retry queue with exponential backoff
                retry_at = datetime.utcnow() + timedelta(seconds=self.RETRY_DELAY)
                filing.retry_at = retry_at.isoformat()

                self.redis_client.rpush(
                    self.FAILED_QUEUE,
                    json.dumps(filing.to_json())
                )
                logger.warning(
                    f"Re-queued filing {filing.hash_value} "
                    f"for retry {filing.retry_count}/{self.MAX_RETRIES}"
                )
            else:
                # Log dead letter for manual review
                filing['final_failure'] = True
                self.mongodb_context.record_failed_filing(filing)
                logger.error(
                    f"Filing {filing.get('entry_hash')} exceeded max retries. "
                    f"Moving to dead letter collection."
                )

    def _process_filing_batch(self, filings_by_cik: Dict[str, List[UnprocessedFiling]],
                              processed_filing_hashes: Set[str]):

        company_has_filing_history = self.mongodb_context.check_companies_have_filing_history(
            list(filings_by_cik.keys())
        )

        """Process a batch of filings for a single CIK"""
        for cik, filing_entries in filings_by_cik.items():
            try:
                if not company_has_filing_history.get(cik):
                    # If the company doesn't have filing history, skip processing
                    # We do this because the company processor will handle grabbing all the filings
                    # in one large batch.

                    logger.info(f"Company without filing history detected. Postponing processing of filings for"
                                f" {cik} to be processed by company processor.")
                    continue

                filings = []
                for entry in filing_entries:
                    try:
                        filing = self.sec_client.get_company_filing(
                            cik,
                            entry.accession_number
                        )
                        filings.append(filing)
                    except Exception as e:
                        logger.error(
                            f"Error fetching filing with hash {entry['entry_hash']}: {str(e)}"
                        )
                        self._requeue_filings([entry], str(e))
                        continue

                if filings:
                    self.mongodb_context.insert_filings_into_history(filings, cik)
                    self.db_context.update_company_last_known_filing_date(
                        cik,
                        filings[0]['date_filed']
                    )
                    # Mark all successfully processed filings
                    for filing in filings:
                        processed_filing_hashes.add(filing['accession_number'])

            except Exception as e:
                logger.error(f"Error processing filings for CIK {cik}: {str(e)}")
                raise

    @staticmethod
    def deserialize_filings(filing_entries: List[bytes]) -> List[UnprocessedFiling]:
        filings = []

        for entry in filing_entries:
            data = json.loads(entry.decode('utf-8'))

            # Since date was serialized with str(), parse it with datetime
            date_filed = datetime.strptime(data['date_filed'], '%Y-%m-%d %H:%M:%S')

            last_attempt = datetime.strptime(data['last_attempt'], '%Y-%m-%d %H:%M:%S') \
                if data['last_attempt'] else None
            retry_at = datetime.strptime(data['retry_at'], '%Y-%m-%d %H:%M:%S') \
                if data['retry_at'] else None

            filing = UnprocessedFiling(
                cik=data['cik'],
                company_name=data['company_name'],
                date_filed=date_filed,
                form_type=data['form_type'],
                filename=data['filing_url'],
                accession_number=data['accession_number'],
                retry_count=data['retry_count'],
                last_attempt=last_attempt,
                retry_at=retry_at,
                last_error=data['last_error'],
            )

            filings.append(filing)

        return filings

    def process_new_filings(self):
        """Main method to process new filings with error handling"""
        try:
            # Get queue length first
            queue_length = self.redis_client.llen(self.FILING_QUEUE)
            if queue_length == 0:
                logger.info("No new filings to process")
                return

            filing_entries = self.redis_client.lpop(self.FILING_QUEUE, queue_length)

            if not filing_entries:
                return

            filings = self.deserialize_filings(filing_entries)

            # Set to track successfully processed filings
            processed_filing_hashes = set()

            try:
                # Group filings by CIK
                filings_by_cik = self._group_filings_by_cik(filings)

                # Process any new companies in the filings first.
                self.company_processor.discover_companies_from_filings(filings_by_cik)

                # Process the batches
                self._process_filing_batch(filings_by_cik, processed_filing_hashes)

            except Exception as e:
                # If something fails, requeue only unprocessed filings
                unprocessed_filings = [
                    filing for filing in filings
                    if filing.hash_value not in processed_filing_hashes
                ]
                if unprocessed_filings:
                    self._requeue_filings(unprocessed_filings, str(e))
                raise

        except Exception as e:
            logger.error(f"Critical error in filing processor: {str(e)}")
            raise

    def retry_failed_filings(self):
        """Process the failed queue for retries"""
        while True:
            failed_filing = self.redis_client.lpop(self.FAILED_QUEUE)
            if not failed_filing:
                break

            filing = json.loads(failed_filing)
            retry_at = datetime.fromisoformat(filing['retry_at'])

            if datetime.utcnow() >= retry_at:
                logger.info(f"Retrying failed filing {filing['entry_hash']}")
                self.redis_client.rpush(
                    self.FILING_QUEUE,
                    json.dumps(filing)
                )
            else:
                # Put it back if it's not time yet
                self.redis_client.rpush(self.FAILED_QUEUE, failed_filing)
