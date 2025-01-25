from itertools import groupby
from redis import Redis
from typing import List, Dict, Set
from datetime import datetime, timedelta, timezone
from sec_miner.config.loader import config
from sec_miner.persistence.message_bus.filing_event.event_broker import FilingEventBroker
from sec_miner.persistence.message_bus.filing_event.types import FilingEvent, FilingEventData
from sec_miner.persistence.mongodb.database import MongoDbContext
from sec_miner.persistence.mongodb.models import SECFiling
from sec_miner.persistence.sql.database import DbContext
from sec_miner.sec.processors.company_processor import CompanyProcessor
from sec_miner.sec.processors.types import UnprocessedFiling, ProcessNewFilingsResult
from sec_miner.sec.sec_client import SECClient
from sec_miner.sec.utils import normalize_cik
from sec_miner.utils.logger_factory import get_logger
import uuid
import json

from sec_miner.utils.time import parse_datetime

logger = get_logger(__name__)


class FilingProcessor:
    def __init__(self, redis_client: Redis,
                 sec_client: SECClient,
                 company_processor: CompanyProcessor,
                 mongodb_context: MongoDbContext,
                 db_context: DbContext,
                 event_broker: FilingEventBroker):
        self.redis_client = redis_client
        self.company_processor = company_processor
        self.mongodb_context = mongodb_context
        self.sec_client = sec_client
        self.db_context = db_context
        self.event_broker = event_broker

        # Constants for queue names and processing
        self.FILING_QUEUE = config.FILING_QUEUE
        self.FILING_QUEUE_CRITICAL_FAILURE = config.FILING_QUEUE_CRITICAL_FAILURE
        self.FAILED_QUEUE = config.FILING_QUEUE_FAILURES
        self.UNRECOVERABLE_FAILURES = config.FILING_QUEUE_UNRECOVERABLE_FAILURES
        self.MAX_RETRIES = config.FILING_QUEUE_MAX_RETRIES
        self.RETRY_DELAY = config.FILING_QUEUE_RETRY_DELAY

    @staticmethod
    def _group_filings_by_cik(filings: List[UnprocessedFiling]) -> Dict[str, List[UnprocessedFiling]]:
        """Group filings by CIK and sort each group by date"""
        return {
            cik: sorted(group, key=lambda x: x.date_filed, reverse=True)
            for cik, group in groupby(
                sorted(filings, key=lambda x: normalize_cik(x.cik)),
                key=lambda x: normalize_cik(x.cik)
            )
        }

    def _requeue_filings(self, filings: List[UnprocessedFiling], error: str):
        num_retry_filings = 0

        pipeline = self.redis_client.pipeline()
        """Re-queue filings with retry metadata"""
        for filing in filings:
            filing.retry_count += 1
            filing.last_error = error
            filing.last_attempt = datetime.now(timezone.utc)

            if filing.retry_count <= self.MAX_RETRIES:
                # Add to delayed retry queue
                retry_at = datetime.now(timezone.utc) + timedelta(seconds=self.RETRY_DELAY)
                filing.retry_at = retry_at

                pipeline.rpush(
                    self.FAILED_QUEUE,
                    json.dumps(filing.to_json())
                )
                num_retry_filings += 1
            else:
                # Log dead letter for manual review
                filing.final_failure = True
                pipeline.rpush(
                    self.UNRECOVERABLE_FAILURES,
                    json.dumps(filing.to_json())
                )

        pipeline.execute()
        logger.error(f"Queued {num_retry_filings} filings for retries; "
                     f"{len(filings) - num_retry_filings} were stored as dead letters.")

    @staticmethod
    def _new_filings_to_event(cik: str, new_filings: List[SECFiling]):
        timestamp = datetime.now()

        return FilingEvent(
            cik=cik,
            event_type='new_filing',
            event_id=str(uuid.uuid4()),
            timestamp=timestamp,
            filings=[FilingEventData(
                form_type=filing.form,
                filing_date=filing.filing_date,
                accession_number=filing.accession_number
            ) for filing in new_filings]
        )

    def _process_filing_batch(self, filings_by_cik: Dict[str, List[UnprocessedFiling]],
                              processed_file_accessions: Set[str]):
        """Process a batch of filings by fetching complete filing history for each CIK"""

        for cik, filing_entries in filings_by_cik.items():
            try:
                # Get all filings at once instead of individual requests
                filing_history = self.sec_client.get_company_filings(cik)

                # Filter to just the new filings we need (new filings)
                needed_accession_numbers = {entry.accession_number for entry in filing_entries}
                new_filings = [
                    filing for filing in filing_history.filings
                    if filing.accession_number in needed_accession_numbers
                ]

                if new_filings:
                    self.mongodb_context.insert_filings_into_history(new_filings, cik)
                    # Use the most recent filing date from our new filings
                    self.db_context.update_company_last_known_filing_date(
                        cik,
                        max(filing.filing_date for filing in new_filings)
                    )

                    # Publish info about new filings to our message bus for consumers
                    filing_event = self._new_filings_to_event(cik, new_filings)
                    self.event_broker.queue_filings_event(filing_event)

                    # Mark all successfully processed filings
                    for filing in new_filings:
                        processed_file_accessions.add(filing.accession_number)

            except Exception as e:
                logger.error(f"Error processing new filings for CIK {cik}: {str(e)}")
                self._requeue_filings(filing_entries, str(e))
                continue

    @staticmethod
    def deserialize_queued_filings(filing_entries: List[bytes]) -> List[UnprocessedFiling]:
        filings = []

        for entry in filing_entries:
            data = json.loads(entry.decode('utf-8'))

            date_filed = datetime.strptime(data['date_filed'], '%Y-%m-%d %H:%M:%S')

            last_attempt = parse_datetime(data['last_attempt'], '%Y-%m-%d %H:%M:%S.%f') \
                if data['last_attempt'] else None

            retry_at = parse_datetime(data['retry_at'], '%Y-%m-%d %H:%M:%S.%f') \
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

    def process_new_filings(self) -> ProcessNewFilingsResult:
        """Main method to process new filings with error handling"""

        # Get queue length first
        queue_length = self.redis_client.llen(self.FILING_QUEUE)
        if queue_length == 0:
            logger.info("No new filings to process despite monitoring execution.")
            return ProcessNewFilingsResult(
                total_new_filings=0,
                total_failed_filings=0,
                total_companies_discovered=0,
                total_companies_identified_to_update=0,
                message="No new filings to process despite monitoring execution."
            )

        filing_entries = self.redis_client.lpop(self.FILING_QUEUE, queue_length)

        if not filing_entries:
            logger.warning(f"No new filings to process monitoring execution despite queue reading: "
                           f"${queue_length} items.")
            return ProcessNewFilingsResult(
                total_new_filings=0,
                total_failed_filings=0,
                total_companies_discovered=0,
                total_companies_identified_to_update=0,
                message=f"No new filings to process monitoring execution despite queue reading: "
                        f"${queue_length} items."
            )

        try:
            filings_to_process = self.deserialize_queued_filings(filing_entries)
        except Exception as e:
            logger.error(f"Critical error: Failed to parse queued filings: {e}")
            # Put them into a queue for critical failures for manual review.
            pipeline = self.redis_client.pipeline()
            for entry in filing_entries:
                pipeline.rpush(self.FILING_QUEUE_CRITICAL_FAILURE, entry)
            pipeline.execute()
            return ProcessNewFilingsResult(
                total_new_filings=0,
                total_failed_filings=0,
                total_companies_discovered=0,
                total_companies_identified_to_update=0,
                message=f"Failed to parse queued filings: {e}"
            )

        # Set to track successfully processed filings
        processed_filing_accessions = set()

        discover_companies_result = None
        try:
            # Group filings by CIK
            filings_by_cik = self._group_filings_by_cik(filings_to_process)

            # Process any new companies in the filings first.
            discover_companies_result = self.company_processor.discover_companies_from_filings(filings_by_cik)

            # Process the batches for any companies which aren't new.
            # Newly identified companies will have their full histories processed later by the company processor.
            # Filter the filings_by_cik to get rid of these newly identified companies.

            filings_by_cik = {cik: filings for cik, filings in filings_by_cik.items()
                              if cik not in discover_companies_result.new_company_ciks}

            self._process_filing_batch(filings_by_cik, processed_filing_accessions)

            logger.info(f"Processed {len(filings_to_process)} filings")

            return ProcessNewFilingsResult(
                total_new_filings=len(processed_filing_accessions),
                total_failed_filings=queue_length - len(processed_filing_accessions),
                total_companies_discovered=discover_companies_result.total_new_companies,
                total_companies_identified_to_update=discover_companies_result.total_companies_to_update,
                message="Successfully processed filings"
            )

        except Exception as e:
            logger.error(f"Critical error in processing filings: {str(e)}")

            # If something fails, requeue only unprocessed filings
            unprocessed_filings = [
                filing for filing in filings_to_process
                if filing.accession_number not in processed_filing_accessions
            ]

            if unprocessed_filings:
                self._requeue_filings(unprocessed_filings, str(e))

            return ProcessNewFilingsResult(
                total_new_filings=len(processed_filing_accessions),
                total_failed_filings=len(unprocessed_filings),
                total_companies_discovered=getattr(discover_companies_result, 'total_new_companies', 0),
                total_companies_identified_to_update=getattr(discover_companies_result, 'total_companies_to_update', 0),
                message=f"Critical error in processing filings: {str(e)}"
            )

    def retry_failed_filings(self):
        """Process the failed queue for retries"""
        while True:
            failed_filing = self.redis_client.lpop(self.FAILED_QUEUE)
            if not failed_filing:
                break

            filing = json.loads(failed_filing)
            retry_at = parse_datetime(filing['retry_at'], '%Y-%m-%d %H:%M:%S.%f')

            if datetime.now(timezone.utc) >= retry_at:
                logger.info(f"Retrying failed filing {filing['entry_hash']}")
                self.redis_client.rpush(
                    self.FILING_QUEUE,
                    json.dumps(filing)
                )
            else:
                # Put it back if it's not time yet
                self.redis_client.rpush(self.FAILED_QUEUE, failed_filing)
