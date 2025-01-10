from sec_miner.persistence.mongodb.models import FinancialMetricDocument, CompanyFilingHistoryDocument


class CompanyFilingsResult:
    filing_history: CompanyFilingHistoryDocument

    def __init__(self, filing_history: CompanyFilingHistoryDocument):
        self.filing_history = filing_history


class CompanyMetricResult:
    metric_document: FinancialMetricDocument

    def __init__(self, metric_document: FinancialMetricDocument):
        self.metric_document = metric_document
