import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@common/components/Card.tsx';
import {GroupedConceptDataPoints} from '../../types.ts';
import {useEffect} from "react";
import CompanyConceptChartTooltip from "./CompanyConceptChartTooltipChartTooltip.tsx";

interface CompanyConceptChartProps {
    data: GroupedConceptDataPoints[];
    valueFormatter: (value: number) => string;
    dateFormatter?: (date: Date) => string;
    handleDataPointSelected?: (processedDataPoint: GroupedConceptDataPoints) => void;
}

function CompanyConceptChart(props: CompanyConceptChartProps) {
    const {
        data,
        valueFormatter,
        dateFormatter = (date: Date) => date.toLocaleDateString(),
        handleDataPointSelected,
    } = props;

    const onDataPointSelected = (index: number) => {
        handleDataPointSelected?.(data[index]);
    }

    return (
        <Card variant="subtle" className="w-full">
            <CardHeader>
                <CardTitle>Time Chart</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-96">
                    <ResponsiveContainer>
                        <LineChart
                            data={data}
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
                                    const label = payload.value;

                                    if (label.startsWith('FY')) {
                                        const year = label.slice(2, 6);
                                        return (
                                            <g key={label} transform={`translate(${x},${y})`}>
                                                <text x={0} y={0} dy={8} textAnchor="middle" fill="currentColor">FY</text>
                                                <text x={0} y={0} dy={25} textAnchor="middle" fill="currentColor">{year}</text>
                                            </g>
                                        );
                                    } else {
                                        const year = label.slice(0, 4);
                                        const quarter = label.slice(4);
                                        return (
                                            <g key={label} transform={`translate(${x},${y})`}>
                                                <text x={0} y={0} dy={8} textAnchor="middle" fill="currentColor">{year}</text>
                                                <text x={0} y={0} dy={25} textAnchor="middle" fill="currentColor">{quarter}</text>
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
                            <Tooltip content={<CompanyConceptChartTooltip valueFormatter={valueFormatter} dateFormatter={dateFormatter} />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(var(--primary))"
                                activeDot={{ onClick: (event, payload: any) => onDataPointSelected(payload.index) }}
                                dot={(props: any) => {
                                    const { cx, cy, payload } = props;
                                    return (
                                        <g key={`${cx}-${cy}`}>
                                            {payload.hasDiscrepancy ? (
                                                <g>
                                                    <circle cx={cx} cy={cy} r={4} fill="hsl(var(--error))"/>
                                                    <circle cx={cx} cy={cy} r={8} fill="none" stroke="hsl(var(--error))"
                                                            strokeWidth={1}/>
                                                </g>
                                            ) : payload.hasMultipleFilings ? (
                                                <g>
                                                    <circle cx={cx} cy={cy} r={4} fill="hsl(var(--success))"/>
                                                    <circle cx={cx} cy={cy} r={6} fill="none"
                                                            stroke="hsl(var(--success))" strokeWidth={1} opacity={0.5}/>
                                                </g>
                                            ) : (
                                                <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={4}
                                                        fill="hsl(var(--primary))"/>
                                            )}
                                        </g>
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

export default CompanyConceptChart;