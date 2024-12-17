import redis
from datetime import datetime
import time

redis_client = redis.Redis(host='localhost', port=6379, db=0)


def sec_rate_limit(func):
    def wrapper(*args, **kwargs):
        # Check Redis for rate limit status
        last_request = redis_client.get('sec_last_request')
        if last_request:
            time_passed = datetime.now() - datetime.fromisoformat(last_request.decode())
            if time_passed.total_seconds() < 0.1:  # 10 requests per second max
                time.sleep(0.1)

        result = func(*args, **kwargs)
        redis_client.set('sec_last_request', datetime.now().isoformat())
        return result

    return wrapper
