from datetime import datetime
from typing import List


class FilingEventData:
    def __init__(self, form_type: str, accession_number: str,
                 filing_date: datetime):
        self.form_type = form_type
        self.filing_date = filing_date
        self.accession_number = accession_number

    def to_json(self):
        return {
            'form_type': self.form_type,
            'filing_date': self.filing_date,
            'accession_number': self.accession_number
        }


class FilingEvent:
    def __init__(self, cik: str, event_type: str, event_id: str, timestamp: datetime, filings: List[FilingEventData]):
        self.cik = cik
        self.event_type = event_type
        self.event_id = event_id
        self.timestamp = timestamp
        self.filings = filings

    def to_json(self):
        return {
            'cik': self.cik,
            'eventType': self.event_type,
            'eventId': self.event_id,
            'timestamp': self.timestamp.isoformat(),
            'filings': [filing.to_json() for filing in self.filings]
        }