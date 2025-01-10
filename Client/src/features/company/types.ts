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

export interface CurrencyGroupedData {
    [currency: string]: ProcessedDataPoint[];
}

export interface ProcessedDataPoint {
    date: Date;
    fiscalYear: number;
    fiscalPeriod: string;
    fiscalLabel: string;
    value: number;
    hasDiscrepancy: boolean;
    hasMultipleFilings: boolean;
    currencyType: string;
    details: {
        underlyingData: MetricDataPoint[];
        valueRange?: {
            min: number;
            max: number;
            diff: number;
        };
    };
}

export enum MetricType {
    AccountsPayable = 0,
}


export enum PeriodType {
    Yearly = 0,
    Quarterly = 1,
}

export interface CompanyFinancialMetric {
    cik: string;
    metricType: number;
    lastValue: number;
    lastUpdated: Date;
    lastReported: Date;

    currencyTypes: string[];
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

