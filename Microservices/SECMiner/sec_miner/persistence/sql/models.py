import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, DECIMAL
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship, validates
from sqlalchemy.ext.declarative import declarative_base
from sec_miner.persistence.financial_metric import FinancialMetric

Base = declarative_base()


class Company(Base):
    __tablename__ = 'Companies'

    Id = Column(UNIQUEIDENTIFIER, primary_key=True, default=uuid.uuid4)
    Ticker = Column(String(10))
    CIK = Column(String(10))
    Name = Column(String(200))
    SIC = Column(String(4))
    LastUpdated = Column(DateTime)

    CompanyFinancialMetrics = relationship("CompanyFinancialMetric", back_populates="Company")
    Addresses = relationship("Address", back_populates="Company")


class Address(Base):
    __tablename__ = 'Addresses'

    Id = Column(UNIQUEIDENTIFIER, primary_key=True, default=uuid.uuid4)
    CompanyId = Column(UNIQUEIDENTIFIER, ForeignKey('Companies.Id'))
    Street = Column(String(200))
    Street2 = Column(String(200))
    City = Column(String(100))
    State = Column(String(2))
    Country = Column(String(100))
    Zip = Column(String(10))
    AddressType = Column(String(50))

    Company = relationship("Company", back_populates="Addresses")


class CompanyFinancialMetric(Base):
    __tablename__ = 'CompanyFinancialMetrics'

    Id = Column(UNIQUEIDENTIFIER, primary_key=True, default=uuid.uuid4)

    FirstReported = Column(DateTime, nullable=False)
    LastReported = Column(DateTime, nullable=False)
    LastUpdated = Column(DateTime, nullable=False)

    Metric = Column(String(50), nullable=False)

    LastValue = Column(DECIMAL, nullable=False)

    CompanyCIK = Column(UNIQUEIDENTIFIER, ForeignKey('Companies.CIK'))
    Company = relationship("Company", back_populates="CompanyFinancialMetrics")

    @validates('Metric')
    def validate_metric(self, key, value):
        if not isinstance(value, FinancialMetric):
            raise ValueError(f"Metric must be a FinancialMetric enum, got {type(value)}")
        return value.value
