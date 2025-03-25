from datetime import datetime, timedelta, timezone
from typing import List, Dict
from ratelimit import sleep_and_retry, limits
from redis import Redis
from sec_miner.config.loader import config
from sec_miner.persistence.concept_types import ConceptType
from sec_miner.persistence.mongodb.models import ConceptDataPoint, CompanyConceptDocument, CompanyConceptMetadata, \
    SECFiling, CompanyFilingHistoryDocument, FilingHistoryMetadata
from sec_miner.persistence.sql.database import DbContext
from sec_miner.persistence.sql.models import Company, Address
from sec_miner.sec.processors.index_processor import IndexProcessor
from sec_miner.sec.results import CompanyConceptResult
from sec_miner.sec.utils import normalize_cik
from sec_miner.utils.logger_factory import get_logger
import json
import httpx

from sec_miner.utils.time import parse_datetime

logger = get_logger(__name__)


class SECClient:
    def __init__(self, db_context: DbContext, redis_client: Redis):
        self.headers = {'User-Agent': config.SEC_USER_AGENT}
        self.db_context = db_context
        self.redis_client = redis_client
        self.index_processor = IndexProcessor(redis_client)

    @sleep_and_retry
    @limits(calls=config.RATE_CALLS_PER_SECOND, period=config.RATE_LIMIT_SECONDS)
    def get_company_ticker_list(self):
        """Get company tickers from company_tickers.json"""

        # First check redis to see if we've already fetched this within the last 12 hours
        company_tickers_cache_data = self.redis_client.get('sec:company_tickers_cache')
        company_tickers_cache = json.loads(company_tickers_cache_data) if company_tickers_cache_data else None

        last_updated = parse_datetime(company_tickers_cache['last_updated'], '%Y-%m-%d %H:%M:%S.%f') \
            if company_tickers_cache else None

        if last_updated and last_updated > datetime.now(timezone.utc) - timedelta(hours=12):
            return company_tickers_cache['data']

        with httpx.Client() as client:
            response = client.get(config.SEC_TICKERS_URL, headers=self.headers)
            data = response.json()
            companies = [data[key] for key in data]

            cache_entry = {
                'data': companies,
                'last_updated': datetime.now(timezone.utc)
            }

            # Cache the data in Redis
            self.redis_client.set('sec:company_tickers_cache', json.dumps(cache_entry, default=str))

            return companies

    @sleep_and_retry
    @limits(calls=config.RATE_CALLS_PER_SECOND, period=config.RATE_LIMIT_SECONDS)
    def get_ticker_mapping(self) -> Dict[str, str]:
        """Get CIK to ticker mapping from SEC company tickers list """

        company_tickers = self.get_company_ticker_list()

        # Create CIK to ticker mapping
        return {
            str(item['cik_str']).zfill(10): item['ticker']
            for item in company_tickers
        }

    @staticmethod
    def _get_concept_datapoint(unit_data: Dict, unit_type: str) -> ConceptDataPoint:
        """Gets standard datapoint items from concept data"""
        return ConceptDataPoint(
            # start_date may not be present in all cases
            start_date=datetime.strptime(unit_data.get("start"), "%Y-%m-%d") if unit_data.get("start") else None,
            end_date=datetime.strptime(unit_data["end"], "%Y-%m-%d"),
            value=float(unit_data["val"]),
            fiscal_year=int(unit_data["fy"] or 0),
            fiscal_period=unit_data["fp"],
            form_type=unit_data["form"],
            filing_date=datetime.strptime(unit_data["filed"], "%Y-%m-%d"),
            frame=unit_data.get("frame") or None,
            accession_number=unit_data.get("accn") or None,
            unit_type=unit_type,
        )

    def _construct_concept_document(self, cik: str, data: Dict, concept_type: ConceptType) \
            -> CompanyConceptDocument:
        try:
            ap_data = data["units"]

            data_points: List[ConceptDataPoint] = []
            unit_types = []
            for unit_type, entry_data in ap_data.items():
                # Sanitize unit types by forcing to all uppercase
                unit_type = unit_type.upper()
                if unit_type not in unit_types:
                    unit_types.append(unit_type)
                for unit_data in entry_data:
                    data_points.append(
                        self._get_concept_datapoint(unit_data=unit_data, unit_type=unit_type)
                    )

            data_points.sort(key=lambda x: x.end_date)

            logger.info(f"Processed {concept_type} for CIK {cik}")

            return CompanyConceptDocument(
                cik=cik,
                concept_type=concept_type,
                data_points=data_points,
                metadata=CompanyConceptMetadata(
                    first_reported=data_points[0].end_date,
                    last_reported=data_points[-1].end_date,
                    last_updated=datetime.now(timezone.utc),
                    last_value=data_points[-1].value,
                    unit_types=unit_types,
                    total_data_points=len(data_points),
                    date_range={
                        "start": data_points[0].end_date,
                        "end": data_points[-1].end_date,
                        "span": {
                            "years": (data_points[-1].end_date - data_points[0].end_date).days / 365.25,
                            "months": (data_points[-1].end_date - data_points[0].end_date).days / 30,
                        }
                    }
                )
            )

        except KeyError as e:
            logger.error(f"Error processing SEC data: {e}")
            raise
        except Exception as e:
            logger.error(f"Error processing SEC data: {str(e)}")
            raise

    @sleep_and_retry
    @limits(calls=config.RATE_CALLS_PER_SECOND, period=config.RATE_LIMIT_SECONDS)
    def get_company_filing(self, cik: str, accession_number: str) -> SECFiling:
        # Ensure CIK is 10 digits for SEC API
        cik = normalize_cik(cik)

        with httpx.Client() as client:
            response = client.get(
                url=config.SEC_CIK_SUBMISSIONS_URL.format(cik=cik),
                headers=self.headers
            )

            data = response.json()

            try:
                filings_data = data["filings"]["recent"]

                # Look for specific filing
                for i in range(len(filings_data["accessionNumber"])):
                    if filings_data["accessionNumber"][i] == accession_number:
                        filing = SECFiling(
                            accession_number=filings_data["accessionNumber"][i],
                            filing_date=datetime.strptime(filings_data["filingDate"][i], "%Y-%m-%d"),
                            report_date=datetime.strptime(filings_data["reportDate"][i], "%Y-%m-%d")
                            if filings_data["reportDate"][i] else None,
                            act=filings_data["act"][i] if filings_data["act"][i] else None,
                            form=filings_data["form"][i],
                            file_number=filings_data["fileNumber"][i] if filings_data["fileNumber"][i] else None,
                            film_number=filings_data["filmNumber"][i],
                            items=filings_data["items"][i] if filings_data["items"][i] else None,
                            size=int(filings_data["size"][i]),
                            is_xbrl=bool(filings_data["isXBRL"][i]),
                            is_inline_xbrl=bool(filings_data["isInlineXBRL"][i]),
                            primary_document=filings_data["primaryDocument"][i],
                            primary_doc_description=filings_data["primaryDocDescription"][i]
                            if filings_data["primaryDocDescription"][i] else None
                        )
                        return filing

            except KeyError as e:
                logger.error(f"Error processing SEC data: {e}")
                raise
            except Exception as e:
                logger.error(f"Error processing SEC data: {str(e)}")
                raise

    def _queue_failed_company_filings_processing(self, cik: str):
        """Queue a failed company for reprocessing"""
        self.redis_client.rpush('sec:processing:failed_company_filings', cik)

    @sleep_and_retry
    @limits(calls=config.RATE_CALLS_PER_SECOND, period=config.RATE_LIMIT_SECONDS)
    def get_company_filings(self, cik: str) -> CompanyFilingHistoryDocument:
        """Get filings for a company"""

        # CIK needs to be 10 digits for SEC API
        cik = cik.zfill(10)

        with httpx.Client() as client:
            try:
                response = client.get(
                    url=config.SEC_CIK_SUBMISSIONS_URL.format(cik=cik),
                    headers=self.headers
                )

                data = response.json()

                filings_data = data["filings"]["recent"]
                logger.info(f"Processing filings for CIK {cik}")

                filings = []
                form_types = []

                # Get number of filings
                num_filings = len(filings_data["accessionNumber"])

                if num_filings == 0:
                    logger.info(f"No filings found for CIK {cik}")
                    return CompanyFilingHistoryDocument(
                        cik=cik,
                        filings=[],
                        most_recent_filing=None,
                        metadata=FilingHistoryMetadata(
                            first_filed=None,
                            last_filed=None,
                            last_fetched=datetime.now(timezone.utc),
                            total_filings=0,
                            form_types=[],
                            date_range={
                                "start": None,
                                "end": None,
                                "span": {
                                    "years": 0,
                                    "months": 0,
                                }
                            }
                        )
                    )

                for i in range(num_filings):
                    filings.append(
                        SECFiling(
                            accession_number=filings_data["accessionNumber"][i],
                            filing_date=datetime.strptime(filings_data["filingDate"][i], "%Y-%m-%d"),
                            report_date=datetime.strptime(filings_data["reportDate"][i], "%Y-%m-%d")
                            if filings_data["reportDate"][i] else None,
                            act=filings_data["act"][i] if filings_data["act"][i] else None,
                            form=filings_data["form"][i],
                            file_number=filings_data["fileNumber"][i] if filings_data["fileNumber"][i] else None,
                            film_number=filings_data["filmNumber"][i],
                            items=filings_data["items"][i] if filings_data["items"][i] else None,
                            size=int(filings_data["size"][i] if filings_data["size"][i] else 0),
                            is_xbrl=bool(filings_data["isXBRL"][i]),
                            is_inline_xbrl=bool(filings_data["isInlineXBRL"][i]),
                            primary_document=filings_data["primaryDocument"][i],
                            primary_doc_description=filings_data["primaryDocDescription"][i]
                            if filings_data["primaryDocDescription"][i] else None
                        )
                    )

                    filings.sort(key=lambda x: x.filing_date)

                filing_history = CompanyFilingHistoryDocument(
                    cik=cik,
                    filings=filings,
                    most_recent_filing=filings[-1],
                    metadata=FilingHistoryMetadata(
                        first_filed=filings[0].filing_date,
                        last_filed=filings[-1].filing_date,
                        last_fetched=datetime.now(timezone.utc),
                        total_filings=len(filings),
                        form_types=form_types,
                        date_range={
                            "start": filings[0].filing_date,
                            "end": filings[-1].filing_date,
                            "span": {
                                "years": (filings[-1].filing_date - filings[0].filing_date).days / 365.25,
                                "months": (filings[-1].filing_date - filings[0].filing_date).days / 30,
                            }
                        }
                    )
                )

                logger.info(f"Processed {len(filings)} filings for CIK {cik}")

                return filing_history

            except Exception as e:
                logger.error(f"Error processing filing for company {cik}: {str(e)}")
                self._queue_failed_company_filings_processing(cik)
                return None

    @sleep_and_retry
    @limits(calls=config.RATE_CALLS_PER_SECOND, period=config.RATE_LIMIT_SECONDS)
    def get_company_details(self, cik: str) -> Company:
        """Get details for a specific company"""
        cik = normalize_cik(cik)

        with httpx.Client() as client:
            response = client.get(config.SEC_CIK_SUBMISSIONS_URL.format(cik=cik), headers=self.headers)
            company_data = response.json()

            addresses = []
            for addr_type, addr_data in company_data['addresses'].items():
                address = Address(
                    street=addr_data.get('street1'),
                    street2=addr_data.get('street2'),
                    city=addr_data.get('city'),
                    state=addr_data.get('state'),
                    zip=addr_data.get('zip'),
                    country=addr_data.get('country'),
                    address_type=addr_type
                )
                addresses.append(address)

            company = Company(
                cik=cik,
                name=company_data['name'],
                sic=company_data['sic'],
                ticker=len(company_data['tickers']) > 0 and company_data['tickers'][0] or None,
                addresses=addresses,
                last_updated=datetime.now(timezone.utc)
            )

            return company

    @sleep_and_retry
    @limits(calls=config.RATE_CALLS_PER_SECOND, period=config.RATE_LIMIT_SECONDS)
    def get_company_concepts(self, cik: str) -> List[CompanyConceptResult]:
        """Get all concepts for a company from companyfacts endpoint"""
        cik = normalize_cik(cik)

        with httpx.Client() as client:
            response = client.get(
                config.SEC_CIK_COMPANY_FACTS_URL.format(cik=cik),
                headers=self.headers
            )

            if response.status_code == 404:
                return []

            data = response.json()
            facts = data.get('facts', {}).get('us-gaap', {})

            results: List[CompanyConceptResult] = []

            for concept_type in ConceptType:
                concept = concept_type.value
                if concept in facts:
                    try:
                        concept_document = self._construct_concept_document(
                            cik=cik,
                            data=facts[concept],
                            concept_type=concept_type
                        )
                        results.append(CompanyConceptResult(
                            concept_document=concept_document,
                            message=f"Successfully processed {concept_type} data"
                        ))
                    except Exception as e:
                        logger.error(f"Error processing {concept}: {str(e)}")
                        results.append(CompanyConceptResult(
                            concept_document=None,
                            message=f"Failed to process {concept_type} data: {str(e)}"
                        ))

            return results
