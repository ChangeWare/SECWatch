from datetime import datetime
import re


def get_current_quarter() -> int:
    current_date = datetime.now()
    return (current_date.month - 1) // 3 + 1


def get_current_year() -> int:
    current_date = datetime.now()
    return current_date.year


def normalize_cik(cik: str) -> str:
    return cik.zfill(10)


def get_accession_number_from_filename(filename: str) -> str:
    match = re.search(r'\d{10}-\d{2}-\d{6}', filename)
    if match:
        return match.group(0)
    return ''
