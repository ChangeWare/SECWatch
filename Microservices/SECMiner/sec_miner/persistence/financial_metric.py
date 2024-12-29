from enum import Enum


class FinancialMetric(str, Enum):
    ACCOUNTS_PAYABLE = "AccountsPayable"
    REVENUE = "Revenue"
    NET_INCOME = "NetIncome"
