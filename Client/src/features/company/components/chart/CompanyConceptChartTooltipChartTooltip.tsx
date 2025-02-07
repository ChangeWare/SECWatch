import { Card, CardContent } from '@common/components/Card';
import React from 'react';
import { GroupedConceptDataPoints } from '../../types';

interface CompanyConceptChartTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    valueFormatter: (value: number) => string;
    dateFormatter: (date: Date) => string;
    periodType: 'annual' | 'quarterly';
}

function CompanyConceptChartTooltip({
                                        active,
                                        payload,
                                        valueFormatter,
                                        dateFormatter,
                                        periodType
                                    }: CompanyConceptChartTooltipProps) {
    if (!active || !payload || !payload.length) return null;

    const data: GroupedConceptDataPoints = payload[0].payload;
    const { value, details, fiscalYear, fiscalPeriod } = data;

    return (
        <Card className="border-border bg-surface">
            <CardContent className="p-4 space-y-2">
                <div className="space-y-1">
                    <p className="text-sm font-medium">
                        {periodType === 'annual' ? `Fiscal Year ${fiscalYear}` : `${fiscalYear} ${fiscalPeriod}`}
                    </p>
                    <p className="text-lg font-semibold">
                        {valueFormatter(value)}
                    </p>
                    <p className="text-xs text-secondary">
                        Reported: {dateFormatter(data.date)}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default CompanyConceptChartTooltip;