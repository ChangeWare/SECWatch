import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, DECIMAL
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship, validates
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Company(Base):
    __tablename__ = 'Companies'

    Id = Column(UNIQUEIDENTIFIER, primary_key=True, default=uuid.uuid4)
    Ticker = Column(String(10))
    CIK = Column(String(10))
    Name = Column(String(200))
    SIC = Column(String(4))
    LastUpdated = Column(DateTime)

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
