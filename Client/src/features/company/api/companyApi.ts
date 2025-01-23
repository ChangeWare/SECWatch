import { apiClient } from "@common/api/apiClient";
import {
    CompanyConceptResponse,
    CompanyConceptsResponse,
    CompanyConceptTypesResponse,
    CompanyDetailsResponse, CompanyUserDashboardPreferencesResponse,
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
    getCompanyUserDashboardPreferences: async (companyId: string): Promise<CompanyUserDashboardPreferencesResponse> => {
        const response = await apiClient.get<CompanyUserDashboardPreferencesResponse>(`/companies/${companyId}/dashboard/preferences`);
        return response.data;
    },
    postAddConceptToDashboard: async (companyId: string, conceptType: string): Promise<CompanyConceptsResponse> => {
        const response = await apiClient.post<CompanyConceptsResponse>(`/companies/${companyId}/dashboard/pin-concept`,
            {
                'conceptType': conceptType
            }
        );
        return response.data;
    },
    postRemoveConceptFromDashboard: async (companyId: string, conceptType: string): Promise<CompanyConceptsResponse> => {
        const response = await apiClient.post<CompanyConceptsResponse>(`/companies/${companyId}/dashboard/unpin-concept`,
            {
                'conceptType': conceptType
            }
        );
        return response.data;
    },
    getCompanyConcepts: async (companyId: string, specificConceptTypes: string[]): Promise<CompanyConceptsResponse> => {
        const url =`/concepts/company/${companyId}?conceptTypes=${specificConceptTypes.join(',')}`
        const response = await apiClient.get<CompanyConceptsResponse>(url);
        return response.data;
    },
    getAllCompanyConcepts: async (companyId: string): Promise<CompanyConceptsResponse> => {
        const response = await apiClient.get<CompanyConceptsResponse>(`/concepts/company/${companyId}/all`);
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