import {CompanyFiling} from "@features/filings/types.ts";

export interface CompanyUserDashboardPreferences {
    pinnedConcepts: string[];
}

export interface GroupedConceptDataPoints {
    date: Date;
    fiscalYear: number;
    fiscalPeriod: string;
    fiscalLabel: string;
    value: number;
    hasDiscrepancy: boolean;
    hasMultipleFilings: boolean;
    unitType: string;
    details: {
        underlyingData: ConceptDataPoint[];
        valueRange?: {
            min: number;
            max: number;
            diff: number;
        };
    };
}

export interface ConceptDataPoint {
    endDate: Date;
    value: number;
    fiscalYear: number;
    fiscalPeriod: string;
    formType: string;
    filingDate: Date;
    frame: string;
    unitType: string;
}

export interface CompanyConcept {
    cik: string;
    lastValue: number;
    lastUpdated: Date;
    lastReported: Date;
    description: string;
    category: string;
    isCurrencyData: boolean;

    unitTypes: string[];
    conceptType: string;
    dataPoints: ConceptDataPoint[];
}

export interface CompanyDetails {
    cik: string;
    name: string;
    ticker: string;
    mailingAddress: CompanyAddress;
    businessAddress: CompanyAddress;
    lastUpdated: Date;
    isTracked: boolean;
}

export interface TrackedCompanyDetails {
    lastEvent: Date;
    newFilings: number;
    dateAdded: Date;
    ticker: string;
    company: CompanyDetails;
    mostRecentFiling: CompanyFiling;
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

