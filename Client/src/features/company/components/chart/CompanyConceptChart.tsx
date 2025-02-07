import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { GroupedConceptDataPoints } from '../../types';
import CompanyConceptChartTooltip from "./CompanyConceptChartTooltipChartTooltip.tsx";

interface CompanyConceptChartProps {
    data: GroupedConceptDataPoints[];
    valueFormatter: (value: number) => string;
    dateFormatter?: (date: Date) => string;
    handleDataPointSelected?: (processedDataPoint: GroupedConceptDataPoints) => void;
    periodType: 'annual' | 'quarterly';
}

function CompanyConceptChart({
                                 data,
                                 valueFormatter,
                                 dateFormatter = (date: Date) => date.toLocaleDateString(),
                                 handleDataPointSelected,
                                 periodType
                             }: CompanyConceptChartProps) {
    const onDataPointSelected = (index: number) => {
        handleDataPointSelected?.(data[index]);
    };

    const renderCustomAxisTick = (props: any) => {
        const { x, y, payload } = props;
        const label = payload.value;

        // For annual data, just show the year
        if (periodType === 'annual') {
            return (
                <g transform={`translate(${x},${y})`}>
                    <text x={0} y={0} dy={16} textAnchor="middle" fill="currentColor">
                        {label.slice(2, 6)}
                    </text>
                </g>
            );
        }

        // For quarterly data, split year and quarter
        const year = label.slice(0, 4);
        const quarter = label.slice(4);
        return (
            <g transform={`translate(${x},${y})`}>
                <text x={0} y={0} dy={8} textAnchor="middle" fill="currentColor">
                    {year}
                </text>
                <text x={0} y={0} dy={25} textAnchor="middle" fill="currentColor">
                    {quarter}
                </text>
            </g>
        );
    };

    return (
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
                    tick={renderCustomAxisTick}
                    height={60}
                />
                <YAxis
                    tickFormatter={valueFormatter}
                    stroke="hsl(var(--foreground))"
                />
                <Tooltip
                    content={
                        <CompanyConceptChartTooltip
                            valueFormatter={valueFormatter}
                            dateFormatter={dateFormatter}
                            periodType={periodType}
                        />
                    }
                />
                <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    activeDot={{
                        onClick: (event, payload: any) => onDataPointSelected(payload.index)
                    }}
                    dot={(props: any) => {
                        const { cx, cy, payload } = props;
                        return (
                            <g key={`${cx}-${cy}`}>
                                {payload.hasMultipleFilings ? (
                                    <g>
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={4}
                                            fill="hsl(var(--success))"
                                        />
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r={6}
                                            fill="none"
                                            stroke="hsl(var(--success))"
                                            strokeWidth={1}
                                            opacity={0.5}
                                        />
                                    </g>
                                ) : (
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r={4}
                                        fill="hsl(var(--primary))"
                                    />
                                )}
                            </g>
                        );
                    }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}

export default CompanyConceptChart;