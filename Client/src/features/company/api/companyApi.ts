import { apiClient } from "@common/api/apiClient";
import {
    CompanyConceptResponse,
    CompanyConceptsResponse,
    CompanyConceptTypesResponse,
    CompanyDetailsResponse,
    TrackedCompaniesResponse
} from "@features/company/api/types.ts";


/**
 * Authentication API methods
 */
export const companyApi = {
    /**
     * Log in a user with email and password
     */
    getCompanyDetails: async (companyId: string): Promise<CompanyDetailsResponse> => {
        const response = await apiClient.get<CompanyDetailsResponse>(`/companies/${companyId}/details/`);
        return response.data;
    },
    getCompanyConcepts: async (companyId: string): Promise<CompanyConceptsResponse> => {
        const response = await apiClient.get<CompanyConceptsResponse>(`/concepts/company/${companyId}`);
        return response.data;
    },
    postTrackCompany: async (companyId: string): Promise<CompanyDetailsResponse> => {
        const response = await apiClient.post<CompanyDetailsResponse>(`/companies/${companyId}/track`);
        return response.data;
    },
    postUntrackCompany: async (companyId: string): Promise<CompanyDetailsResponse> => {
        const response = await apiClient.post<CompanyDetailsResponse>(`/companies/${companyId}/untrack`);
        return response.data;
    },
    getTrackedCompanies: async (): Promise<TrackedCompaniesResponse> => {
        const response = await apiClient.get<TrackedCompaniesResponse>('/companies/tracked');
        return response.data;
    }
};