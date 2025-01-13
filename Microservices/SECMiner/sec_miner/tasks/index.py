import pyodbc
import redis
from sec_miner.celery_app import celery_app
from sec_miner.config import Config
from sec_miner.sec.processors.index_processor import IndexProcessor
from sec_miner.sec.utils import get_quarters_to_check
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


@celery_app.task(
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60},
    name='tasks.index.process_index_updates'
)
def process_index():
    """Processes and stores new companies in SQL database"""
    redis_client = redis.from_url(Config.REDIS_URL)
    index_processor = IndexProcessor(redis_client)

    quarters_to_process = get_quarters_to_check()

    for year, quarter in quarters_to_process:
        logger.info(f'Processing index updates for {year} Q{quarter}')
        index_processor.process_index_updates(year, quarter)
