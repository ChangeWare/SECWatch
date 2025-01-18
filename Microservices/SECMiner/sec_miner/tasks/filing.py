import pyodbc
from sec_miner.celery_app import celery_app
from sec_miner.config.loader import config
from sec_miner.persistence.message_bus.filing_event.event_broker import FilingEventBroker
from sec_miner.persistence.mongodb.database import MongoDbContext
from sec_miner.persistence.sql.database import DbContext
from sec_miner.sec.processors.company_processor import CompanyProcessor
from sec_miner.sec.processors.filing_processor import FilingProcessor
from sec_miner.sec.sec_client import SECClient
from sec_miner.utils.logger_factory import get_logger
import redis


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
    name='tasks.filings.process_new_filings',
    acks_late=True,
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60}
)
def process_new_filings():
    """Processes and stores new companies in SQL database"""
    redis_client = redis.from_url(config.REDIS_URL)
    mongodb_context = MongoDbContext()
    db_context = DbContext()
    sec_client = SECClient(db_context, redis_client)
    company_processor = CompanyProcessor(redis_client, sec_client,
                                         db_context, mongodb_context)
    filing_event_broker = FilingEventBroker()
    filing_processor = FilingProcessor(redis_client, sec_client,
                                       company_processor, mongodb_context,
                                       db_context, filing_event_broker)

    result = filing_processor.process_new_filings()
    mongodb_context.record_new_filings_processing_result(result)


