import { apiClient } from "@common/api/apiClient.ts";
import {
    AlertRulesResponse,
    CreateAlertRuleRequest,
    UpdateAlertRuleRequest,
    UserAlertNotificationsResponse
} from "@features/alerts/api/types.ts";

export const alertsApi = {

    getUserAlertRules: async (): Promise<AlertRulesResponse> => {
        const response = await apiClient.get(`/alerts/rules`);
        return response.data;
    },
    createAlertRule: async (req: CreateAlertRuleRequest) => {
        const response = await apiClient.post(`/alerts/rules/create`, req);
        return response.data;
    },
    deleteAlertRule: async (ruleId: string) => {
        const response = await apiClient.delete(`/alerts/rules/${ruleId}`);
        return response.data;
    },
    updateAlertRule: async (req: UpdateAlertRuleRequest) => {
        const response = await apiClient.put(`/alerts/rules/${req.rule.id}`, req);
        return response.data;
    },

    getUserAlertNotifications: async (): Promise<UserAlertNotificationsResponse> => {
        const response = await apiClient.get(`/alerts/notifications`);
        return response.data;
    }
}