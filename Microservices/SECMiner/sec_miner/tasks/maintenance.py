from sec_miner.celery_app import celery_app
from sec_miner.config import Config
import redis
import logging

logger = logging.getLogger(__name__)
redis_client = redis.from_url(Config.REDIS_URL)


@celery_app.task(
    bind=True,
    name='tasks.maintenance.cleanup_stale_data'
)
def cleanup_stale_data():
    """Remove stale data from Redis"""
    try:
        count = 0
        for key in redis_client.scan_iter("filing:*"):
            if not redis_client.get(f"access:{key}"):
                redis_client.delete(key)
                count += 1

        logger.info(f"Cleaned up {count} stale entries")
        return {"status": "success", "cleaned_count": count}

    except Exception as e:
        logger.error(f"Error during cleanup: {e}")
        raise
