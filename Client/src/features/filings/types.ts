export interface CompanyFiling {
    accessionNumber: string;
    form: string;
    filingDate: Date;
    items: string;
    primaryDocument: string;
    fiscalYear: number;
    fiscalPeriod: string;
}

export interface CompanyFilingHistory {
    cik: string;
    filings: CompanyFiling[];
    lastUpdated: Date;
}

export interface CompanyFilingHistoryResponse {
    filingHistory: CompanyFilingHistory;
}