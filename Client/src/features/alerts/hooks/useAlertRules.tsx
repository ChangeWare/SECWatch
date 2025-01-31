import {useMutation, useQuery} from "@tanstack/react-query";
import {alertsApi} from "@features/alerts/api/alertsApi.ts";
import {useMemo} from "react";
import {AlertRule} from "@features/alerts/types.ts";
import {AlertRulesResponse, CreateAlertRuleRequest, UpdateAlertRuleRequest} from "@features/alerts/api/types.ts";
import {toast} from "react-toastify";
import queryClient from "@common/api/queryClient.ts";

export const useAlertRules = () => {

    const { data, isLoading } = useQuery<AlertRulesResponse>({
        queryKey: ['alertRules'],
        queryFn: alertsApi.getUserAlertRules,
    })

    const createAlertRuleMutation = useMutation({
        mutationFn: (createAlertRuleRequest: CreateAlertRuleRequest) => alertsApi.createAlertRule(createAlertRuleRequest),
        onSuccess: async (resp) => {
            toast.success('Alert rule created');
            await queryClient.invalidateQueries({ queryKey: ['alertRules'] });
        }
    });

    const updateAlertRuleMutation = useMutation({
        mutationFn: (updateAlertRuleRequest: UpdateAlertRuleRequest) => alertsApi.updateAlertRule(updateAlertRuleRequest),
        onSuccess: async (resp) => {
            toast.success('Alert rule updated');
            await queryClient.invalidateQueries({ queryKey: ['alertRules'] });
        }
    });

    const deleteAlertRuleMutation = useMutation({
        mutationFn: alertsApi.deleteAlertRule,
        onSuccess: async (resp) => {
            toast.info('Alert rule deleted');
            await queryClient.invalidateQueries({ queryKey: ['alertRules'] });
        },
        onError: (error) => {
            toast.error('Failed to delete alert rule');
        }
    })

    const alertRules = useMemo<AlertRule[]>(() => {
        if (!data) return [];

        return data.rules.map((rule) => ({
            ...rule,
            createdAt: new Date(rule.createdAt),
            lastTriggeredAt: rule.lastTriggeredAt ? new Date(rule.lastTriggeredAt) : undefined,
        }));

    }, [data]);

    return {
        alertRules,
        isLoading,

        createAlertRule: createAlertRuleMutation.mutate,
        updateAlertRule: updateAlertRuleMutation.mutate,
        deleteAlertRule: deleteAlertRuleMutation.mutate,
    }
}