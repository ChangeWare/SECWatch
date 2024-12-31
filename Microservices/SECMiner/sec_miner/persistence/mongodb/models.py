from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional, Dict, Any
from bson.objectid import ObjectId
from sec_miner.persistence.financial_metric import FinancialMetric


class PyObjectId(ObjectId):
    """Custom type for handling MongoDB ObjectIds"""
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema):
        schema.update(type="string")
        return schema


class MetricDataPoint(BaseModel):
    end_date: datetime
    value: float

    fiscal_year: Optional[int] = None

    fiscal_period: Optional[str] = None

    form_type: str
    filing_date: datetime
    frame: Optional[str] = None
    metadata: Optional[dict] = None
    currency_type: str

    class Config:
        populate_by_name = True
        json_encoders = {
            datetime: lambda dt: dt.isoformat(),
        }


class FinancialMetricMetadata(BaseModel):
    first_reported: datetime
    last_reported: datetime
    last_updated: datetime
    last_value: float
    currency_types: List[str]
    total_data_points: int
    date_range: Dict[str, Any]


class FinancialMetricDocument(BaseModel):
    cik: str
    metric_type: FinancialMetric
    data_points: List[MetricDataPoint]
    metadata: FinancialMetricMetadata

    class Config:
        allow_population_by_field_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda dt: dt.isoformat(),
        }
