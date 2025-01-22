import {Card, CardContent, CardHeader, CardTitle} from "@common/components/Card.tsx";
import {GroupedConceptDataPoints} from "@features/company/types.ts";
import React from "react";
import {isValidCurrencyUnitType} from "@features/company/utils.tsx";

interface FinancialMetricsChartTooltipProps {
    valueFormatter: (value: number) => string;
    dateFormatter: (date: Date) => string;
    active?: boolean;
    payload?: any;
}

function CompanyConceptChartTooltip({ active, payload, dateFormatter, valueFormatter }: FinancialMetricsChartTooltipProps) {
    if (!active || !payload || !payload[0]) return null;

    const dataPoint = payload[0].payload as GroupedConceptDataPoints;

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
                        {valueFormatter(dataPoint.value)} {isValidCurrencyUnitType(dataPoint.unitType) ? `(${dataPoint.unitType})` : null}
                        {dataPoint.hasMultipleFilings && !dataPoint.hasDiscrepancy && (
                            <span className="text-xs text-secondary ml-2">
                                    (Reported consistently across {dataPoint.details.underlyingData.length} filings)
                                </span>
                        )}
                    </div>
                    <div className="text-tertiary mt-1">
                        Date: {dateFormatter(dataPoint.date)}
                    </div>
                    {dataPoint.hasDiscrepancy && (
                        <div className="mt-2 text-xs">
                            <div className="text-error">Inconsistent Values Reported</div>
                            {dataPoint.details.valueRange && (
                                <div className="mb-1 text-tertiary">
                                    Range: {valueFormatter(dataPoint.details.valueRange.min)} - {valueFormatter(dataPoint.details.valueRange.max)}
                                    <br/>
                                    Difference: {valueFormatter(dataPoint.details.valueRange.diff)}
                                </div>
                            )}
                            {dataPoint.details.underlyingData.map((filing, i) => (
                                <div key={i} className="mt-1 pb-1 border-b border-border last:border-0">
                                    <div
                                        className={filing.value === dataPoint.value ? "text-success" : "text-tertiary"}>
                                        {valueFormatter(filing.value)}
                                    </div>
                                    <div className="text-xs text-tertiary">
                                        {filing.formType} ({filing.fiscalPeriod}) -
                                        Filed: {dateFormatter(filing.filingDate)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default CompanyConceptChartTooltip;