from datetime import datetime
from typing import List, Tuple


def get_quarters_to_check(lookback_years: int = 2) -> List[Tuple[int, int]]:
    """
    Get list of quarters to check, going back n years.
    Returns list of (year, quarter) tuples.
    """
    quarters = []
    current_date = datetime.now()

    for year in range(current_date.year - lookback_years, current_date.year + 1):
        # For current year, only include up to current quarter
        if year == current_date.year:
            current_quarter = (current_date.month - 1) // 3 + 1
            for quarter in range(1, current_quarter + 1):
                quarters.append((year, quarter))
        else:
            # For past years, include all quarters
            for quarter in range(1, 5):
                quarters.append((year, quarter))

    return quarters
