import pyodbc
from sec_miner.celery_app import celery_app
from sec_miner.config.loader import config
from sec_miner.persistence.mongodb.database import MongoDbContext
from sec_miner.persistence.sql.database import DbContext
from sec_miner.sec.processors.company_processor import CompanyProcessor
from sec_miner.sec.processors.filing_processor import FilingProcessor
from sec_miner.sec.sec_client import SECClient
import redis
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


@celery_app.task(name='tasks.filings.check_new_filings')
def check_new_filings():
    """Checks for new filings in the queue and triggers processing if needed"""
    redis_client = redis.from_url(config.REDIS_URL)

    # Check if there are any filings in the queue
    queue_length = redis_client.llen(config.FILING_QUEUE)

    if queue_length > 0:
        # If there are filings to process, trigger the processing task
        process_new_filings.delay()
        logger.info(f"Triggered processing of {queue_length} new filings")


@celery_app.task(
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60},
    name='tasks.filings.process_new_filings'
)
def process_new_filings():
    """Processes and stores new companies in SQL database"""
    redis_client = redis.from_url(config.REDIS_URL)
    mongodb_context = MongoDbContext()
    db_context = DbContext()
    sec_client = SECClient(db_context, redis_client)
    company_processor = CompanyProcessor(redis_client, sec_client, db_context)
    filing_processor = FilingProcessor(redis_client, sec_client, company_processor, mongodb_context, db_context)

    filing_processor.process_new_filings()
