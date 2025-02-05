import { AlertNotification, AlertRule } from "@features/alerts/types.ts";

export interface AlertRulesResponse {
    rules: AlertRule[];
}

export interface CreateAlertRuleRequest {
    rule: AlertRuleInfo;
}

export interface UpdateAlertRuleRequest {
    rule: AlertRuleInfo;
}

export interface AlertRuleInfo {
    id?: string;
    type: string;
    cik: string;
    name: string;
    description: string;
}

export interface UserAlertNotificationsResponse {
    notifications: AlertNotification[];
}