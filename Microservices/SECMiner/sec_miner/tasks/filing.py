from sec_miner.celery_app import celery_app
from sec_miner.config import Config
from sec_miner.utils.sec_rate_limit import sec_rate_limit
import redis
import requests
import logging


logger = logging.getLogger(__name__)
redis_client = redis.from_url(Config.REDIS_URL)


@celery_app.task(
    bind=True,
    max_retries=3,
    rate_limit='10/s',
    name='tasks.filing.fetch_filing'
)
@sec_rate_limit
def fetch_filing(self, cik: str, accession_number: str):
    """Fetch a specific filing from SEC"""
    try:
        url = f"{Config.SEC_API_BASE_URL}/{cik}/{accession_number}.txt"
        response = requests.get(
            url,
            headers={'User-Agent': Config.SEC_USER_AGENT}
        )
        response.raise_for_status()

        # Store in Redis with 24-hour expiration
        redis_client.setex(
            f"filing:{accession_number}",
            86400,
            response.content
        )

        logger.info(f"Successfully fetched filing {accession_number}")
        return {"status": "success", "accession_number": accession_number}

    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching filing {accession_number}: {e}")
        raise self.retry(exc=e, countdown=60)
