from typing import List
from sqlalchemy import text, create_engine
from sqlalchemy.orm import sessionmaker
from sec_miner.config import Config
from sec_miner.persistence.sql.models import Company


def find_missing_ciks(ciks: list[str], batch_size: int = 2500) -> list[str]:
    """
    Efficiently find which CIKs from the provided list don't exist in our database.
    Uses batching to handle large lists of CIKs.
    """

    engine = create_engine(Config.DATABASE_CONNECTION)
    session = sessionmaker(bind=engine)

    missing_ciks = []
    with session() as session:
        with session.begin():
            for i in range(0, len(ciks), batch_size):
                batch = ciks[i:i + batch_size]
                cik_list = ','.join(batch)

                query = text("""
                    SELECT t.value AS cik
                    FROM STRING_SPLIT(CONVERT(nvarchar(max), :ciks), ',') t
                    WHERE NOT EXISTS (
                        SELECT 1 
                        FROM dbo.Companies 
                        WHERE cik = t.value
                    )
                """)

                result = session.execute(query, {'ciks': cik_list})
                batch_missing = [row.cik for row in result.fetchall()]
                missing_ciks.extend(batch_missing)

    return missing_ciks


def upsert_companies(companies: List[Company]):
    """Store new companies in the database"""
    engine = create_engine(Config.DATABASE_CONNECTION)
    session = sessionmaker(bind=engine)

    with session() as session:
        with session.begin():
            for company in companies:
                session.merge(company)
            session.commit()


def get_all_company_ciks():
    engine = create_engine(Config.DATABASE_CONNECTION)
    session = sessionmaker(bind=engine)

    with session() as session:
        with session.begin():
            companies = session.query(Company).all()
            company_ciks = [c.CIK for c in companies]
            return company_ciks