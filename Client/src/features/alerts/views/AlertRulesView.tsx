import React from 'react';
import {Bell, Plus, Trash2} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '@/common/components/Card';
import Button from '@/common/components/Button';
import StyledLink from '@/common/components/HyperLink';
import AlertRuleDialog from "@features/alerts/components/AlertRuleDialog.tsx";
import {useAlertRules} from "../hooks/useAlertRules.tsx";
import {CreateAlertRuleRequest, CreateFilingAlertRuleInfo} from "@features/alerts/api/types.ts";
import {
    AlertRule,
    AlertRuleFormData,
    AlertRuleTypes,
    FilingAlertData,
    FilingAlertRule
} from "@features/alerts/types.ts";
import {toast} from 'react-toastify';
import {formatRuleType} from "@features/alerts/utils.ts";


const AlertRulesView = () => {
    const [dialogOpen, setDialogOpen] = React.useState(false);

    const { alertRules, createAlertRule } = useAlertRules();

    const handleCreateRule = (submission: AlertRuleFormData) => {
        const req = constructTypedRule(submission);

        if (!req) {
            toast.error('Invalid alert rule');
            return;
        }

        createAlertRule(req);
        setDialogOpen(false);
    };


    const handleDeleteRule = (ruleId: string) => {

    };

    const constructTypedRule = (ruleSubmission: AlertRuleFormData): CreateAlertRuleRequest | null => {
        switch (ruleSubmission.type) {
            case AlertRuleTypes.Filing:
                return {
                    rule: {
                        type: AlertRuleTypes.Filing,
                        name: ruleSubmission.name,
                        description: ruleSubmission.description,
                        cik: ruleSubmission.company?.cik || '',
                        formTypes: (ruleSubmission.data as FilingAlertData).formTypes
                    } as CreateFilingAlertRuleInfo
                };
            default:
                return null;
        }
    }

    const renderAlertTypeFields = (rule: AlertRule) => {
        switch (rule.type) {
            case AlertRuleTypes.Filing:
                const filingAlertRule = rule as FilingAlertRule;
                if (filingAlertRule.formTypes.length > 0) {
                    return (
                        <div className="flex items-center gap-2 text-sm text-secondary">
                            {filingAlertRule.formTypes.map((type) => (
                                <span key={type} className="px-2 py-1 rounded bg-surface-foreground">
                                {type}
                            </span>
                            ))}
                        </div>
                    );
                }
                break;
            default:
                return null;
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <Bell className="h-6 w-6 text-info" />
                    <h1 className="text-2xl font-bold">Alert Rules</h1>
                </div>
                <Button
                    variant="primary"
                    onClick={() => setDialogOpen(true)}
                    className="flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    New Alert Rule
                </Button>

                <AlertRuleDialog
                    open={dialogOpen}
                    onOpenChange={setDialogOpen}
                    onSubmit={handleCreateRule}
                />
            </div>

            <div className="grid gap-4">
                {alertRules.length === 0 ? (
                    <Card variant="subtle" className="text-center py-12">
                        <CardContent>
                            <p className="text-secondary mb-4">
                                You haven't created any alert rules yet.
                            </p>
                            <Button
                                variant="primary"
                                to="/alerts/new"
                                className="inline-flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Create Your First Alert
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    alertRules.map(rule => (
                        <Card key={rule.id} variant="default" className="hover:border-info/50">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="mb-2">
                                            <StyledLink to={`/companies/${rule.company.cik}`} variant="default">
                                                {rule.company.name} ({rule.company.ticker})
                                            </StyledLink>
                                        </CardTitle>
                                        <div className="flex items-center gap-2 text-sm text-secondary mb-8">
                                            <span className="px-2 py-1 rounded bg-surface-foreground">
                                                {formatRuleType(rule.type)} Alert
                                            </span>
                                            {renderAlertTypeFields(rule)}
                                        </div>
                                        <h2 className="text-secondary text-lg">{rule.name}</h2>
                                        <p className="text-sm text-tertiary">{rule.description}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            variant="danger"
                                            className="p-2"
                                            onClick={() => handleDeleteRule(rule.id)}
                                            title="Delete Rule"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-tertiary mb-1">
                                    Created: {rule.createdAt.toLocaleDateString()}
                                </div>
                                <div className="text-sm text-tertiary">
                                    Last Triggered: {rule.lastTriggeredAt ? rule.lastTriggeredAt.toLocaleDateString() : 'Never'}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default AlertRulesView;