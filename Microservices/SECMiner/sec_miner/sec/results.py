from sec_miner.persistence.mongodb.models import FinancialMetricDocument
from sec_miner.persistence.sql.models import CompanyFinancialMetric


class CompanyMetricResult:
    financial_metric: CompanyFinancialMetric
    metric_document: FinancialMetricDocument

    def __init__(self, financial_metric: CompanyFinancialMetric, metric_document: FinancialMetricDocument):
        self.financial_metric = financial_metric
        self.metric_document = metric_document
