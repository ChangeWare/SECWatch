from pymongo import MongoClient
from typing import List, Optional
from datetime import datetime
from pymongo.synchronous.database import Database
from sec_miner.config import Config
from sec_miner.persistence.mongodb.models import FinancialMetricDocument, FinancialMetric, MetricDataPoint, \
    CompanyFilingHistoryDocument
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


def get_db():
    """Get database connection"""
    client = MongoClient(Config.MONGODB_CONNECTION)
    db = client.get_database(Config.MONGODB_DBNAME)

    # Ensure the 'financial_metrics' collection is created and indexes are set up
    if 'financial_metrics' not in db.list_collection_names():
        db.create_collection('financial_metrics')
        setup_indexes(db)

    return db


def upsert_filing_history_doc(filing_history_doc: CompanyFilingHistoryDocument) -> None:
    """Update or insert a company's filing history document"""
    try:
        db = get_db()
        collection = db.filing_history
        collection.update_one(
            {"cik": filing_history_doc.cik},
            {"$set": filing_history_doc.dict(by_alias=True)},
            upsert=True
        )
        logger.log(15, f"Upserted filing history for CIK {filing_history_doc.cik}")
    except Exception as e:
        logger.error(f"Error upserting filing history for CIK {filing_history_doc.cik}: {str(e)}")
        raise


def upsert_metric_doc(metric_doc: FinancialMetricDocument) -> None:
    """Update or insert a financial metric document"""
    try:
        db = get_db()
        collection = db.financial_metrics
        collection.update_one(
            {"cik": metric_doc.cik, "metric_type": metric_doc.metric_type},
            {"$set": metric_doc.dict(by_alias=True)},
            upsert=True
        )
        logger.log(15, f"Upserted financial metric for CIK {metric_doc.cik}")
    except Exception as e:
        logger.error(f"Error upserting metric for CIK {metric_doc.cik}: {str(e)}")
        raise


def get_metric_doc(cik: str, metric_doc: FinancialMetric) -> Optional[FinancialMetricDocument]:
    """Retrieve a specific metric for a company"""
    try:
        db = get_db()
        collection = db.financial_metrics
        doc = collection.find_one({"cik": cik, "metric": metric_doc})
        return FinancialMetricDocument(**doc) if doc else None
    except Exception as e:
        logger.error(f"Error retrieving metric for CIK {cik}: {str(e)}")
        raise


def get_latest_data_points(cik: str, metric_doc: FinancialMetric, limit: int = 4) -> List[MetricDataPoint]:
    """Get the most recent data points for a metric"""
    try:
        db = get_db()
        collection = db.financial_metrics
        doc = collection.find_one(
            {"cik": cik, "metric": metric_doc},
            {"data_points": {"$slice": -limit}}
        )
        if doc and doc.get("data_points"):
            return [MetricDataPoint(**dp) for dp in doc["data_points"]]
        return []
    except Exception as e:
        logger.error(f"Error retrieving latest data points for CIK {cik}: {str(e)}")
        raise


def get_metrics_by_date_range(
        cik: str,
        metric: FinancialMetric,
        start_date: datetime,
        end_date: datetime
) -> List[MetricDataPoint]:
    """Get metric data points within a date range"""
    try:
        db = get_db()
        collection = db.financial_metrics
        doc = collection.find_one({
            "cik": cik,
            "metric": metric,
            "data_points": {
                "$elemMatch": {
                    "end_date": {
                        "$gte": start_date,
                        "$lte": end_date
                    }
                }
            }
        })

        if not doc:
            return []

        filtered_points = [
            dp for dp in doc["data_points"]
            if start_date <= dp["end_date"] <= end_date
        ]

        return [MetricDataPoint(**dp) for dp in filtered_points]
    except Exception as e:
        logger.error(f"Error retrieving metrics by date range for CIK {cik}: {str(e)}")
        raise


def setup_indexes(db: Database):
    """Setup database indexes"""
    collection = db.financial_metrics
    collection.create_index([("cik", 1), ("metric", 1)], unique=True)
    collection.create_index([("last_updated", 1)])