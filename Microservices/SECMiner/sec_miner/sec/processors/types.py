from datetime import datetime
from hashlib import sha256
from typing import Optional, List, Set


class UpdateCompanyInfo:
    def __init__(self, cik: str, name: str, ticker: Optional[str], latest_filing_date: Optional[datetime],
                 latest_filing_type: Optional[str], source: str):
        self.cik = cik
        self.name = name
        self.ticker = ticker
        self.latest_filing_date = latest_filing_date
        self.latest_filing_type = latest_filing_type
        self.source = source


class QueuedNewCompanyInfo:
    def __init__(self, cik: str, source_filing_date: datetime,
                 source_filing_type: str, source: str, retry_count: int = 0, last_error: str = None,
                 last_attempt: datetime = None, retry_at: datetime = None):
        self.cik = cik
        self.source_filing_date = source_filing_date
        self.source_filing_type = source_filing_type
        self.source = source

        # Information about processing failures
        self.retry_count = retry_count
        self.last_error: str = last_error
        self.last_attempt: datetime = last_attempt
        self.retry_at: datetime = retry_at
        self.final_failure = False

    def to_json(self):
        return {
            'cik': self.cik,
            'source_filing_date': str(self.source_filing_date),
            'source_filing_type': self.source_filing_type,
            'source': self.source,
            'retry_count': self.retry_count,
            'last_error': self.last_error,
            'last_attempt': str(self.last_attempt) if self.last_attempt else None,
            'retry_at': str(self.retry_at) if self.retry_at else None,
        }


class UnprocessedFiling:
    def __init__(self, cik: str, company_name: str, date_filed: datetime,
                 form_type: str, filename: str, accession_number: str,
                 retry_count: int = 0, last_error: str = None,
                 last_attempt: datetime = None, retry_at: datetime = None):
        self.cik = cik
        self.company_name = company_name
        self.date_filed = date_filed
        self.form_type = form_type
        self.filing_url = filename
        self.accession_number = accession_number

        self.hash_value = self._calculate_hash()

        # Information about processing failures
        self.retry_count = retry_count
        self.last_error: str = last_error
        self.last_attempt: datetime = last_attempt
        self.retry_at: datetime = retry_at
        self.final_failure = False

    def _calculate_hash(self) -> str:
        """Calculate a deterministic hash value for this filing."""
        # Use only the essential identifying properties in a predictable format
        unique_key = f"{self.cik.strip()}:{self.accession_number.strip()}:{self.date_filed.strftime('%Y%m%d')}"
        return sha256(unique_key.encode()).hexdigest()

    def to_json(self):
        return {
            'cik': self.cik,
            'company_name': self.company_name,
            'date_filed': str(self.date_filed),
            'form_type': self.form_type,
            'filing_url': self.filing_url,
            'accession_number': self.accession_number,
            'hash_value': self.hash_value,
            'retry_count': self.retry_count,
            'last_error': self.last_error,
            'last_attempt': str(self.last_attempt) if self.last_attempt else None,
            'retry_at': str(self.retry_at) if self.retry_at else None,
        }


class ProcessNewCompaniesResult:
    def __init__(self, new_company_ciks: List[str],
                 total_companies_processed: int,
                 total_failed_companies: int, message: str = ""):
        self.new_company_ciks = new_company_ciks
        self.total_companies_processed = total_companies_processed
        self.total_failed_companies = total_failed_companies
        self.message = message


class ProcessNewFilingsResult:
    def __init__(self, total_new_filings: int,
                 total_failed_filings: int,
                 total_companies_discovered: int,
                 total_companies_identified_to_update: int,
                 message: str = ""):
        self.total_new_filings = total_new_filings
        self.total_failed_filings = total_failed_filings
        self.total_companies_discovered = total_companies_discovered
        self.total_companies_identified_to_update = total_companies_identified_to_update
        self.processed_at = datetime.now()
        self.message = message

    def to_json(self):
        return {
            'total_new_filings': self.total_new_filings,
            'total_failed_filings': self.total_failed_filings,
            'total_companies_discovered': self.total_companies_discovered,
            'total_companies_identified_to_update': self.total_companies_identified_to_update,
            'processed_at': str(self.processed_at),
            'message': self.message,
        }


class DiscoverCompaniesFromFilingsResult:
    def __init__(self, new_company_ciks: Set[str], total_new_companies: int, total_companies_to_update: int):
        self.new_company_ciks = new_company_ciks
        self.total_new_companies = total_new_companies
        self.total_companies_to_update = total_companies_to_update
