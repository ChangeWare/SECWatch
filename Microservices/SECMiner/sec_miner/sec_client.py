import requests
from sec_miner.config import Config
from sec_miner.models import Address
from sec_miner.models import Company
from sec_miner.utils.sec_rate_limit import sec_rate_limit


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
            ZipCode=addr_data.get('zip'),
            Country=addr_data.get('country'),
            AddressType=addr_type
        )
        addresses.append(address)

    company = Company(
        CIK=cik,
        Name=company_data['name'],
        SIC=company_data['sic'],
        Ticker=len(company_data['tickers']) > 0 and company_data['tickers'][0] or None,
        Addresses=addresses
    )

    return company
