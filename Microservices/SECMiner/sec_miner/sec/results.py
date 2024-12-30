from sec_miner.persistence.mongodb.models import FinancialMetricDocument


class CompanyMetricResult:
    metric_document: FinancialMetricDocument

    def __init__(self, metric_document: FinancialMetricDocument):
        self.metric_document = metric_document
