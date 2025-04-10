import uuid
from sqlalchemy import Column, String, ForeignKey, DateTime, Unicode
from sqlalchemy.dialects.mssql import UNIQUEIDENTIFIER
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Company(Base):
    __tablename__ = 'Companies'

    id = Column('Id', UNIQUEIDENTIFIER, primary_key=True, default=uuid.uuid4)
    ticker = Column('Ticker', String(10))
    cik = Column('CIK', String(10))
    name = Column('Name', String(255))
    sic = Column('SIC', String(5))
    last_updated = Column('LastUpdated', DateTime)
    last_known_filing_date = Column('LastKnownFilingDate', DateTime)
    ein = Column('EIN', String(12))
    entity_type = Column('EntityType', String(50))
    website = Column('Website', String(200))
    fiscal_year_end = Column('FiscalYearEnd', String(10))
    state_of_incorporation = Column('StateOfIncorporation', String(20))
    phone_number = Column('PhoneNumber', String(20))
    former_names = Column('FormerNames', Unicode)
    exchanges = Column('Exchanges', Unicode)

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
