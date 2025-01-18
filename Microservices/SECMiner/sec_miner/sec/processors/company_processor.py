import json
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Set
from redis import Redis
from sec_miner.config.loader import config
from sec_miner.persistence.mongodb.database import MongoDbContext
from sec_miner.persistence.sql.database import DbContext
from sec_miner.persistence.sql.models import Company
from sec_miner.sec.processors.types import UnprocessedFiling, DiscoverCompaniesFromFilingsResult, \
    ProcessNewCompaniesResult, UpdateCompanyInfo, QueuedNewCompanyInfo
from sec_miner.sec.sec_client import SECClient
from sec_miner.sec.utils import normalize_cik
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


class CompanyProcessor:

    def __init__(self, redis_client: Redis, sec_client: SECClient,
                 db_context: DbContext, mongodb_context: MongoDbContext):
        self.redis_client = redis_client
        self.sec_client = sec_client
        self.db_context = db_context
        self.mongodb_context = mongodb_context

        self.NEW_COMPANY_QUEUE = config.NEW_COMPANY_QUEUE
        self.NEW_COMPANY_QUEUE_CRITICAL_FAILURE = config.NEW_COMPANY_QUEUE_CRITICAL_FAILURE
        self.NEW_COMPANY_FAILED_QUEUE = config.NEW_COMPANY_QUEUE_FAILURES
        self.NEW_COMPANY_MAX_RETRIES = config.NEW_COMPANY_QUEUE_MAX_RETRIES
        self.NEW_COMPANY_RETRY_DELAY = config.NEW_COMPANY_QUEUE_RETRY_DELAY
        self.NEW_COMPANY_BATCH_SIZE = config.NEW_COMPANY_BATCH_SIZE
        self.NEW_COMPANY_UNRECOVERABLE_FAILURES = config.NEW_COMPANY_UNRECOVERABLE_FAILURES

        self.UPDATE_COMPANY_QUEUE = config.UPDATE_COMPANY_QUEUE
        self.UPDATE_COMPANY_FAILED_QUEUE = config.UPDATE_COMPANY_QUEUE_FAILURES
        self.UPDATE_COMPANY_MAX_RETRIES = config.UPDATE_COMPANY_QUEUE_MAX_RETRIES
        self.UPDATE_COMPANY_RETRY_DELAY = config.UPDATE_COMPANY_QUEUE_RETRY_DELAY
        self.UPDATE_COMPANY_BATCH_SIZE = config.UPDATE_COMPANY_BATCH_SIZE

    def _requeue_new_companies(self, companies: List[QueuedNewCompanyInfo], error: str):
        """Re-queue filings with retry metadata"""
        num_retry_companies = 0

        pipeline = self.redis_client.pipeline()
        for company in companies:
            company.retry_count += 1
            company.last_error = error
            company.last_attempt = datetime.utcnow()

            if company.retry_count <= self.NEW_COMPANY_MAX_RETRIES:
                # Add to delayed retry queue with exponential backoff
                retry_at = datetime.utcnow() + timedelta(seconds=self.NEW_COMPANY_MAX_RETRIES)
                company.retry_at = retry_at

                pipeline.rpush(
                    self.NEW_COMPANY_FAILED_QUEUE,
                    json.dumps(company.to_json())
                )
                num_retry_companies += 1
            else:
                # Log dead letter for manual review
                company.final_failure = True
                pipeline.rpush(
                    self.NEW_COMPANY_UNRECOVERABLE_FAILURES,
                    json.dumps(company.to_json())
                )

        pipeline.execute()
        logger.error(f"Queued {num_retry_companies} new companies for retries; "
                     f"{len(companies) - num_retry_companies} were stored as dead letters.")

    @staticmethod
    def deserialize_queued_new_companies(company_entries: List[bytes]) -> List[QueuedNewCompanyInfo]:
        companies = []

        for entry in company_entries:
            data = json.loads(entry.decode('utf-8'))

            source_filing_date = datetime.strptime(data['source_filing_date'], '%Y-%m-%d %H:%M:%S')

            last_attempt = datetime.strptime(data['last_attempt'], '%Y-%m-%d %H:%M:%S.%f') \
                if data['last_attempt'] else None

            retry_at = datetime.strptime(data['retry_at'], '%Y-%m-%d %H:%M:%S.%f') \
                if data['retry_at'] else None

            company = QueuedNewCompanyInfo(
                cik=data['cik'],
                source_filing_type=data['source_filing_type'],
                source_filing_date=source_filing_date,
                source=data['source'],
                retry_count=data['retry_count'],
                last_attempt=last_attempt,
                retry_at=retry_at,
                last_error=data['last_error'],
            )

            companies.append(company)

        return companies

    def _store_new_company_batch(self, company_batch: List[Company], companies_to_process: List[QueuedNewCompanyInfo]):
        try:
            logger.log(logging.INFO, f"Storing {len(company_batch)} new companies")
            self.db_context.upsert_companies(company_batch)
        except Exception as e:
            logger.error(f"Error storing new company batch in mongodb: {str(e)}")
            # Reconstruct queued companies from batch
            failed_batch_ciks = set(x.cik for x in company_batch)
            failed_queued_companies = [q_new_c for q_new_c in companies_to_process
                                       if q_new_c.cik in failed_batch_ciks]
            self._requeue_new_companies(failed_queued_companies, str(e))

    def process_new_companies(self) -> ProcessNewCompaniesResult:
        processed_companies: List[Company] = []
        processed_companies_batch: List[Company] = []

        # Get queue length first
        queue_length = self.redis_client.llen(self.NEW_COMPANY_QUEUE)
        if queue_length == 0:
            logger.info("No new companies to process despite monitoring execution.")
            return ProcessNewCompaniesResult(
                new_company_ciks=[],
                total_companies_processed=0,
                total_failed_companies=0,
                message="No new companies to process despite monitoring execution."
            )

        new_company_entries = self.redis_client.lpop(self.NEW_COMPANY_QUEUE, queue_length)

        if not new_company_entries:
            logger.warning(f"No new companies to process monitoring execution despite queue reading: "
                           f"{queue_length} items.")
            return ProcessNewCompaniesResult(
                new_company_ciks=[],
                total_companies_processed=0,
                total_failed_companies=0,
                message=f"No new companies to process monitoring execution despite queue reading: "
                        f"{queue_length} items."
            )

        try:
            companies_to_process = self.deserialize_queued_new_companies(new_company_entries)
        except Exception as e:
            logger.error(f"Failed to parse queued companies: {e}")

            # Put them into a queue for critical failures for manual review.
            pipe = self.redis_client.pipeline()
            for entry in new_company_entries:
                pipe.rpush(self.NEW_COMPANY_QUEUE_CRITICAL_FAILURE, entry)
            pipe.execute()
            return ProcessNewCompaniesResult(
                new_company_ciks=[],
                total_companies_processed=0,
                total_failed_companies=queue_length,
                message=f"Failed to parse queued companies: {e}"
            )

        for queued_new_company in companies_to_process:
            try:
                cik = normalize_cik(queued_new_company.cik)
                company = self.sec_client.get_company_details(cik)
                processed_companies_batch.append(company)
                logger.log(logging.INFO, f"Processed company details: {company.name}")

            except Exception as e:
                logger.error(f"Error fetching filings for CIK {queued_new_company.cik}: {str(e)}")
                self._requeue_new_companies([queued_new_company], str(e))
                continue

            if len(processed_companies_batch) >= self.NEW_COMPANY_BATCH_SIZE:
                self._store_new_company_batch(processed_companies_batch, companies_to_process)
                processed_companies.extend(processed_companies_batch)
                processed_companies_batch = []

        # Insert any remaining companies
        if len(processed_companies_batch) > 0:
            self._store_new_company_batch(processed_companies_batch, companies_to_process)
            processed_companies.extend(processed_companies_batch)

        total_failed_companies = queue_length - len(processed_companies)
        new_company_ciks = [c.cik for c in processed_companies]
        return ProcessNewCompaniesResult(
            new_company_ciks=new_company_ciks,
            total_companies_processed=len(processed_companies),
            total_failed_companies=total_failed_companies,
            message=f"Successfully processed {len(processed_companies)} new companies"
            if total_failed_companies == 0 else
            f"Successfully processed {len(processed_companies)} new companies with {total_failed_companies} errors"
        )

    def queue_new_companies(self, new_companies: List[QueuedNewCompanyInfo]):
        """Queue new companies for additional processing"""
        pipe = self.redis_client.pipeline()

        for company in new_companies:
            pipe.rpush(self.NEW_COMPANY_QUEUE, json.dumps(company.to_json()))

        pipe.execute()

    def queue_companies_needing_updates(self, companies_to_update: List[UpdateCompanyInfo]):
        """Queue companies needing updates for additional processing"""
        pipe = self.redis_client.pipeline()

        for company in companies_to_update:
            pipe.rpush(self.UPDATE_COMPANY_QUEUE, company.cik)

        pipe.execute()

    def discover_companies_from_ticker_list(self):
        """
        Fetches ticker list from SEC & attempts to discover new companies within
        """

        ticker_companies = self.sec_client.get_company_ticker_list()
        companies_to_update: List[UpdateCompanyInfo] = []
        new_companies: List[QueuedNewCompanyInfo] = []

        existing_companies = self.db_context.get_all_companies()
        # Turn existing companies into lookup table
        existing_companies = {company.cik: company for company in existing_companies}

        for company in ticker_companies:
            cik = company['cik_str'].zfill(10)

            existing = existing_companies.get(cik)

            if existing:
                # If the company is in our database, but we haven't seen a filing in a while, update it anyway
                if (datetime.now() - existing.last_known_filing_date).days > config.FORCE_UPDATE_COMPANY_PERIOD_DAYS:
                    companies_to_update.append(
                        UpdateCompanyInfo(
                            cik=cik,
                            name=company['title'],
                            latest_filing_date=None,  # No recent filing
                            latest_filing_type=None,
                            source='ticker_listing',
                            ticker=company['ticker']
                        )
                    )
            else:
                new_companies.append(
                    QueuedNewCompanyInfo(
                        cik=cik,
                        source_filing_date=datetime.now(),
                        source_filing_type='ticker_listing',
                        source='ticker_listing',
                    )
                )

        self.queue_new_companies(new_companies)
        self.queue_companies_needing_updates(companies_to_update)

    def discover_companies_from_filings(self, filings_by_cik: Dict[str, List[UnprocessedFiling]]) \
            -> DiscoverCompaniesFromFilingsResult:
        """
        Discovers new companies in specified filings

        :param filings_by_cik: Dictionary of CIKs and their filings, grouped by CIK and sorted by date
        """

        ticker_mapping = self.sec_client.get_ticker_mapping()
        companies_to_update: List[UpdateCompanyInfo] = []
        new_companies: List[QueuedNewCompanyInfo] = []

        existing_companies = self.db_context.get_all_companies()
        # Turn existing companies into lookup table
        existing_companies = {company.cik: company for company in existing_companies}

        for cik, filings in filings_by_cik.items():
            existing = existing_companies.get(cik)

            # Look only at most recent filing.
            recent_filing = filings[0]

            if existing:
                if (existing.last_known_filing_date is None
                        or recent_filing.date_filed > existing.last_known_filing_date):
                    companies_to_update.append(
                        UpdateCompanyInfo(
                            cik=cik,
                            name=recent_filing.company_name,
                            latest_filing_date=recent_filing.date_filed,
                            latest_filing_type=recent_filing.form_type,
                            source='master_index',
                            ticker=ticker_mapping.get(cik)
                        )
                    )
                # Even if the filing is not new, update the company if it's been a while
                elif (datetime.now() - existing.last_known_filing_date).days > config.FORCE_UPDATE_COMPANY_PERIOD_DAYS:
                    companies_to_update.append(
                        UpdateCompanyInfo(
                            cik=cik,
                            name=recent_filing.company_name,
                            ticker=ticker_mapping.get(cik),
                            latest_filing_date=recent_filing.date_filed,
                            latest_filing_type=recent_filing.form_type,
                            source='master_index'
                        )
                    )
            else:
                # If the company is not in our database, mark it as new
                new_companies.append(
                    QueuedNewCompanyInfo(
                        cik=cik,
                        source_filing_date=recent_filing.date_filed,
                        source_filing_type=recent_filing.form_type,
                        source='master_index'
                    )
                )

        self.queue_new_companies(new_companies)
        self.queue_companies_needing_updates(companies_to_update)

        new_company_ciks = [c.cik for c in new_companies]
        return DiscoverCompaniesFromFilingsResult(
            total_new_companies=len(new_companies),
            total_companies_to_update=len(companies_to_update),
            new_company_ciks=new_company_ciks
        )
