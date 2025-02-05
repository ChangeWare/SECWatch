import {CompanyResult} from "@features/companySearch/types.ts";
import {CompanyDetails} from "@features/company/types.ts";

export interface AlertRule {
    id: string;
    type: string;
    name: string;
    description?: string;
    company: CompanyDetails;
    createdAt: Date;
    lastTriggeredAt?: Date;
    enabled: boolean;
}

export interface FilingAlertRule extends AlertRule {
    formTypes: string[];
}

export const FILING_TYPES = ['10-K', '10-Q', '8-K', '13F', 'S-1'];

export enum AlertRuleTypes {
    Filing = 'filing',
}

export interface AlertRuleFormData {
    id?: string;
    type: string;
    name: string;
    description: string;
    company?: CompanyResult;
    data: Record<string, any>;
}

export interface FilingAlertData {
    formTypes: string[];
}

export enum AlertEventTypes {
    FilingAlert
}

export interface AlertNotification {
    id: string;
    ruleId: string;
    createdAt: Date;
    eventType: AlertEventTypes;
    isViewed: boolean;
    isDismissed: boolean;
    viewedAt?: Date;
}

export interface FilingAlertNotification extends AlertNotification {
    formType: string;
    accessionNumber: string;
    company: CompanyDetails;
    filingDate: Date;
}