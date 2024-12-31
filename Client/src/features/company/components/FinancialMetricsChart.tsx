import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@common/components/Card';
import { MetricDataPoint, MetricType } from '../types';
import { getMetricTypeDisplayName } from "@features/company/utils.tsx";

interface FinancialMetricsChartProps {
    data: MetricDataPoint[];
    metricType: MetricType;
    valueFormatter: (value: number) => string;
    // Optional formatting preferences
    dateFormatter?: (date: Date) => string;
}

const formatFiscalPeriod = (point: MetricDataPoint): string => {
    return point.fiscalPeriod === 'FY'
        ? `FY${point.fiscalYear}`
        : `${point.fiscalYear}Q${point.fiscalPeriod.replace('Q', '')}`;
};

const FinancialMetricsChart = ({
                                   data,
                                   metricType,
                                   valueFormatter,
                                   dateFormatter = (date: Date) => date.toLocaleDateString()
                               }: FinancialMetricsChartProps) => {

    const processedData = useMemo(() => {
        // Group by end date
        const groupedByDate = data.reduce((acc, curr) => {
            const dateStr = curr.endDate.toISOString();
            if (!acc[dateStr]) {
                acc[dateStr] = [];
            }
            acc[dateStr].push(curr);
            return acc;
        }, {} as Record<string, MetricDataPoint[]>);

        // Process each date group
        return Object.entries(groupedByDate).map(([dateStr, points]) => {
            // Sort by filing date to get most recent
            const sorted = [...points].sort((a, b) =>
                b.filingDate.getTime() - a.filingDate.getTime()
            );

            // Identify data quality issues
            const hasDuplicates = points.length > 1;
            const hasValueDiscrepancy = points.some(p => p.value !== points[0].value);
            const mostRecent = sorted[0];

            return {
                date: mostRecent.endDate,
                fiscalLabel: formatFiscalPeriod(mostRecent),
                value: mostRecent.value,
                hasIssues: hasDuplicates || hasValueDiscrepancy,
                details: {
                    filingCount: points.length,
                    values: points.map(p => ({
                        value: p.value,
                        filed: p.filingDate,
                        form: p.formType,
                        fp: p.fiscalPeriod,
                        currency: p.currencyType
                    }))
                }
            };
        }).sort((a, b) => a.date.getTime() - b.date.getTime());
    }, [data]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload || !payload[0]) return null;

        const dataPoint = payload[0].payload;

        return (
            <Card className="bg-surface p-4">
                <CardHeader className="p-0 pb-2">
                    <CardTitle className="text-sm">
                        {dataPoint.fiscalLabel}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="text-sm">
                        <div className="font-medium">
                            {valueFormatter(dataPoint.value)}
                        </div>
                        <div className="text-tertiary mt-1">
                            Date: {dateFormatter(dataPoint.date)}
                        </div>
                        {dataPoint.hasIssues && (
                            <div className="mt-2 text-xs">
                                <div className="text-error">Data Quality Notice:</div>
                                <div>{dataPoint.details.filingCount} filings for this date</div>
                                {dataPoint.details.values.map((v: any, i: number) => (
                                    <div key={i} className="text-tertiary">
                                        {v.form} ({v.fp}): {valueFormatter(v.value)}
                                        <br />
                                        <span className="text-xs">
                                            Filed: {dateFormatter(v.filed)}
                                            {v.currency && v.currency !== 'USD' && (
                                                <span className="ml-2">Currency: {v.currency}</span>
                                            )}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{getMetricTypeDisplayName(metricType)} Over Time</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={processedData}
                            margin={{ left: 15, right: 10, top: 5, bottom: 15 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="fiscalLabel"
                                stroke="hsl(var(--foreground))"
                                interval="preserveStartEnd"
                                minTickGap={1}
                                tickMargin={10}
                                tick={(props) => {
                                    const { x, y, payload } = props;
                                    const label = payload.value; // e.g., "2023Q2" or "FY2023"

                                    if (label.startsWith('FY')) {
                                        // Split into two lines
                                        const year = label.slice(2, 6);

                                        return (
                                            <g key={label} transform={`translate(${x},${y})`}>
                                                <text
                                                    x={0}
                                                    y={0}
                                                    dy={8}
                                                    textAnchor="middle"
                                                    fill="currentColor"
                                                >
                                                    FY
                                                </text>
                                                <text
                                                    x={0}
                                                    y={0}
                                                    dy={25}
                                                    textAnchor="middle"
                                                    fill="currentColor"
                                                >
                                                    {year}
                                                </text>
                                            </g>
                                        );
                                    } else {
                                        // For quarters, split into two lines
                                        const year = label.slice(0, 4);
                                        const quarter = label.slice(4);
                                        return (
                                            <g key={label} transform={`translate(${x},${y})`}>
                                                <text
                                                    x={0}
                                                    y={0}
                                                    dy={8}
                                                    textAnchor="middle"
                                                    fill="currentColor"
                                                >
                                                    {year}
                                                </text>
                                                <text
                                                    x={0}
                                                    y={0}
                                                    dy={25}
                                                    textAnchor="middle"
                                                    fill="currentColor"
                                                >
                                                    {quarter}
                                                </text>
                                            </g>
                                        );
                                    }
                                }}
                                height={60}
                            />
                            <YAxis
                                tickFormatter={valueFormatter}
                                stroke="hsl(var(--foreground))"
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(var(--primary))"
                                dot={(props: any) => {
                                    const { cx, cy, payload } = props;
                                    return payload.hasIssues ? (
                                        <g key={payload.date}>
                                            <circle cx={cx} cy={cy} r={4} fill="hsl(var(--error))" />
                                            <circle cx={cx} cy={cy} r={8} fill="none" stroke="hsl(var(--error))" strokeWidth={1} />
                                        </g>
                                    ) : (
                                        <circle key={payload.date} cx={cx} cy={cy} r={4} fill="hsl(var(--primary))" />
                                    );
                                }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};

export default FinancialMetricsChart;