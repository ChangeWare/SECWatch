import httpx
import pyodbc
import redis
from sec_miner.celery_app import celery_app
from sec_miner.config.loader import config
from sec_miner.persistence.mongodb.database import MongoDbContext
from sec_miner.sec.processors.index_processor import IndexProcessor
from sec_miner.sec.utils import get_current_year, get_current_quarter
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


@celery_app.task(
    name='tasks.maintenance.process_index_updates',
    acks_late=True,
    max_retries=3,
    autoretry_for=(redis.RedisError, httpx.TimeoutException),
    retry_kwargs={'countdown': 60}
)
def process_index():
    """Processes and stores new companies in SQL database"""
    redis_client = redis.from_url(config.REDIS_URL)
    index_processor = IndexProcessor(redis_client)
    mongodb_context = MongoDbContext()

    cur_year = get_current_year()
    cur_quarter = get_current_quarter()
    result = index_processor.process_index_updates(cur_year, cur_quarter)
    mongodb_context.record_new_indexes_processing_result(result)


@celery_app.task(
    name='tasks.maintenance.process_historical_indices',
    acks_late=True,
    max_retries=3,
    autoretry_for=(redis.RedisError, httpx.TimeoutException),
    retry_kwargs={'countdown': 60}
)
def process_historical_indices():
    """Processes and stores new companies in SQL database"""
    redis_client = redis.from_url(config.REDIS_URL)
    index_processor = IndexProcessor(redis_client)
    mongodb_context = MongoDbContext()

    for year in range(2000, 2007):
        for quarter in range(1, 5):
            result = index_processor.process_index_updates(year, quarter)
            mongodb_context.record_new_indexes_processing_result(result)


@celery_app.task(
    bind=True,
    name='tasks.maintenance.cleanup_stale_data'
)
def cleanup_stale_data():
    """Remove stale data from Redis"""
    try:
        pass

    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
        raise
