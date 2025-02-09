export interface CompanyFiling {
    accessionNumber: string;
    form: string;
    filingDate: Date;
    reportDate: Date | undefined;
    items: string;
    primaryDocument: string;
}

export interface CompanyFilingHistory {
    cik: string;
    filings: CompanyFiling[];
    lastUpdated: Date;
}

export interface CompanyFilingHistoryResponse {
    filingHistory: CompanyFilingHistory;
}