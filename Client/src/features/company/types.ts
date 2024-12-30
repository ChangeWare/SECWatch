export interface CompanyDetailsResponse {
    company: CompanyDetails;
}

export interface CompanyFinancialMetricResponse {
    metric: CompanyFinancialMetric;
}

export interface MetricDataPoint {
    endDate: Date;
    value: number;
    fiscalYear: number;
    fiscalPeriod: string;
    formType: string;
    filingDate: Date;
    frame: string;
    currencyType: string;
}

export interface CompanyFinancialMetric {
    cik: string;
    metricType: string;
    lastValue: number;
    lastUpdated: Date;
    lastReported: Date;

    dataPoints: MetricDataPoint[];
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