from redis import Redis
from sec_miner.config.loader import config
from sec_miner.celery_app import celery_app
from sec_miner.utils.logger_factory import get_logger
from sec_miner.tasks.filing import process_new_filings
from sec_miner.tasks.company import process_companies

logger = get_logger(__name__)
_redis_client = Redis.from_url(config.REDIS_URL)


@celery_app.task(name='tasks.monitoring.check_new_filings')
def check_new_filings():
    """Checks for new filings in the queue and triggers processing if needed"""
    queue_length = _redis_client.llen(config.FILING_QUEUE)

    if queue_length > 0:
        process_new_filings.delay()
        logger.info(f"Triggered processing of {queue_length} new filings")


@celery_app.task(name='tasks.monitoring.check_company_updates')
def check_company_updates():
    """Checks for companies needing updates and triggers processing"""
    new_company_queue_length = _redis_client.llen('sec:processing:new_companies')
    companies_to_update_queue_length = _redis_client.llen('sec:processing:companies_to_update')

    if new_company_queue_length > 0 or companies_to_update_queue_length > 0:
        process_companies.delay()
        logger.info(f"Triggered processing of companies.")
