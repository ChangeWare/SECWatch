import csv
import json
import httpx
from datetime import datetime
from io import StringIO
from typing import List, Dict, Optional
from redis import Redis
from sec_miner.config.loader import config
from sec_miner.sec.processors.types import UnprocessedFiling
from sec_miner.sec.utils import normalize_cik, get_accession_number_from_filename
from sec_miner.utils.logger_factory import get_logger

logger = get_logger(__name__)


class IndexProcessorResponse:
    def __init__(self, status: str, new_filings: int):
        self.status = status
        self.new_filings = new_filings


class IndexProcessor:
    def __init__(self, redis_client: Redis):
        self.headers = {'User-Agent': config.SEC_USER_AGENT}
        self.redis_client = redis_client
        self.FILING_QUEUE = config.FILING_QUEUE

    @staticmethod
    def _parse_master_index(content: str) -> List[UnprocessedFiling]:
        """Parses the daily master.idx content into structured data.

        Args:
            content (str): Raw content of master.idx file

        Returns:
            List[Dict]: List of filing dictionaries with parsed data
        """

        # Find the start of actual data (after header and delimiter line)
        header_pos = content.find('CIK|Company Name')
        if header_pos == -1:
            raise ValueError("Header not found in master.idx file")

        # Then find the dash separator line that follows it
        dash_pos = content.find('\n-', header_pos) + 1
        start_pos = content.find('\n', dash_pos) + 1

        filings: List[UnprocessedFiling] = []

        reader = csv.reader(StringIO(content[start_pos:]), delimiter='|')
        for row in reader:
            if len(row) == 5:  # Ensure valid row
                filing = UnprocessedFiling(
                    cik=normalize_cik(row[0]),
                    company_name=row[1],
                    form_type=row[2],
                    date_filed=datetime.strptime(row[3], '%Y%m%d'),
                    filename=row[4],
                    accession_number=get_accession_number_from_filename(row[4])
                )
                filings.append(filing)

        return filings

    def _get_quarter_daily_index(self, year: int, quarter: int) -> Optional[str]:
        """Fetches the master.idx file for a given year and quarter."""
        url = f"https://www.sec.gov/Archives/edgar/daily-index/{year}/QTR{quarter}/index.json"
        try:
            with httpx.Client() as client:
                response = client.get(url, headers=self.headers)
                response.raise_for_status()
                return response.text
        except httpx.HTTPError as e:
            logger.warning(f"Could not fetch master index for {year} Q{quarter}: {str(e)}")
            return None

    def _get_master_index(self, year: int, quarter: int, daily_id: str) -> Optional[str]:
        """Fetches the master.idx file for a given year and quarter."""
        url = f"https://www.sec.gov/Archives/edgar/daily-index/{year}/QTR{quarter}/master.{daily_id}.idx"
        try:
            with httpx.Client() as client:
                response = client.get(url, headers=self.headers)
                response.raise_for_status()
                return response.text
        except httpx.HTTPError as e:
            logger.warning(f"Could not fetch master index for {year} Q{quarter}: {str(e)}")
            return None

    @staticmethod
    def _get_id_from_name(name: str) -> str:
        """Extracts the daily index ID from the filename."""
        return name.replace('master.', '').replace('.idx', '')

    def _daily_index_has_updates(self, year: int, quarter: int, current_daily_index: List[Dict]) -> bool:
        daily_id = self._get_id_from_name(current_daily_index['name'])

        # Check if we have the daily index already
        key = f"sec:index:{year}:q{quarter}:daily:{daily_id}"
        stored_daily_index_data = self.redis_client.get(key)

        if stored_daily_index_data:
            stored_daily_index = json.loads(stored_daily_index_data)
            stored_daily_index_last_modified = datetime.strptime(
                stored_daily_index['last-modified'],
                '%m/%d/%Y %I:%M:%S %p')

            current_daily_index_last_modified = datetime.strptime(
                current_daily_index['last-modified'],
                '%m/%d/%Y %I:%M:%S %p')

            return current_daily_index_last_modified > stored_daily_index_last_modified
        else:
            # We don't have anything stored, so this has to be new
            return True

    def _cache_index_entry(self, quarter: int, year: int, daily_id: str, content: Dict):
        key = f"sec:index:{year}:q{quarter}:daily:{daily_id}"
        self.redis_client.set(key, json.dumps(content))

    def _get_new_indexes(self, year: int, quarter: int) -> List[str]:
        """Checks the daily index file for the quarter & determine whether there's any new daily indexes."""

        quarter_daily_index = self._get_quarter_daily_index(year, quarter)
        if not quarter_daily_index:
            return []

        quarter_daily_index = json.loads(quarter_daily_index)
        quarter_index_items = quarter_daily_index['directory']['item']

        new_indexes = []
        for daily_index_entry in quarter_index_items:
            # Only process the master indexes
            if not daily_index_entry['name'].startswith('master.'):
                continue

            if self._daily_index_has_updates(year, quarter, daily_index_entry):
                daily_id = self._get_id_from_name(daily_index_entry['name'])

                # Store for future lookup reference
                self._cache_index_entry(quarter, year, daily_id, daily_index_entry)

                daily_master_index = self._get_master_index(year, quarter, daily_id)
                new_indexes.append(daily_master_index)

        return new_indexes

    def _cache_filings(self, filings: List[UnprocessedFiling], year: int, quarter: int):
        """Store both raw content and parsed filings in Redis."""
        quarter_key = f"sec:index:{year}:q{quarter}"

        # Store filing hashes in a SET
        filing_set_key = f"{quarter_key}:filings"
        pipe = self.redis_client.pipeline()
        for filing in filings:
            pipe.sadd(filing_set_key, filing.hash_value)
        pipe.execute()

    def _queue_new_filings(self, new_filings: List[UnprocessedFiling]):
        """Queue new filings for processing."""
        pipe = self.redis_client.pipeline()

        for filing in new_filings:
            # Add to processing queue
            pipe.rpush(self.FILING_QUEUE, json.dumps(filing.to_json()))

        # Execute all Redis commands in single pipeline
        pipe.execute()
        logger.info(f"Queued {len(new_filings)} new filings for processing")

    def clean_stale_indexes(self, min_year: int):
        # Pass over indexes & filings in our cache that are older than the specified minimum year and purge them.

        if min_year < 2025:
            raise ValueError("Minimum year must be 2025 or later")

        # 2025 is the earliest possible year that we would have cached indexes
        for year in range(2025, min_year):
            for quarter in range(1, 4):
                quarter_key = f"sec:index:{year}:q{quarter}"

                daily_index_key = f"{quarter_key}:daily"
                self.redis_client.delete(daily_index_key)

                filing_set_key = f"{quarter_key}:filings"
                self.redis_client.delete(filing_set_key)

    def process_index_updates(self, year: int, quarter: int):
        new_indexes = self._get_new_indexes(year, quarter)

        if len(new_indexes) <= 0:
            return IndexProcessorResponse(
                status='no_updates',
                new_filings=0
            )

        # Get all the filings we've processed so far, stored in a redis cache.
        quarter_key = f"sec:index:{year}:q{quarter}"
        existing_hashes = self.redis_client.smembers(f"{quarter_key}:filings")

        # Keep track of what we've seen in this run
        seen_hashes = set(existing_hashes)
        cum_new_filings: List[UnprocessedFiling] = []

        for index_content in new_indexes:
            index_filings = self._parse_master_index(index_content)

            # Deduplicate the filings from this index first
            # Sometimes the same filing is listed multiple times within the same index.
            unique_index_filings = {
                filing.hash_value: filing
                for filing in index_filings
            }.values()

            # Use seen_hashes for deduplication across indexes.
            new_filings = [
                filing for filing in unique_index_filings
                if filing.hash_value not in seen_hashes
            ]

            if len(new_filings) > 0:
                # Update our in-memory set
                seen_hashes.update(f.hash_value for f in new_filings)
                cum_new_filings.extend(new_filings)

        if len(cum_new_filings) > 0:
            # Cache everything to Redis once at the end
            self._cache_filings(cum_new_filings, year, quarter)
            self._queue_new_filings(cum_new_filings)

            return IndexProcessorResponse(
                status='updated',
                new_filings=len(cum_new_filings),
            )

        return IndexProcessorResponse(
            status='no_updates',
            new_filings=0,
        )
