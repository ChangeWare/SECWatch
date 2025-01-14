from datetime import datetime
from hashlib import sha256


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

        self.retry_count = retry_count
        self.last_error: str = last_error
        self.last_attempt: datetime = last_attempt
        self.retry_at: datetime = retry_at

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
