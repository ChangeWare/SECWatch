import { apiClient } from "@common/api/apiClient.ts";
import {AlertRulesResponse} from "@features/alerts/api/types.ts";

export const alertsApi = {

    getUserAlertRules: async (): Promise<AlertRulesResponse> => {
        const response = await apiClient.get(`/alerts/rules`);
        return response.data;
    },
    createAlertRule: async (rule: any) => {
        const response = await apiClient.post(`/alerts/rules/create`, rule);
        return response.data;
    },
}