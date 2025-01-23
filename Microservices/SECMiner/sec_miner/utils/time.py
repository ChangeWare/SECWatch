from datetime import datetime, timezone


def parse_datetime(dt_str, fmt='%Y-%m-%d %H:%M:%S.%f'):
    """Parse a string into a timezone-aware datetime in UTC."""
    try:
        return datetime.strptime(dt_str, fmt).replace(tzinfo=timezone.utc)
    except ValueError:
        return None