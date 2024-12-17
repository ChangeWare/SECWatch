export interface CompanyResult {
    name: string;
    ticker: string;
}

export interface SearchResponse {
    companies: CompanyResult[];
}