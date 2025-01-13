from redis import Redis
from sec_miner.persistence.mongodb.database import MongoDbContext
from sec_miner.sec.processors.company_processor import CompanyProcessor
from sec_miner.sec.sec_client import SECClient
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


class FilingProcessor:
    def __init__(self, redis_client: Redis,
                 sec_client: SECClient,
                 company_processor: CompanyProcessor,
                 mongodb_context: MongoDbContext):
        self.redis_client = redis_client
        self.company_processor = company_processor
        self.mongodb_context = mongodb_context
        self.sec_client = sec_client

    def process_new_filings(self):
        try:
            # Get length first
            queue_length = self.redis_client.llen("sec:processing:filing_queue")
            if queue_length > 0:
                new_filings = self.redis_client.lpop("sec:processing:filing_queue", queue_length)
            else:
                logger.log(0, f"No new filings to process")
                return

            # Pass any new filings on to the company processor so that it can identify new companies.
            self.company_processor.discover_companies_from_filings(new_filings)

            # Attempt to group the filings by CIK so that we can process them in bulk.
            filings_by_cik = {}
            for filing_entry in new_filings:
                if filing_entry['cik'] not in filings_by_cik:
                    filings_by_cik[filing_entry['cik']] = []
                filings_by_cik[filing_entry['cik']].append(filing_entry)

            # Process the actual filing.
            for cik in filings_by_cik:
                cik_filing_entries = filings_by_cik[cik]

                # First we will check that we even have filing history for this company.
                # If we don't, we'll postpone processing this filing, as the company processor will
                # eventually get to it.
                if not self.mongodb_context.company_has_filing_history(cik):
                    logger.info(f"Postponing processing of filing for {cik}")
                    continue

                filings = []
                for cik_filing_entry in cik_filing_entries:
                    filings.append(self.sec_client.get_company_filing(cik, cik_filing_entry['accession_number']))
                self.mongodb_context.insert_filings_into_history(filings, cik)

        except Exception as e:
            logger.error(f"Error processing index updates: {str(e)}")
