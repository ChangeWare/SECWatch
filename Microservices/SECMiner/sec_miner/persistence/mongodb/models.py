from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any
from bson.objectid import ObjectId
from sec_miner.persistence.concept_types import ConceptType


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

    def to_dict(self) -> Dict[str, Any]:
        """Convert filing to dictionary for storage"""
        return {
            'accession_number': self.accession_number,
            'filing_date': self.filing_date.isoformat(),
            'report_date': self.report_date.isoformat() if self.report_date else None,
            'act': self.act,
            'form': self.form,
            'file_number': self.file_number,
            'film_number': self.film_number,
            'items': self.items,
            'size': self.size,
            'is_xbrl': self.is_xbrl,
            'is_inline_xbrl': self.is_inline_xbrl,
            'primary_document': self.primary_document,
            'primary_doc_description': self.primary_doc_description
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'SECFiling':
        """Create filing from dictionary data"""
        # Parse datetime fields
        filing_date = datetime.fromisoformat(data['filing_date'])
        report_date = (datetime.fromisoformat(data['report_date'])
                       if data.get('report_date') else None)

        return cls(
            accession_number=data['accession_number'],
            filing_date=filing_date,
            report_date=report_date,
            act=data.get('act'),
            form=data.get('form'),
            file_number=data.get('file_number'),
            film_number=data.get('film_number'),
            items=data.get('items'),
            size=data['size'],
            is_xbrl=data['is_xbrl'],
            is_inline_xbrl=data['is_inline_xbrl'],
            primary_document=data.get('primary_document'),
            primary_doc_description=data.get('primary_doc_description')
        )


class FilingHistoryMetadata(BaseModel):
    """Metadata about the company's filing history"""
    first_filed: Optional[datetime]
    last_filed: Optional[datetime]
    last_fetched: datetime
    total_filings: int
    form_types: List[str]
    date_range: Optional[dict]


class CompanyFilingHistoryDocument(BaseModel):
    """Complete filing history for a company"""
    cik: str
    filings: List[SECFiling]
    most_recent_filing: Optional[SECFiling]
    metadata: FilingHistoryMetadata


class ConceptDataPoint(BaseModel):
    start_date: Optional[datetime] = None
    end_date: datetime
    value: float

    fiscal_year: Optional[int] = None

    fiscal_period: Optional[str] = None

    accession_number: Optional[str] = None
    form_type: str
    filing_date: datetime
    frame: Optional[str] = None
    unit_type: str

    class Config:
        populate_by_name = True


class CompanyConceptMetadata(BaseModel):
    first_reported: datetime
    last_reported: datetime
    last_updated: datetime
    last_value: float
    unit_types: List[str]
    total_data_points: int
    date_range: Dict[str, Any]


class CompanyConceptsMetadataDocument(BaseModel):
    cik: str
    available_concepts: List[str]
    total_concepts: int
    last_updated: datetime


class CompanyConceptDocument(BaseModel):
    cik: str
    concept_type: ConceptType
    data_points: List[ConceptDataPoint]
    metadata: CompanyConceptMetadata

    class Config:
        allow_population_by_field_name = True
