import { apiClient } from "@common/api/apiClient";
import {CompanyDetailsResponse} from "@features/company/types.ts";


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

    getCompanyAccountsPayable: async (companyId: string): Promise<CompanyDetailsResponse> => {

    }
};