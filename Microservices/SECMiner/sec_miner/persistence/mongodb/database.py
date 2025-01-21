from datetime import datetime, timezone
from typing import List, Optional, Dict
from pymongo import MongoClient
from sec_miner.config.loader import config
from sec_miner.persistence.mongodb.models import CompanyConceptDocument, ConceptType, CompanyFilingHistoryDocument, \
    SECFiling, CompanyConceptsMetadataDocument
from sec_miner.persistence.mongodb.utils import convert_enums_to_strings
from sec_miner.sec.processors.types import ProcessNewFilingsResult, ProcessNewCompaniesResult, ProcessIndexResult
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


class MongoDbContext:
    def __init__(self):
        self.client = MongoClient(config.MONGODB_CONNECTION)
        self.db = self.client.get_database(config.MONGODB_DBNAME)

        self.ensure_collections()
        self.ensure_indexes()

    @staticmethod
    def _ensure_index_exists(collection, index_fields, unique=False):
        existing_indexes = collection.list_indexes()
        index_names = {index['name'] for index in existing_indexes}

        # Generate the index name as MongoDB would
        index_name = "_".join([f"{field[0]}_{field[1]}" for field in index_fields])

        if index_name not in index_names:
            collection.create_index(index_fields, unique=unique)

    def ensure_indexes(self):
        try:
            # Company concepts indexes
            self._ensure_index_exists(self.db.company_concepts, [("cik", 1), ("concept_type", 1)], unique=True)
            self._ensure_index_exists(self.db.company_concepts, [("last_updated", 1)])
            self._ensure_index_exists(self.db.company_concepts, [
                ("cik", 1),
                ("concept_type", 1),
                ("data_points.end_date", 1)
            ])

            self._ensure_index_exists(self.db.company_concepts_metadata, [("cik", 1)], unique=True)

            # Filing history indexes
            self._ensure_index_exists(self.db.filing_history, [("cik", 1)], unique=True)
            self._ensure_index_exists(self.db.filing_history, [("metadata.last_filed", 1)])
            self._ensure_index_exists(self.db.filing_history, [("filings.accession_number", 1)])

            # Processing collection indexes
            self._ensure_index_exists(self.db.failed_filings, [("accession_number", 1)])
            self._ensure_index_exists(self.db.failed_new_companies, [("cik", 1)])

            logger.info("Successfully ensured all database indexes")

        except Exception as e:
            logger.error(f"Error ensuring database indexes: {str(e)}")
            raise

    def ensure_collections(self):
        """Ensure necessary collections exist and create if not."""
        try:
            collection_names = self.db.list_collection_names()

            if 'company_concepts' not in collection_names:
                self.db.create_collection('company_concepts')

            if 'filing_history' not in collection_names:
                self.db.create_collection('filing_history')

            if 'new_filings_results' not in collection_names:
                self.db.create_collection('new_filings_results')

            if 'new_companies_results' not in collection_names:
                self.db.create_collection('new_companies_results')

            if 'new_indexes_results' not in collection_names:
                self.db.create_collection('new_indexes_results')

            if 'company_concepts_metadata' not in collection_names:
                self.db.create_collection('company_concepts_metadata')

        except Exception as e:
            logger.error(f"Error ensuring database collections: {str(e)}")
            raise

    def upsert_filing_history_doc(self, filing_history_doc: CompanyFilingHistoryDocument):
        """Update or insert a company's filing history document"""
        try:
            collection = self.db.filing_history
            collection.update_one(
                {"cik": filing_history_doc.cik},
                {"$set": filing_history_doc.model_dump(by_alias=True)},
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

            pipeline = [
                {"$match": {"cik": cik}},
                {"$project": {
                    "existing_accessions": {
                        "$map": {
                            "input": "$filings",
                            "as": "filing",
                            "in": "$$filing.accession_number"
                        }
                    },
                    "metadata": 1
                }}
            ]

            # Get current document
            current_doc = next(collection.aggregate(pipeline), None)

            if current_doc:
                # Create set of existing accession numbers for efficient lookup
                existing_accessions = set(current_doc.get("existing_accessions", []))

                # Filter out any filings we already have
                new_filings = [
                    f for f in filings
                    if f.accession_number not in existing_accessions
                ]

                if not new_filings:
                    logger.info(f"No new filings to insert for CIK {cik}")
                    return

                # Calculate new metadata
                all_dates = [
                        current_doc["metadata"]["first_filed"],
                        current_doc["metadata"]["last_filed"]
                ] + [f.filing_date for f in new_filings]

                new_last_filed = max(all_dates)
                new_first_filed = min(all_dates)
            else:
                new_filings = filings
                filing_dates = [f.filing_date for f in filings]
                new_last_filed = max(filing_dates)
                new_first_filed = min(filing_dates)

            # Perform batch update
            collection.update_one(
                {"cik": cik},
                {
                    "$push": {
                        "filings": {
                            "$each": [f.model_dump(by_alias=True) for f in new_filings]
                        }
                    },
                    "$set": {
                        "metadata.last_filed": new_last_filed,
                        "metadata.first_filed": new_first_filed,
                        "metadata.last_fetched": datetime.now(timezone.utc),
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

    def update_concept_metadata_doc(self, concept_metadata_doc: CompanyConceptsMetadataDocument) -> None:
        """Update or insert a company concept metadata document"""
        try:
            collection = self.db.company_concepts_metadata
            collection.replace_one(
                {"cik": concept_metadata_doc.cik},
                concept_metadata_doc.model_dump(by_alias=True),
                upsert=True
            )
            logger.log(15, f"Updated company concept metadata for CIK {concept_metadata_doc.cik}")
        except Exception as e:
            logger.error(f"Error updating company concept metadata for CIK {concept_metadata_doc.cik}: {str(e)}")
            raise

    def upsert_concept_doc(self, concept_doc: CompanyConceptDocument) -> None:
        """Update or insert a company concept document"""
        try:
            collection = self.db.company_concepts

            concept_doc_dict = concept_doc.model_dump(by_alias=True)
            concept_doc_dict = convert_enums_to_strings(concept_doc_dict)

            collection.update_one(
                {"cik": concept_doc.cik, "concept_type": str(concept_doc.concept_type)},
                {"$set": concept_doc_dict},
                upsert=True
            )
            logger.log(15, f"Upserted company concept for CIK {concept_doc.cik}")
        except Exception as e:
            logger.error(f"Error upserting company concept for CIK {concept_doc.cik}: {str(e)}")
            raise

    def get_concept_doc(self, cik: str, concept_type: ConceptType) -> Optional[CompanyConceptDocument]:
        """Retrieve a specific concept for a company"""
        try:
            collection = self.db.company_concepts
            doc = collection.find_one({"cik": cik, "concept_type": concept_type})
            doc["concept_type"] = ConceptType(doc["concept_type"])
            return CompanyConceptDocument(**doc) if doc else None
        except Exception as e:
            logger.error(f"Error retrieving concept for CIK {cik}: {str(e)}")
            raise

    def company_has_filing_history(self, cik: str) -> bool:
        """Check if a company has filing history in the database"""
        try:
            return self.db.filing_history.find_one({"cik": cik}) is not None
        except Exception as e:
            logger.error(f"Error retrieving last filing date for CIK {cik}: {str(e)}")
            raise

    def check_companies_have_filing_history(self, ciks: List[str], batch_size: int = 100) -> Dict[str, bool]:
        """Check if a list of companies have filing history in the database
        :param ciks: List of CIKs to check
        :param batch_size: Number of CIKs to query at once
        :return: Dictionary of CIKs and whether they have filing history
        """
        try:
            has_history = {cik: False for cik in ciks}

            # Process CIKs in batches
            for i in range(0, len(ciks), batch_size):
                batch = ciks[i:i + batch_size]
                cursor = self.db.filing_history.find({"cik": {"$in": batch}})

                # Only include CIKs that have filing history
                has_history.update({doc["cik"]: True for doc in cursor})

            return has_history

        except Exception as e:
            logger.error(f"Error checking filing history for CIKs {ciks}: {str(e)}")
            raise

    def record_new_filings_processing_result(self, result: ProcessNewFilingsResult):
        """Record the result of processing new filings"""
        try:
            collection = self.db.new_filings_results
            collection.insert_one(result.to_json())
            logger.log(15, f"Recorded new filings processing result")
        except Exception as e:
            logger.error(f"Error recording new filings processing result: {str(e)}")
            raise

    def record_new_companies_processing_result(self, result: ProcessNewCompaniesResult):
        try:
            collection = self.db.new_companies_results
            collection.insert_one(result.to_json())
            logger.log(15, f"Recorded new companies processing result")
        except Exception as e:
            logger.error(f"Error recording new filings processing result: {str(e)}")
            raise

    def record_new_indexes_processing_result(self, result: ProcessIndexResult):
        try:
            collection = self.db.new_indexes_results
            collection.insert_one(result.to_json())
            logger.log(15, f"Recorded new indexes processing result")
        except Exception as e:
            logger.error(f"Error recording new indexes processing result: {str(e)}")
            raise
