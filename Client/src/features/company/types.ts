export interface CompanyDetailsResponse {
    company: CompanyDetails;
}

export interface CompanyFinancialMetricsResponse {
    metricType: string;
    lastValue: number;
    companyCik: string;
    lastUpdated: Date;
    lastReported: Date;

}

export interface CompanyDetails {
    cik: string;
    name: string;
    mailingAddress: CompanyAddress;
    businessAddress: CompanyAddress;
    lastUpdated: Date;
}

export interface CompanyAddress {
    street: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    county: string;
}