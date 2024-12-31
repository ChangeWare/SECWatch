export interface CompanyResult {
    name: string;
    ticker: string;
    cik: string;
}

export interface SearchResponse {
    companies: CompanyResult[];
}