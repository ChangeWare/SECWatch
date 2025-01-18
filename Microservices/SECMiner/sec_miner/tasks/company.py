from typing import List
from sec_miner.celery_app import celery_app
from sec_miner.config.loader import config
from sec_miner.persistence.mongodb.database import MongoDbContext
from sec_miner.persistence.sql.database import DbContext
from sec_miner.sec.processors.company_processor import CompanyProcessor
from sec_miner.sec.sec_client import SECClient
from sec_miner.utils.logger_factory import get_logger
import redis
import pyodbc

logger = get_logger(__name__)


@celery_app.task(name='tasks.company.check_new_companies')
def check_new_companies():
    """Checks for new companies in the queue and triggers processing if needed"""
    redis_client = redis.from_url(config.REDIS_URL)

    # Check if there are any filings in the queue
    queue_length = redis_client.llen(config.NEW_COMPANY_QUEUE)

    if queue_length > 0:
        # If there are filings to process, trigger the processing task
        process_new_companies.delay()
        logger.info(f"Triggered processing of {queue_length} new companies")


@celery_app.task(name='tasks.company.check_companies_needing_update')
def check_companies_needing_update():
    """Checks for new companies in the queue and triggers processing if needed"""
    redis_client = redis.from_url(config.REDIS_URL)

    # Check if there are any filings in the queue
    queue_length = redis_client.llen(config.UPDATE_COMPANY_QUEUE)

    if queue_length > 0:
        # If there are filings to process, trigger the processing task
        # TODO: implement update company processing
        logger.info(f"Triggered processing of {queue_length} for updating")


@celery_app.task(
    name='tasks.company.process_new_companies',
    acks_late=True,
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60}
)
def process_new_companies():
    """Processes and stores new companies in SQL database"""
    redis_client = redis.from_url(config.REDIS_URL)
    db_context = DbContext()
    sec_client = SECClient(db_context, redis_client)
    mongodb_context = MongoDbContext()
    company_processor = CompanyProcessor(redis_client, sec_client,
                                         db_context, mongodb_context)

    result = company_processor.process_new_companies()
    process_companies_financial_metrics.delay(result.new_company_ciks)
    process_companies_filings.delay(result.new_company_ciks)


@celery_app.task(
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60},
    name='tasks.company.process_companies_financial_metrics'
)
def process_companies_financial_metrics(ciks: List[str], all_companies: bool = False):
    """Processes and stores financial metrics for specified companies"""

    mongodb_context = MongoDbContext()
    db_context = DbContext()
    redis_client = redis.from_url(config.REDIS_URL)
    sec_client = SECClient(db_context, redis_client)

    if all_companies:
        # Load all companies
        ciks = db_context.get_all_company_ciks()

    for cik in ciks:
        financial_metrics_results = sec_client.get_company_financial_metrics(cik)
        for result in financial_metrics_results:
            if result.metric_document is not None:
                mongodb_context.upsert_metric_doc(result.metric_document)


@celery_app.task(
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60},
    name='tasks.company.process_companies_filings'
)
def process_companies_filings(ciks: List[str], all_companies: bool = False):
    """Processes all filings for specified companies"""

    db_context = DbContext()
    mongodb_context = MongoDbContext()
    redis_client = redis.from_url(config.REDIS_URL)
    sec_client = SECClient(db_context, redis_client)

    if all_companies:
        # Load all companies ciks
        ciks = db_context.get_all_company_ciks()

    for cik in ciks:
        filing_history = sec_client.get_company_filings(cik)

        mongodb_context.upsert_filing_history_doc(filing_history)

        # Get the latest filing date
        latest_filing_date = filing_history.filings[0].filing_date if filing_history.filings else None
        if latest_filing_date:
            db_context.update_company_last_known_filing_date(cik, latest_filing_date)
