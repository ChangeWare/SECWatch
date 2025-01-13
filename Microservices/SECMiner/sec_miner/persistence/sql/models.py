import uuid
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, DECIMAL, Boolean
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.orm import relationship, validates
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Company(Base):
    __tablename__ = 'Companies'

    id = Column('Id', UNIQUEIDENTIFIER, primary_key=True, default=uuid.uuid4)
    ticker = Column('Ticker', String(10))
    cik = Column('CIK', String(10))
    name = Column('Name', String(200))
    sic = Column('SIC', String(4))
    last_updated = Column('LastUpdated', DateTime)
    last_known_filing_date = Column('LastKnownFilingDate', DateTime)

    addresses = relationship("Address", back_populates="company")


class Address(Base):
    __tablename__ = 'Addresses'

    id = Column('Id', UNIQUEIDENTIFIER, primary_key=True, default=uuid.uuid4)
    company_id = Column('CompanyId', UNIQUEIDENTIFIER, ForeignKey('Companies.Id'))
    street = Column('Street', String(200))
    street2 = Column('Street2', String(200))
    city = Column('City', String(100))
    state = Column('State', String(2))
    country = Column('Country', String(100))
    zip = Column('Zip', String(10))
    address_type = Column('AddressType', String(50))

    company = relationship("Company", back_populates="addresses")