from datetime import datetime, timedelta
from typing import List, Dict
from ratelimit import sleep_and_retry, limits
from redis import Redis
from sec_miner.config.loader import config
from sec_miner.persistence.financial_metric import FinancialMetric
from sec_miner.persistence.mongodb.models import MetricDataPoint, FinancialMetricDocument, FinancialMetricMetadata, \
    SECFiling, CompanyFilingHistoryDocument, FilingHistoryMetadata
from sec_miner.persistence.sql.database import DbContext
from sec_miner.persistence.sql.models import Company, Address
from sec_miner.sec.processors.index_processor import IndexProcessor
from sec_miner.sec.results import CompanyMetricResult
from sec_miner.sec.utils import normalize_cik
from sec_miner.utils.logger_factory import get_logger
import json
import httpx

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

        last_updated = datetime.strptime(company_tickers_cache['last_updated'], '%Y-%m-%d %H:%M:%S.%f') \
            if company_tickers_cache else None

        if last_updated and last_updated > datetime.utcnow() - timedelta(hours=12):
            return company_tickers_cache['data']

        with httpx.Client() as client:
            response = client.get(config.SEC_TICKERS_URL, headers=self.headers)
            data = response.json()
            companies = [data[key] for key in data]

            cache_entry = {
                'data': companies,
                'last_updated': datetime.utcnow()
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

    @sleep_and_retry
    @limits(calls=config.RATE_CALLS_PER_SECOND, period=config.RATE_LIMIT_SECONDS)
    def get_company_accounts_payable(self, cik: str) -> CompanyMetricResult:
        """Get accounts payable for companies"""

        with httpx.Client() as client:
            response = client.get(
                config.SEC_CIK_ACCOUNTS_PAYABLE_URL.format(cik=cik),
                headers=self.headers
            )

            # If we get a 404, the company doesn't have any accounts payable data
            if response.status_code == 404:
                return CompanyMetricResult(
                    metric_document=None
                )

            data = response.json()

            try:
                ap_data = data["units"]
                logger.info(f"Processing accounts payable for CIK {cik}")

                data_points = []
                currency_types = []
                for currency_type, entry_data in ap_data.items():
                    if currency_type not in currency_types:
                        currency_types.append(currency_type)
                    for unit_data in entry_data:
                        data_points.append(
                            MetricDataPoint(
                                end_date=datetime.strptime(unit_data["end"], "%Y-%m-%d"),
                                value=float(unit_data["val"]),
                                fiscal_year=int(unit_data["fy"] or 0),
                                fiscal_period=unit_data["fp"],
                                form_type=unit_data["form"],
                                filing_date=datetime.strptime(unit_data["filed"], "%Y-%m-%d"),
                                frame=unit_data.get("frame") or None,
                                currency_type=currency_type,
                                metadata={
                                    "accn": unit_data.get("accn")
                                }
                            )
                        )

                data_points.sort(key=lambda x: x.end_date)

                metric_document = FinancialMetricDocument(
                    cik=cik,
                    metric_type=FinancialMetric.ACCOUNTS_PAYABLE,
                    data_points=data_points,
                    metadata=FinancialMetricMetadata(
                        first_reported=data_points[0].end_date,
                        last_reported=data_points[-1].end_date,
                        last_updated=datetime.utcnow(),
                        last_value=data_points[-1].value,
                        currency_types=currency_types,
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

                logger.info("Processed accounts payable for CIK {cik}")

                return CompanyMetricResult(
                    metric_document=metric_document
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

    @sleep_and_retry
    @limits(calls=config.RATE_CALLS_PER_SECOND, period=config.RATE_LIMIT_SECONDS)
    def get_company_filings(self, cik: str) -> CompanyFilingHistoryDocument:
        """Get filings for a company"""

        # CIK needs to be 10 digits for SEC API
        cik = cik.zfill(10)

        with httpx.Client() as client:
            response = client.get(
                url=config.SEC_CIK_SUBMISSIONS_URL.format(cik=cik),
                headers=self.headers
            )

            data = response.json()

            try:
                filings_data = data["filings"]["recent"]
                logger.info(f"Processing filings for CIK {cik}")

                filings = []
                form_types = []

                # Get number of filings
                num_filings = len(filings_data["accessionNumber"])

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
                            size=int(filings_data["size"][i]),
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
                    metadata=FilingHistoryMetadata(
                        first_filed=filings[0].filing_date,
                        last_filed=filings[-1].filing_date,
                        last_fetched=datetime.utcnow(),
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

            except KeyError as e:
                logger.error(f"Error processing SEC data: {e}")
                raise
            except Exception as e:
                logger.error(f"Error processing SEC data: {str(e)}")
                raise

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
                last_updated=datetime.utcnow()
            )

            return company

    def get_company_financial_metrics(self, cik: str) -> List[CompanyMetricResult]:
        # CIK needs to be 10 digits for SEC API
        cik = cik.zfill(10)

        """Get financial metrics for companies"""
        return [
            self.get_company_accounts_payable(cik)
        ]
