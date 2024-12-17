import { SearchResponse} from "../types";
import {apiClient} from "@common/api/apiClient.ts";

export const companySearchApi = {
    fetchResults: async (query: string): Promise<SearchResponse> => {
        if (query.length <= 1) {
            console.log(query);
            return { companies: [] };
        }
        const response = await apiClient.get<SearchResponse>(`/companies/search?searchTerm=${query}&searchField=${0}`);
        return response.data;
    }
}