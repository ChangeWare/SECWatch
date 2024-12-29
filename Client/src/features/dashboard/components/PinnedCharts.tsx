import React, {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@common/components/Card.tsx";
import {Pin, X} from "lucide-react";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis} from "recharts";

interface DataPoint
{
    date: string;
    value: number;
}

export function PinnedCharts() {
    const charts = [
        { id: 1, title: 'Revenue Growth YoY', company: 'AAPL' },
        { id: 2, title: 'Debt to Equity Ratio', company: 'MSFT' }
    ];

    const [data, setData] = useState<DataPoint[]>([
        { date: '2023 Q1', value: 15200000 },
        { date: '2023 Q2', value: 16500000 },
        { date: '2023 Q3', value: 15800000 },
        { date: '2023 Q4', value: 17200000 },
        { date: '2024 Q1', value: 16900000 },
    ]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-white">Pinned Charts</CardTitle>
                <Pin className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {charts.map(chart => (
                    <Card variant="elevated" key={chart.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-white font-medium">{chart.title}</h3>
                            <X className="h-4 w-4 text-gray-400 hover:text-accent cursor-pointer"/>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{chart.company}</p>
                        {/* Placeholder for actual chart */}

                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={data}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-border/50"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    tickLine={{ stroke: 'hsl(var(--border))' }}
                                    axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <YAxis
                                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                                    tickLine={{ stroke: 'hsl(var(--border))' }}
                                    axisLine={{ stroke: 'hsl(var(--border))' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    className="stroke-secondary"
                                    strokeWidth={2}
                                    dot={{
                                        className: "fill-secondary stroke-secondary",
                                        strokeWidth: 2
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}

export default PinnedCharts;