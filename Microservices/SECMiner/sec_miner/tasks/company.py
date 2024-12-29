from datetime import datetime
from typing import List, Dict
from sec_miner.celery_app import celery_app
from sec_miner.config import Config
from sec_miner.persistence.mongodb.database import upsert_metric_doc
from sec_miner.persistence.sql.database import find_missing_ciks, upsert_companies, store_company_financial_metric, \
    get_all_company_ciks
from sec_miner.utils.logger_factory import get_logger
import sec_miner.sec.sec_client as sec_client
import logging
import redis
import pyodbc
import json

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

    if len(missing_ciks) > 0:
        process_companies.delay(missing_ciks)


@celery_app.task(
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60},
    name='tasks.company.process_companies'
)
def process_companies(company_ciks: List[str]):
    """Processes and stores new companies in SQL database"""
    redis_client = redis.from_url(Config.REDIS_URL)
    batch_size = 100
    processed_companies = []

    # If company_ciks is empty, process all companies in the SEC
    if not company_ciks:
        company_list = sec_client.get_company_list()
        company_ciks = [str(c['cik_str']) for c in company_list]

    # Get the last processed index from Redis
    last_index = int(redis_client.get('sec:last_companies_processed_index') or 0)

    for i, cik in enumerate(company_ciks[last_index:]):
        # Gather additional company info from SEC
        company = sec_client.get_company_details(cik)
        processed_companies.append(company)
        logger.log(logging.INFO, f"Processed new company: {company.Name}")

        if len(processed_companies) >= batch_size:
            logger.log(logging.INFO, f"Storing {len(processed_companies)} new companies")
            upsert_companies(processed_companies)
            new_companies = []

            # Save the current index to Redis
            redis_client.set('sec:last_companies_processed_index', i + 1)

    # Insert any remaining companies
    if processed_companies:
        logger.log(logging.INFO, f"Storing {len(processed_companies)} new companies")
        upsert_companies(processed_companies)

    # Reset the last processed index
    redis_client.set('sec:last_companies_processed_index', 0)

    process_companies_financial_metrics.delay(new_companies)


@celery_app.task(
    max_retries=3,
    autoretry_for=(pyodbc.OperationalError,),
    retry_kwargs={'countdown': 60},
    name='tasks.company.process_companies_financial_metrics'
)
def process_companies_financial_metrics(company_ciks: List[str]):
    """Processes and stores financial metrics for new companies"""

    # If company_ciks is empty, process all companies in the database
    if not company_ciks:
        company_ciks = get_all_company_ciks()

    for cik in company_ciks:
        financial_metrics_results = sec_client.get_company_financial_metrics(cik)

        for result in financial_metrics_results:
            if (result.metric_document is not None) and (result.financial_metric is not None):
                upsert_metric_doc(result.metric_document)
                store_company_financial_metric(result.financial_metric)
