import logging
from datetime import datetime
from typing import List, Dict, Optional
from redis import Redis
from sec_miner.config.loader import config
from sec_miner.persistence.sql.database import DbContext
from sec_miner.persistence.sql.models import Company
from sec_miner.sec.processors.types import UnprocessedFiling
from sec_miner.sec.sec_client import SECClient
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


class UpdateCompanyInfo:
    def __init__(self, cik: str, name: str, ticker: Optional[str], latest_filing_date: Optional[datetime],
                 latest_filing_type: Optional[str], source: str):
        self.cik = cik
        self.name = name
        self.ticker = ticker
        self.latest_filing_date = latest_filing_date
        self.latest_filing_type = latest_filing_type
        self.source = source


class NewCompanyInfo:
    def __init__(self, cik: str, name: str, ticker: Optional[str], latest_filing_date: Optional[datetime],
                 latest_filing_type: Optional[str], source: str):
        self.cik = cik
        self.name = name
        self.ticker = ticker
        self.latest_filing_date = latest_filing_date
        self.latest_filing_type = latest_filing_type
        self.source = source


class CompanyProcessor:

    def __init__(self, redis_client: Redis, sec_client: SECClient, db_context: DbContext):
        self.redis_client = redis_client
        self.sec_client = sec_client
        self.db_context = db_context

    def process_new_companies(self, batch_size: int = 100) -> List[Company]:
        processed_companies: List[Company] = []
        processed_companies_batch: List[Company] = []

        new_companies_to_process = self.redis_client.llen('sec:processing:new_companies')
        for _ in range(0, new_companies_to_process):
            cik = self.redis_client.rpop('sec:processing:new_companies')
            if not cik:
                break

            company = self.sec_client.get_company_details(cik)
            processed_companies.append(company)
            processed_companies_batch.append(company)
            logger.log(logging.INFO, f"Processed company: {company.name}")

            if len(processed_companies_batch) >= batch_size:
                logger.log(logging.INFO, f"Storing {len(processed_companies_batch)} new companies")
                self.db_context.upsert_companies(processed_companies_batch)
                processed_companies_batch = []

        # Insert any remaining companies
        if processed_companies_batch:
            logger.log(logging.INFO, f"Storing {len(processed_companies_batch)} companies")
            self.db_context.upsert_companies(processed_companies_batch)

        return processed_companies

    def queue_new_companies(self, new_companies: List[NewCompanyInfo]):
        """Queue new companies for additional processing"""
        pipe = self.redis_client.pipeline()

        for company in new_companies:
            pipe.rpush("sec:processing:new_companies", company.cik)

        pipe.execute()

    def queue_companies_needing_updates(self, companies_to_update: List[UpdateCompanyInfo]):
        """Queue companies needing updates for additional processing"""
        pipe = self.redis_client.pipeline()

        for company in companies_to_update:
            pipe.rpush("sec:processing:companies_to_update", company.cik)

        pipe.execute()

    def discover_companies_from_ticker_list(self):
        """
        Fetches ticker list from SEC & attempts to discover new companies within
        """

        ticker_companies = self.sec_client.get_company_ticker_list()
        companies_to_update: List[UpdateCompanyInfo] = []
        new_companies: List[NewCompanyInfo] = []

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
                    NewCompanyInfo(
                        cik=cik,
                        name=company['title'],
                        latest_filing_date=None,  # No recent filing
                        latest_filing_type=None,
                        source='ticker_listing',
                        ticker=company['ticker']
                    )
                )

        self.queue_new_companies(new_companies)
        self.queue_companies_needing_updates(companies_to_update)

    def discover_companies_from_filings(self, filings_by_cik: Dict[str, List[UnprocessedFiling]]):
        """
        Discovers new companies in specified filings

        :param filings_by_cik: Dictionary of CIKs and their filings, grouped by CIK and sorted by date
        """

        ticker_mapping = self.sec_client.get_ticker_mapping()
        companies_to_update: List[UpdateCompanyInfo] = []
        new_companies: List[NewCompanyInfo] = []

        existing_companies = self.db_context.get_all_companies()
        # Turn existing companies into lookup table
        existing_companies = {company.cik: company for company in existing_companies}

        for cik, filings in filings_by_cik.items():
            existing = existing_companies.get(cik)

            # Look only at most recent filing.
            recent_filing = filings[0]

            if existing:
                if existing.last_known_filing_date is None or recent_filing.date_filed > existing.last_known_filing_date:
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
                            latest_filing_date=recent_filing.date_filed,
                            latest_filing_type=recent_filing.form_type,
                            source='master_index',
                            ticker=ticker_mapping.get(cik)
                        )
                    )
            else:
                # If the company is not in our database, mark it as new
                new_companies.append(
                    NewCompanyInfo(
                        cik=cik,
                        name=recent_filing.company_name,
                        latest_filing_date=recent_filing.date_filed,
                        latest_filing_type=recent_filing.form_type,
                        source='master_index',
                        ticker=ticker_mapping.get(cik)
                    )
                )

        self.queue_new_companies(new_companies)
        self.queue_companies_needing_updates(companies_to_update)
