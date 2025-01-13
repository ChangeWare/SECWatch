import csv
import hashlib
import json
import httpx
from datetime import datetime
from io import StringIO
from typing import Optional, List, Dict
from redis import Redis
from sec_miner.config import Config
from sec_miner.utils.logger_factory import get_logger
from sec_miner.utils.sec_rate_limit import sec_rate_limit


class IndexProcessor:
    def __init__(self, redis_client: Redis):
        self.headers = {'User-Agent': Config.SEC_USER_AGENT}
        self.logger = get_logger(__name__)
        self.redis_client = redis_client

    @staticmethod
    def _parse_master_index(content: str) -> List[Dict]:
        """Parses the master.idx content into structured data."""
        lines = content.split('\n')[11:]  # Skip header
        filings = []

        reader = csv.reader(StringIO('\n'.join(lines)), delimiter='|')
        for row in reader:
            if len(row) == 5:
                filing = {
                    'cik': row[0].zfill(10),  # Ensure CIK is 10 digits
                    'company_name': row[1],
                    'form_type': row[2],
                    'date_filed': datetime.strptime(row[3], '%Y-%m-%d'),
                    'filename': row[4]
                }
                filings.append(filing)

        return filings

    @sec_rate_limit
    def _get_master_index(self, year: int, quarter: int) -> Optional[str]:
        """Fetches the master.idx file for a given year and quarter."""
        url = f"https://www.sec.gov/Archives/edgar/full-index/{year}/QTR{quarter}/master.idx"
        try:
            with httpx.Client() as client:
                response = client.get(url, headers=self.headers)
                response.raise_for_status()
                return response.text
        except httpx.HTTPError as e:
            self.logger.warning(f"Could not fetch master index for {year} Q{quarter}: {str(e)}")
            return None

    def check_is_new_index(self, content: str, year: int, quarter: int) -> bool:
        """Check if the fetched index is new."""
        quarter_key = f"sec:index:{year}:q{quarter}"
        content_hash = hashlib.md5(content.encode()).hexdigest()

        # Get existing content hash from Redis
        existing_hash = self.redis_client.hget(quarter_key, "content_hash")

        # If hash is different, it's a new index
        if existing_hash != content_hash:
            return True

        return False

    def store_index(self, content: str, filings: List[Dict], year: int, quarter: int) -> None:
        """Store both raw content and parsed filings in Redis."""
        quarter_key = f"sec:index:{year}:q{quarter}"

        # Store raw content hash for quick change detection
        content_hash = hashlib.md5(content.encode()).hexdigest()
        self.redis_client.hset(quarter_key, "content_hash", content_hash)

        # Store filing hashes in a SET
        filing_set_key = f"{quarter_key}:filings"
        pipe = self.redis_client.pipeline()
        for filing in filings:
            pipe.sadd(filing_set_key, filing['entry_hash'])
        pipe.execute()

    def find_new_filings(self, current_filings: List[Dict], year: int, quarter: int) -> List[Dict]:
        quarter_key = f"sec:index:{year}:q{quarter}"

        existing_hashes = self.redis_client.smembers(f"{quarter_key}:filings")

        # Find new filings
        return [
            filing for filing in current_filings
            if filing['entry_hash'] not in existing_hashes
        ]

    def process_index_updates(self, year: int, quarter: int) -> Dict:
        """Main method to check for and process index updates."""
        try:
            # Fetch current index
            current_content = self._get_master_index(year, quarter)

            if not self.check_is_new_index(current_content, year, quarter):
                return {
                    'status': 'no_updates',
                    'new_filings': 0,
                    'total_filings': 0
                }

            current_filings = self._parse_master_index(current_content)

            # Find new filings
            new_filings = self.find_new_filings(current_filings, year, quarter)

            if new_filings:
                # Store updated index
                self.store_index(current_content, current_filings, year, quarter)

                # Queue new filings for processing
                self.queue_new_filings(new_filings)

                return {
                    'status': 'updated',
                    'new_filings': len(new_filings),
                    'total_filings': len(current_filings)
                }

            return {
                'status': 'no_updates',
                'new_filings': 0,
                'total_filings': len(current_filings)
            }

        except Exception as e:
            return {
                'status': 'error',
                'error': str(e)
            }

    def queue_new_filings(self, new_filings: List[Dict]):
        """Queue new filings for processing."""
        pipe = self.redis_client.pipeline()

        for filing in new_filings:
            # Add to processing queue
            pipe.rpush('sec:processing:filing_queue', json.dumps(filing))

        # Execute all Redis commands in single pipeline
        pipe.execute()
