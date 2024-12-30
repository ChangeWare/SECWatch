import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import {Card, CardContent} from "@common/components/Card.tsx";
import ChartTooltip from "@common/components/ChartTooltip.tsx";


interface DataPoint {
    date: string;
    value: number;
}

const AccountsPayableSection = () => {
    const [data, setData] = useState<DataPoint[]>([
        { date: '2023 Q1', value: 15200000 },
        { date: '2023 Q2', value: 16500000 },
        { date: '2023 Q3', value: 15800000 },
        { date: '2023 Q4', value: 17200000 },
        { date: '2024 Q1', value: 16900000 },
    ]);

    const calculateChange = () => {
        if (data.length < 2) return { value: 0, percentage: 0 };
        const currentValue = data[data.length - 1].value;
        const previousValue = data[data.length - 2].value;
        const change = currentValue - previousValue;
        const percentage = (change / previousValue) * 100;
        return { value: change, percentage };
    };

    const formatCurrency = (value: number) => {
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

    const change = calculateChange();

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                {/* Section Header */}
                <div>
                    <h2 className="text-lg font-bold text-foreground">Accounts Payable</h2>
                    <p className="text-sm text-secondary">Historical accounts payable data and trends</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-white/10">
                        <CardContent className="pt-6">
                            <div className="text-sm text-primary-light">Current Amount</div>
                            <div className="text-2xl font-bold mt-2 text-white">
                                {data.length > 0 ? formatCurrency(data[data.length - 1].value) : 'N/A'}
                            </div>
                            <div className="flex items-center mt-2">
                                {change.percentage > 0 ? (
                                    <TrendingUp className="text-accent mr-1" size={16} />
                                ) : (
                                    <TrendingDown className="text-destructive mr-1" size={16} />
                                )}
                                <span className={`text-sm font-medium mr-2 ${
                                    change.percentage > 0 ? "text-primary-light" : "text-destructive"
                                }`}>
                  {change.percentage.toFixed(1)}%
                </span>
                                <span className="text-sm text-muted-foreground">
                  vs previous quarter
                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/10">
                        <CardContent className="pt-6">
                            <div className="text-sm text-primary-light">Quarter-over-Quarter Change</div>
                            <div className="text-2xl font-bold mt-2 text-foreground">
                                {formatCurrency(Math.abs(change.value))}
                            </div>
                            <div className="text-sm text-muted-foreground mt-2">
                                {change.value > 0 ? 'Increase' : 'Decrease'} from previous quarter
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chart */}
                <Card className="bg-card/10">
                    <CardContent className="pt-6">
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={data}
                                    margin={{ left: 15, right: 10, top: 5, bottom: 15 }}  // Smaller margins
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        className="stroke-border/30"
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{
                                            fill: 'hsl(var(--foreground))',
                                            dy: 10
                                        }}
                                        style={{ opacity: 0.7 }}
                                        tickLine={{ stroke: 'hsl(var(--border))' }}
                                        axisLine={{ stroke: 'hsl(var(--border))' }}
                                    />
                                    <YAxis
                                        tickFormatter={formatCurrency}
                                        tick={{
                                            fill: 'hsl(var(--foreground))',
                                            dx: -5,
                                        }}
                                        style={{ opacity: 0.7 }}
                                        tickLine={{ stroke: 'hsl(var(--border))' }}
                                        axisLine={{ stroke: 'hsl(var(--border))' }}
                                    />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        className="stroke-info"
                                        strokeWidth={2}
                                        dot={{
                                            className: "fill-info stroke-info",
                                            strokeWidth: 2
                                        }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-sm text-muted-foreground">
                    Last updated: {data.length > 0 ? data[data.length - 1].date : 'N/A'}
                </div>
            </CardContent>
        </Card>
    );
};

export default AccountsPayableSection;