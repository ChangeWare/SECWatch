import React, {useState, useEffect, useMemo} from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {Card, CardContent} from "@common/components/Card.tsx";
import {CompanyFinancialMetric, MetricDataPoint, MetricType} from "@features/company/types.ts";
import LoadingScreen from "@common/components/LoadingIndicator.tsx";
import MetricDataTableModal from "@features/company/components/MetricDataTableModal.tsx";
import FinancialMetricsChart from "@features/company/components/FinancialMetricsChart.tsx";

interface AccountsPayableContentProps {
    accountsPayableMetric: CompanyFinancialMetric;
}


function AccountsPayableContent(props: AccountsPayableContentProps) {

    const { dataPoints: data } = props.accountsPayableMetric;

    const change = useMemo(() => {
        const calculateChange = (data: MetricDataPoint[]) => {
            if (data.length < 2) return { value: 0, percentage: 0 };
            const currentValue = data[0].value;
            const previousValue = data[1].value;
            const change = currentValue - previousValue;
            const percentage = (change / previousValue) * 100;
            return { value: change, percentage };
        };

        if (data?.length <= 0) return { value: 0, percentage: 0 };

        return calculateChange(props.accountsPayableMetric.dataPoints);

    }, [props.accountsPayableMetric]);

    const formatCurrency = (value: number): string => {
        if (Math.abs(value) >= 1_000_000_000) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            }).format(value / 1_000_000_000) + 'B';
        }
        if (Math.abs(value) >= 1_000_000) {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
            }).format(value / 1_000_000) + 'M';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (data?.length ?? 0) > 0 ? (
        <>
            {/* Section Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-bold text-foreground">Accounts Payable</h2>
                    <p className="text-sm text-secondary">Historical accounts payable data and trends</p>
                </div>
                <MetricDataTableModal metric={props.accountsPayableMetric} formatValue={formatCurrency}/>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/10">
                    <CardContent className="pt-6">
                        <div className="text-sm text-primary-light">Current Amount</div>
                        <div className="text-2xl font-bold mt-2 text-white">
                            {formatCurrency(props.accountsPayableMetric.lastValue)}
                        </div>
                        <div className="flex items-center mt-2">
                            {change.percentage > 0 ? (
                                <TrendingUp className="text-accent mr-1" size={16} />
                            ) : (
                                <TrendingDown className="text-destructive mr-1" size={16} />
                            )}
                            <span className={`text-sm font-medium mr-1 ${
                                change.percentage > 0 ? "text-metrics-stable" : "text-metrics-decline"
                            }`}>
                  {change.percentage.toFixed(1)}%
                </span><span className="text-sm text-secondary">vs previous year</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/10">
                    <CardContent className="pt-6">
                        <div className="text-sm text-primary-light">Year-over-Year Change</div>
                        <div className="text-2xl font-bold mt-2 text-foreground">
                            {formatCurrency(Math.abs(change.value))}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            {change.value > 0 ? 'Increase' : 'Decrease'} from previous year
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <FinancialMetricsChart
                data={data}
                metricType={MetricType.AccountsPayable}
                valueFormatter={formatCurrency}
            />

            <div className="text-sm text-muted-foreground">
                Last updated: {props.accountsPayableMetric.lastUpdated?.toLocaleDateString() ?? 'N/A'}
            </div>
        </>
    ) : null;
}

interface AccountsPayableSectionProps {
    accountsPayableMetric?: CompanyFinancialMetric;
}

function AccountsPayableSection(props: AccountsPayableSectionProps) {

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <LoadingScreen isLoading={props.accountsPayableMetric == null}>
                    <AccountsPayableContent accountsPayableMetric={props.accountsPayableMetric!} />
                </LoadingScreen>
            </CardContent>
        </Card>
    );
}

export default AccountsPayableSection;