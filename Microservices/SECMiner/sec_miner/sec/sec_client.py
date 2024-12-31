from datetime import datetime
from typing import List
from sec_miner.config import Config
from sec_miner.persistence.financial_metric import FinancialMetric
from sec_miner.persistence.mongodb.models import MetricDataPoint, FinancialMetricDocument, FinancialMetricMetadata
from sec_miner.persistence.sql.models import Address
from sec_miner.persistence.sql.models import Company
from sec_miner.sec.results import CompanyMetricResult
from sec_miner.utils.logger_factory import get_logger
from sec_miner.utils.sec_rate_limit import sec_rate_limit
import requests

logger = get_logger(__name__)


@sec_rate_limit
def get_company_list():
    """Get list of companies"""
    response = requests.get(
        Config.SEC_TICKERS_URL,
        headers={'User-Agent': Config.SEC_USER_AGENT}
    )

    data = response.json()
    companies = [data[key] for key in data]
    return companies


@sec_rate_limit
def get_company_details(cik: str) -> Company:
    """Get details for a specific company"""

    # CIK needs to be 10 digits for SEC API
    cik = cik.zfill(10)

    url = Config.SEC_CIK_SUBMISSIONS_URL.format(cik=cik)
    response = requests.get(
        url,
        headers={'User-Agent': Config.SEC_USER_AGENT}
    )

    company_data = response.json()

    addresses = []
    for addr_type, addr_data in company_data['addresses'].items():
        address = Address(
            Street=addr_data.get('street1'),
            Street2=addr_data.get('street2'),
            City=addr_data.get('city'),
            State=addr_data.get('state'),
            Zip=addr_data.get('zip'),
            Country=addr_data.get('country'),
            AddressType=addr_type
        )
        addresses.append(address)

    company = Company(
        CIK=cik,
        Name=company_data['name'],
        SIC=company_data['sic'],
        Ticker=len(company_data['tickers']) > 0 and company_data['tickers'][0] or None,
        Addresses=addresses,
        LastUpdated=datetime.utcnow()
    )

    return company


def get_company_accounts_payable(cik: str) -> CompanyMetricResult:
    """Get accounts payable for companies"""
    url = Config.SEC_CIK_ACCOUNTS_PAYABLE_URL.format(cik=cik)
    response = requests.get(
        url,
        headers={'User-Agent': Config.SEC_USER_AGENT}
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


def get_company_financial_metrics(cik: str) -> List[CompanyMetricResult]:
    # CIK needs to be 10 digits for SEC API
    cik = cik.zfill(10)

    """Get financial metrics for companies"""
    return [get_company_accounts_payable(cik)]
