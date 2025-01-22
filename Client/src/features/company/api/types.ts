import {
    CompanyDetails,
    CompanyConcept,
    TrackedCompanyDetails,
    CompanyUserDashboardPreferences
} from "@features/company/types.ts";

export interface CompanyConceptTypesResponse {
    conceptTypes: string[];
}

export interface CompanyConceptsResponse {
    concepts: CompanyConcept[];
}

export interface CompanyConceptResponse {
    concept: CompanyConcept;
}

export interface CompanyDetailsResponse {
    company: CompanyDetails;
}

export interface TrackedCompaniesResponse {
    trackedCompanies: TrackedCompanyDetails[];
}

export interface CompanyUserDashboardPreferencesResponse {
    preferences: CompanyUserDashboardPreferences;
}