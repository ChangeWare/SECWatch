from pymongo import MongoClient
from typing import List, Optional
from datetime import datetime
from pymongo.synchronous.database import Database
from sec_miner.config import Config
from sec_miner.persistence.mongodb.models import FinancialMetricDocument, FinancialMetric, MetricDataPoint, \
    CompanyFilingHistoryDocument, SECFiling
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


class MongoDbContext:
    def __init__(self):
        self.client = MongoClient(Config.MONGODB_CONNECTION)
        self.db = self.client.get_database(Config.MONGODB_DBNAME)

        # Ensure the 'financial_metrics' collection is created and indexes are set up
        if 'financial_metrics' not in self.db.list_collection_names():
            self.db.create_collection('financial_metrics')
            self.db.financial_metrics.create_index([("cik", 1), ("metric", 1)], unique=True)
            self.db.financial_metrics.create_index([("last_updated", 1)])

        if 'filing_history' not in self.db.list_collection_names():
            self.db.create_collection('filing_history')
            self.db.filing_history.create_index([("cik", 1)], unique=True)

    def upsert_filing_history_doc(self, filing_history_doc: CompanyFilingHistoryDocument):
        """Update or insert a company's filing history document"""
        try:
            collection = self.db.filing_history
            collection.update_one(
                {"cik": filing_history_doc.cik},
                {"$set": filing_history_doc.dict(by_alias=True)},
                upsert=True
            )
            logger.log(15, f"Upserted filing history for CIK {filing_history_doc.cik}")
        except Exception as e:
            logger.error(f"Error upserting filing history for CIK {filing_history_doc.cik}: {str(e)}")
            raise

    def insert_filings_into_history(self, filings: List[SECFiling], cik: str):
        """
        Insert multiple new filings into a company's filing history document
        """

        if not filings:
            logger.info(f"No filings provided for CIK {cik}")
            raise ValueError("No filings provided")

        try:
            collection = self.db.filing_history

            # Get current document
            current_doc = collection.find_one({"cik": cik})

            if current_doc:
                # Create set of existing accession numbers for efficient lookup
                existing_accessions = {
                    f["accession_number"] for f in current_doc["filings"]
                }

                # Filter out any filings we already have
                new_filings = [
                    f for f in filings
                    if f.accession_number not in existing_accessions
                ]

                if not new_filings:
                    logger.info(f"No new filings to insert for CIK {cik}")
                    return

                # Calculate new metadata
                all_dates = [current_doc["metadata"]["first_filed"],
                             current_doc["metadata"]["last_filed"]] + \
                            [f.filing_date for f in new_filings]

                new_last_filed = max(all_dates)
                new_first_filed = min(all_dates)
            else:
                new_filings = filings
                filing_dates = [f.filing_date for f in filings]
                new_last_filed = max(filing_dates)
                new_first_filed = min(filing_dates)

            # Perform batch update
            update_result = collection.update_one(
                {"cik": cik},
                {
                    "$push": {
                        "filings": {
                            "$each": [f.dict(by_alias=True) for f in new_filings]
                        }
                    },
                    "$set": {
                        "metadata.last_filed": new_last_filed,
                        "metadata.first_filed": new_first_filed,
                        "metadata.last_fetched": datetime.utcnow(),
                        "metadata.date_range": {
                            "start": new_first_filed,
                            "end": new_last_filed
                        }
                    },
                    "$inc": {
                        "metadata.total_filings": len(new_filings)
                    },
                    "$addToSet": {
                        "metadata.form_types": {
                            "$each": list({f.form for f in new_filings if f.form})
                        }
                    }
                },
                upsert=True
            )

            logger.log(15, f"Inserted {len(new_filings)} new filings for CIK {cik}")

        except Exception as e:
            logger.error(f"Error inserting filings for CIK {cik}: {str(e)}")
            raise

    def upsert_metric_doc(self, metric_doc: FinancialMetricDocument) -> None:
        """Update or insert a financial metric document"""
        try:
            collection = self.db.financial_metrics
            collection.update_one(
                {"cik": metric_doc.cik, "metric_type": metric_doc.metric_type},
                {"$set": metric_doc.dict(by_alias=True)},
                upsert=True
            )
            logger.log(15, f"Upserted financial metric for CIK {metric_doc.cik}")
        except Exception as e:
            logger.error(f"Error upserting metric for CIK {metric_doc.cik}: {str(e)}")
            raise

    def get_metric_doc(self, cik: str, metric_doc: FinancialMetric) -> Optional[FinancialMetricDocument]:
        """Retrieve a specific metric for a company"""
        try:
            collection = self.db.financial_metrics
            doc = collection.find_one({"cik": cik, "metric": metric_doc})
            return FinancialMetricDocument(**doc) if doc else None
        except Exception as e:
            logger.error(f"Error retrieving metric for CIK {cik}: {str(e)}")
            raise

    def get_latest_data_points(self, cik: str, metric_doc: FinancialMetric, limit: int = 4) -> List[MetricDataPoint]:
        """Get the most recent data points for a metric"""
        try:
            collection = self.db.financial_metrics
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
            self,
            cik: str,
            metric: FinancialMetric,
            start_date: datetime,
            end_date: datetime
    ) -> List[MetricDataPoint]:
        """Get metric data points within a date range"""
        try:
            collection = self.db.financial_metrics
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

    def get_last_filing_date(self, cik: str) -> Optional[datetime]:
        """Get the last processed filing date for a company"""
        try:
            doc: CompanyFilingHistoryDocument = self.db.filing_history.find_one({"cik": cik})
            return doc.metadata.last_filed if doc else None
        except Exception as e:
            logger.error(f"Error retrieving last filing date for CIK {cik}: {str(e)}")
            raise

    def company_has_filing_history(self, cik: str) -> bool:
        """Check if a company has filing history in the database"""
        try:
            return self.db.filing_history.find_one({"cik": cik}) is not None
        except Exception as e:
            logger.error(f"Error retrieving last filing date for CIK {cik}: {str(e)}")
            raise
