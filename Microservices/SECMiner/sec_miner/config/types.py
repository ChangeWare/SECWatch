from typing import TypedDict, Dict, List
from pydantic import BaseModel
from celery.schedules import crontab


class CelerySchedule(TypedDict):
    task: str
    schedule: crontab


class ConfigModel(BaseModel):
    # Redis Configuration
    REDIS_URL: str
    RATE_LIMIT_SECONDS: int
    RATE_CALLS_PER_SECOND: int

    # Celery Configuration
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str
    CELERY_TASK_SERIALIZER: str
    CELERY_RESULT_SERIALIZER: str
    CELERY_ACCEPT_CONTENT: List[str]
    CELERY_TASK_TRACK_STARTED: bool

    # Queue Configuration
    FILING_QUEUE: str
    FILING_QUEUE_FAILURES: str
    FILING_QUEUE_MAX_RETRIES: int
    FILING_QUEUE_RETRY_DELAY: int

    FORCE_UPDATE_COMPANY_PERIOD_DAYS: int

    # SEC API Configuration
    SEC_API_BASE_URL: str
    SEC_TICKERS_URL: str
    SEC_CIK_SUBMISSIONS_URL: str
    SEC_USER_AGENT: str
    SEC_CIK_ACCOUNTS_PAYABLE_URL: str

    # Database Configuration
    DATABASE_CONNECTION: str
    MONGODB_CONNECTION: str
    MONGODB_DBNAME: str

    # Task Routes
    TASK_ROUTES: Dict[str, Dict[str, str]]