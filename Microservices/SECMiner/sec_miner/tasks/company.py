from typing import List
from sec_miner.celery_app import celery_app
from sec_miner.config import Config
from sec_miner.persistence.mongodb.database import MongoDbContext
from sec_miner.persistence.sql.database import DbContext
from sec_miner.sec.processors.company_processor import CompanyProcessor
from sec_miner.sec.sec_client import SECClient
from sec_miner.utils.logger_factory import get_logger
import redis
import pyodbc

logger = get_logger(__name__)


@celery_app.task(
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60},
    name='tasks.company.process_companies'
)
def process_companies():
    """Processes and stores new companies in SQL database"""
    redis_client = redis.from_url(Config.REDIS_URL)
    db_context = DbContext()
    sec_client = SECClient(db_context, redis_client)
    company_processor = CompanyProcessor(redis_client, sec_client, db_context)

    new_processed_companies = company_processor.process_new_companies()
    process_companies_financial_metrics.delay(new_processed_companies)
    process_companies_filings.delay(new_processed_companies)


@celery_app.task(
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60},
    name='tasks.company.process_companies_financial_metrics'
)
def process_companies_financial_metrics(company_indexes: List[str]):
    """Processes and stores financial metrics for specified companies"""

    mongodb_context = MongoDbContext()
    db_context = DbContext()
    redis_client = redis.from_url(Config.REDIS_URL)
    sec_client = SECClient(db_context, redis_client)

    for cik in company_indexes:
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
def process_companies_filings(company_ciks: List[str]):
    """Processes all filings for specified companies"""

    db_context = DbContext()
    mongodb_context = MongoDbContext()
    redis_client = redis.from_url(Config.REDIS_URL)
    sec_client = SECClient(db_context, redis_client)

    for cik in company_ciks:
        filing_history = sec_client.get_company_filings(cik)
        mongodb_context.upsert_filing_history_doc(filing_history)
