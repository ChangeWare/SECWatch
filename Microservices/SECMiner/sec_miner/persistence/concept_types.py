from enum import Enum


class ConceptType(Enum):
    ACCOUNTS_PAYABLE = "AccountsPayableCurrent"
    NET_INCOME_LOSS = "NetIncomeLoss"
    OPERATING_INCOME_LOSS = "OperatingIncomeLoss"
    ASSETS_CURRENT = "AssetsCurrent"
    ASSETS = "Assets"
    ASSET_RETIREMENT_OBLIGATION_NONCURRENT = "AssetRetirementObligationsNoncurrent"
    ASSET_RETIREMENT_OBLIGATION_LIABILITIES_INCURRED = "AssetRetirementObligationLiabilitiesIncurred"
    BUILDINGS_AND_IMPROVEMENTS_GROSS = "BuildingsAndImprovementsGross"
    BUSINESS_ACQUISITIONS_RELATED_COSTS = "BusinessCombinationAcquisitionRelatedCosts"
    COMMON_STOCK_SHARES_ISSUED = "CommonStockSharesIssued"
    DIVIDENDS = "Dividends"
    EARNINGS_PER_SHARE_BASIC = "EarningsPerShareBasic"
    EARNINGS_PER_SHARE_DILUTED = "EarningsPerShareDiluted"
    INCOME_TAXES_PAID = "IncomeTaxesPaid"
    INCOME_TAXES_PAID_NET = "IncomeTaxesPaidNet"
    INVENTORY_NET = "InventoryNet"
    LIABILITIES = "Liabilities"
    LINE_OF_CREDIT = "LineOfCredit"
    LONG_TERM_DEBT_CURRENT = "LongTermDebtCurrent"
    SALES_REVENUE_GOODS_NET = "SalesRevenueGoodsNet"
    PAYMENTS_FOR_REPURCHASE_OF_COMMON_STOCK = "PaymentsForRepurchaseOfCommonStock"
    PAYMENTS_FOR_REPURCHASE_OF_EQUITY = "PaymentsForRepurchaseOfEquity"

    ACCRUED_BONUSES_CURRENT = "AccruedBonusesCurrent"
    ACCRUED_VACATION_CURRENT = "AccruedVacationCurrent"
    DEFINE_CONTRIBUTION_PLAN_COST_RECOGNIZED = "DefinedContributionPlanCostRecognized"
    EMPLOYEE_RELATED_LIABILITIES_CURRENT = "EmployeeRelatedLiabilitiesCurrent"
    SEVERANCE_COSTS = "SeveranceCosts"

    BusinessExitCosts = "BusinessExitCosts"
    RestructuringCharges = "RestructuringCharges"
    RestructuringReserve = "RestructuringReserve"
    SeveranceCosts = "SeveranceCosts"

    NUMBER_OF_STORES = "NumberOfStores"
    LEASE_AND_RENTAL_EXPENSE = "LeaseAndRentalExpense"
    LossContingencyClaimsSettledNumber = "LossContingencyClaimsSettledNumber"

    def __str__(self):
        return self.name



