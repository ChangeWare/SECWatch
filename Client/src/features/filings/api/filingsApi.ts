import {apiClient} from "@common/api/apiClient.ts";
import {CompanyFilingHistoryResponse} from "@features/filings/types.ts";

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