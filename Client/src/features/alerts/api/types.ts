import {AlertRule, AlertRuleTypes} from "@features/alerts/types.ts";

export interface AlertRulesResponse {
    rules: AlertRule[];
}

export interface CreateAlertRuleRequest {
    rule: CreateAlertRuleInfo;
}

export interface CreateAlertRuleInfo {
    type: string;
    cik: string;
    name: string;
    description: string;
}

export interface CreateFilingAlertRuleInfo extends CreateAlertRuleInfo {
    type: AlertRuleTypes.Filing;
    formTypes: string[];
}