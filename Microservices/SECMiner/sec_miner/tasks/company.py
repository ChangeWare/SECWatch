import json
from datetime import datetime
from typing import List, Dict
from sec_miner.celery_app import celery_app
from sec_miner.config import Config
from sec_miner.utils.logger_factory import get_logger
from sec_miner.database import find_missing_ciks, store_new_companies
import sec_miner.sec_client as sec_client
import logging
import redis


logger = get_logger(__name__)


@celery_app.task(
    bind=True,
    name='tasks.company.update_company_list'
)
def update_company_list(self):
    """Update master list of companies"""
    redis_client = redis.from_url(Config.REDIS_URL)

    companies = sec_client.get_company_list()

    data = {
        'timestamp': datetime.utcnow().isoformat(),
        'companies': companies
    }
    redis_client.set('sec:company_list', json.dumps(data))

    identify_new_companies.delay()


@celery_app.task(name='tasks.company.compare_companies')
def identify_new_companies():
    """Compares SEC company list (stored in redis) with existing companies in database
    and queues processing for new companies"""
    redis_client = redis.from_url(Config.REDIS_URL)

    # Get company list from Redis
    data = json.loads(redis_client.get('sec:company_list'))
    company_data = data['companies']
    sec_companies = {str(c['cik_str']): c for c in company_data}

    # Process in batches to avoid memory issues
    sec_ciks = list(sec_companies.keys())
    missing_ciks = find_missing_ciks(sec_ciks)
    new_companies = [sec_companies[cik] for cik in missing_ciks]

    if len(new_companies) > 0:
        process_new_companies.delay(new_companies)


@celery_app.task(name='tasks.company.process_new_companies')
def process_new_companies(companies: List[Dict]):
    """Processes and stores new companies in SQL database"""
    redis_client = redis.from_url(Config.REDIS_URL)
    batch_size = 100
    new_companies = []

    # Get the last processed index from Redis
    last_index = int(redis_client.get('sec:last_companies_processed_index') or 0)

    for i, company_data in enumerate(companies[last_index:], start=last_index):
        # Gather additional company info from SEC
        cik = str(company_data['cik_str'])
        company = sec_client.get_company_details(cik)
        new_companies.append(company)
        logger.log(logging.INFO, f"Processed new company: {company.Name}")

        if len(new_companies) >= batch_size:
            store_new_companies(new_companies)
            new_companies = []

            # Save the current index to Redis
            redis_client.set('sec:last_companies_processed_index', i + 1)

    # Insert any remaining companies
    if new_companies:
        store_new_companies(new_companies)

    # Reset the last processed index
    redis_client.set('sec:last_companies_processed_index', 0)




