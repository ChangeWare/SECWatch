from typing import Dict, List, Optional
from typing_extensions import TypedDict
from pydantic import BaseModel


class Schedule(BaseModel):
    minute: Optional[str] = "*"
    hour: Optional[str] = "*"
    day_of_week: Optional[str] = "*"
    day_of_month: Optional[str] = "*"
    month_of_year: Optional[str] = "*"


class CelerySchedule(TypedDict):
    task: str
    schedule: Schedule


class CeleryQueueConfig(BaseModel):
    concurrency: int


class ConfigModel(BaseModel):
    # Redis Configuration
    REDIS_URL: str

    RABBITMQ_HOST: str
    RABBITMQ_PORT: str
    RABBITMQ_USER: str
    RABBITMQ_PASS: str

    RATE_LIMIT_SECONDS: int
    RATE_CALLS_PER_SECOND: int

    # Celery Configuration
    CELERY_BROKER_URL: str
    CELERY_RESULT_BACKEND: str
    CELERY_TASK_SERIALIZER: str
    CELERY_RESULT_SERIALIZER: str
    CELERY_ACCEPT_CONTENT: List[str]
    CELERY_TASK_TRACK_STARTED: bool
    CELERY_QUEUE_CONFIG: Dict[str, CeleryQueueConfig]

    SEC_INDEX: str

    # Queue Configuration ############

    # Filings
    FILING_QUEUE: str
    FILING_QUEUE_CRITICAL_FAILURE: str
    FILING_QUEUE_FAILURES: str
    FILING_QUEUE_UNRECOVERABLE_FAILURES: str
    FILING_QUEUE_MAX_RETRIES: int
    FILING_QUEUE_RETRY_DELAY: int

    # New Companies
    NEW_COMPANY_QUEUE: str
    NEW_COMPANY_QUEUE_CRITICAL_FAILURE: str
    NEW_COMPANY_UNRECOVERABLE_FAILURES: str
    NEW_COMPANY_QUEUE_FAILURES: str
    NEW_COMPANY_QUEUE_MAX_RETRIES: int
    NEW_COMPANY_QUEUE_RETRY_DELAY: int
    NEW_COMPANY_BATCH_SIZE: int

    # Companies needing update
    UPDATE_COMPANY_QUEUE: str
    UPDATE_COMPANY_QUEUE_FAILURES: str
    UPDATE_COMPANY_QUEUE_CRITICAL_FAILURE: str
    UPDATE_COMPANY_UNRECOVERABLE_FAILURES: str
    UPDATE_COMPANY_QUEUE_MAX_RETRIES: int
    UPDATE_COMPANY_QUEUE_RETRY_DELAY: int
    UPDATE_COMPANY_BATCH_SIZE: int

    ##################################

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

    # Beat Schedule
    BEAT_SCHEDULE: Dict[str, CelerySchedule]
