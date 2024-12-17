from datetime import datetime
from sec_miner.celery_app import celery_app
from sec_miner.config import Config
import logging
import requests
import redis

logger = logging.getLogger(__name__)
redis_client = redis.from_url(Config.REDIS_URL)


@celery_app.task(
    bind=True,
    name='tasks.company.update_company_list'  # Explicit simple name
)
def update_company_list(self):
    """Update master list of companies"""
    try:
        response = requests.get(
            "https://www.sec.gov/files/company_tickers.json",
            headers={'User-Agent': Config.SEC_USER_AGENT}
        )
        companies = response.json()

        pipeline = redis_client.pipeline()
        for cik, company_data in companies.items():
            pipeline.hset(
                f"company:{cik}",
                mapping={
                    'ticker': company_data['ticker'],
                    'name': company_data['title'],
                    'updated_at': datetime.now().isoformat(),
                    'cik': cik
                }
            )
            # Store searchable indices
            pipeline.set(f"company:name:{company_data['title'].lower()}", cik)
            pipeline.set(f"company:ticker:{company_data['ticker'].lower()}", cik)
            pipeline.sadd('company:names', company_data['title'].lower())
            pipeline.sadd('company:tickers', company_data['ticker'].lower())

        pipeline.execute()

        logger.info("Successfully updated company list")
        return {"status": "success", "companies_count": len(companies)}

    except Exception as e:
        logger.error(f"Error updating company list: {e}")
        raise
