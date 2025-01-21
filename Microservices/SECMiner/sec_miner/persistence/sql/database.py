from datetime import datetime
from typing import List
from sqlalchemy import text, create_engine, QueuePool
from sqlalchemy.orm import sessionmaker
from sec_miner.config.loader import config
from sec_miner.persistence.sql.models import Company


class DbContext:
    def __init__(self):
        connection_args = {
            "connect_timeout": 30,  # Give enough time for initial connection
            "timeout": 30,  # Command timeout
        }

        # Minimal engine configuration - each task manages its own connection
        self.engine = create_engine(
            config.DATABASE_CONNECTION,
            pool_size=1,
            max_overflow=0,
            pool_timeout=30,
            connect_args=connection_args
        )

        self.session = sessionmaker(bind=self.engine)

    def find_missing_ciks(self, ciks: list[str], batch_size: int = 2500) -> list[str]:
        """
        Efficiently find which CIKs from the provided list don't exist in our database.
        Uses batching to handle large lists of CIKs.
        """

        missing_ciks = []
        with self.session() as session:
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

    def get_all_companies(self) -> List[Company]:
        with self.session() as session:
            companies = session.query(Company).all()
            return companies

    def get_all_company_ciks(self):
        with self.session() as session:
            companies = session.query(Company).all()
            company_ciks = [c.cik for c in companies]
            return company_ciks

    def upsert_companies(self, companies: List[Company]):
        with self.session() as session:
            for company in companies:
                company.last_updated = datetime.utcnow()
                session.merge(company)
            session.commit()

    def update_company_last_known_filing_date(self, cik: str, date: datetime):
        with self.session() as session:
            company = session.query(Company).filter(Company.cik == cik).first()
            company.last_known_filing_date = date
            company.last_updated = datetime.utcnow()
            session.commit()
