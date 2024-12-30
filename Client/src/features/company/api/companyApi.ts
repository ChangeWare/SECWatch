import { apiClient } from "@common/api/apiClient";
import {CompanyDetailsResponse, CompanyFinancialMetricResponse} from "@features/company/types.ts";


/**
 * Authentication API methods
 */
export const companyApi = {
    /**
     * Log in a user with email and password
     */
    getCompanyDetails: async (companyId: string): Promise<CompanyDetailsResponse> => {
        const response = await apiClient.get<CompanyDetailsResponse>('/companies/details/' + companyId);
        return response.data;
    },

    getCompanyAccountsPayableByFY: async (companyId: string): Promise<CompanyFinancialMetricResponse> => {
        const response = await apiClient.get<CompanyFinancialMetricResponse>(`/financials/companies/${companyId}/accounts-payable/fiscal-year`);
        return response.data;
    }
};