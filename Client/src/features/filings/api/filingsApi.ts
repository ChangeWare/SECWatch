import {CompanyFilingHistoryResponse} from "@features/company/types.ts";
import {apiClient} from "@common/api/apiClient.ts";

export const filingsApi = {
    getCompanyFilingsHistory: async (companyId: string): Promise<CompanyFilingHistoryResponse> => {
        const response = await apiClient.get<CompanyFilingHistoryResponse>(`/companies/${companyId}/filings/history`);
        return response.data;
    },
    getCompanyFilingFromSec: async (path: string): Promise<string> => {
        const response = await apiClient.get(`/proxy/filing/${path}`, {
            responseType: 'blob'
        });
        return response.data.text();
    }
}