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


class SECFiling(BaseModel):
    """Individual SEC filing"""
    accession_number: str
    filing_date: datetime
    report_date: Optional[datetime]
    act: Optional[str]
    form: Optional[str]
    file_number: Optional[str]
    film_number: Optional[str]
    items: Optional[str]
    size: int
    is_xbrl: bool
    is_inline_xbrl: bool
    primary_document: Optional[str]
    primary_doc_description: Optional[str]


class FilingHistoryMetadata(BaseModel):
    """Metadata about the company's filing history"""
    first_filed: datetime
    last_filed: datetime
    last_fetched: datetime
    total_filings: int
    form_types: List[str]
    date_range: dict


class CompanyFilingHistoryDocument(BaseModel):
    """Complete filing history for a company"""
    cik: str
    filings: List[SECFiling]
    metadata: FilingHistoryMetadata


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
