from sec_miner.persistence.mongodb.models import CompanyConceptDocument, CompanyFilingHistoryDocument


class CompanyFilingsResult:
    filing_history: CompanyFilingHistoryDocument

    def __init__(self, filing_history: CompanyFilingHistoryDocument):
        self.filing_history = filing_history


class CompanyConceptResult:
    concept_document: CompanyConceptDocument
    message: str

    def __init__(self, concept_document: CompanyConceptDocument, message: str):
        self.concept_document = concept_document
        self.message = message
