import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@common/components/ui/dialog";
import { TableIcon, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { CompanyFinancialMetric, MetricDataPoint } from "@features/company/types";
import Button from "@common/components/Button.tsx";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@common/components/Table.tsx";
import {
    getInvertedChangePercentClassName,
    getMetricTypeDisplayName
} from "@features/company/utils.tsx";

interface FinancialMetricDataTableModalProps {
    metric: CompanyFinancialMetric;
    formatValue: (value: number) => string;
}

const FinancialMetricDataTableModal = (props: FinancialMetricDataTableModalProps) => {
    const { metric, formatValue } = props;
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    // Group data points by fiscal year and period to identify duplicates
    const groupedData = metric.dataPoints.reduce((acc, point) => {
        const key = `${point.fiscalYear}-${point.fiscalPeriod}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(point);
        return acc;
    }, {} as Record<string, MetricDataPoint[]>);

    const toggleRow = (key: string) => {
        const newExpanded = new Set(expandedRows);
        if (expandedRows.has(key)) {
            newExpanded.delete(key);
        } else {
            newExpanded.add(key);
        }
        setExpandedRows(newExpanded);
    };

    const findPreviousYearValue = (currentPoint: MetricDataPoint): number | undefined => {
        const previousKey = `${currentPoint.fiscalYear - 1}-${currentPoint.fiscalPeriod}`;
        const previousPeriodData = groupedData[previousKey];
        if (!previousPeriodData) return undefined;

        // Use the most recent filing from the previous period
        const mostRecentPrevious = [...previousPeriodData].sort((a, b) =>
            b.filingDate.getTime() - a.filingDate.getTime()
        )[0];

        return mostRecentPrevious?.value;
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    variant="foreground"
                    size="sm"
                    className="bg-white/5 hover:bg-white/10 border-white/10 hover:border-primary-light/50"
                >
                    <TableIcon className="h-4 w-4 mr-2" />
                    View Data Table
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[80vh] bg-background border border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-foreground">
                        Historical Data - {getMetricTypeDisplayName(metric.metricType)}
                    </DialogTitle>
                </DialogHeader>
                <div className="mt-4 h-[calc(80vh-6rem)] overflow-y-auto">
                    <Table className="relative">
                        <TableHeader>
                            <TableRow className="border-white/10">
                                <TableHead className="text-primary-light sticky top-0 bg-background">Fiscal Year</TableHead>
                                <TableHead className="text-primary-light sticky top-0 bg-background">Period</TableHead>
                                <TableHead className="text-primary-light sticky top-0 bg-background">End Date</TableHead>
                                <TableHead className="text-primary-light text-right sticky top-0 bg-background">Amount</TableHead>
                                <TableHead className="text-primary-light text-right sticky top-0 bg-background">YoY Change</TableHead>
                                <TableHead className="text-primary-light text-right sticky top-0 bg-background">YoY Change %</TableHead>
                                <TableHead className="text-primary-light sticky top-0 bg-background">Filing Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Sort and process entries before mapping */}
                            {Object.entries(groupedData)
                                .sort(([keyA], [keyB]) => {
                                    const [yearA, periodA] = keyA.split('-');
                                    const [yearB, periodB] = keyB.split('-');
                                    // First sort by year descending
                                    const yearDiff = parseInt(yearB) - parseInt(yearA);
                                    if (yearDiff !== 0) return yearDiff;
                                    // Then sort by period (Q1, Q2, Q3, FY)
                                    const periodOrder = { 'Q1': 1, 'Q2': 2, 'Q3': 3, 'FY': 4 };
                                    return (periodOrder[periodA as keyof typeof periodOrder] || 0) -
                                        (periodOrder[periodB as keyof typeof periodOrder] || 0);
                                })
                                .map(([key, points]) => {
                                    const sortedPoints = [...points].sort((a, b) =>
                                        b.filingDate.getTime() - a.filingDate.getTime()
                                    );
                                    const mostRecent = sortedPoints[0];
                                    const hasDuplicates = points.length > 1;
                                    const hasValueDiscrepancy = points.some(p => p.value !== points[0].value);
                                    const isExpanded = expandedRows.has(key);

                                    const previousValue = findPreviousYearValue(mostRecent);
                                    const change = previousValue ? mostRecent.value - previousValue : 0;
                                    const changePercent = previousValue ? (change / previousValue) * 100 : 0;

                                    return (
                                        <TableRow
                                            key={key}
                                            className={`border-white/10 hover:bg-white/5 ${(hasDuplicates || hasValueDiscrepancy) ? 'bg-error/5' : ''}`}
                                        >
                                            <TableCell className="font-medium">{mostRecent.fiscalYear}</TableCell>
                                            <TableCell>{mostRecent.fiscalPeriod}</TableCell>
                                            <TableCell>{mostRecent.endDate.toLocaleDateString()}</TableCell>
                                            <TableCell className="text-right">{formatValue(mostRecent.value)}</TableCell>
                                            <TableCell className={`text-right ${getInvertedChangePercentClassName(changePercent)}`}>
                                                {formatValue(change)}
                                            </TableCell>
                                            <TableCell className={`text-right ${getInvertedChangePercentClassName(changePercent)}`}>
                                                {changePercent.toFixed(2)}%
                                            </TableCell>
                                            <TableCell>
                                                {(hasDuplicates || hasValueDiscrepancy) ? (
                                                    <div
                                                        className="text-xs cursor-pointer"
                                                        onClick={() => toggleRow(key)}
                                                    >
                                                        <div className="flex items-center text-error mb-1">
                                                            {isExpanded ?
                                                                <ChevronDown className="h-3 w-3 mr-1" /> :
                                                                <ChevronRight className="h-3 w-3 mr-1" />
                                                            }
                                                            <AlertCircle className="h-3 w-3 mr-1" />
                                                            Multiple filings found
                                                        </div>
                                                        {isExpanded && sortedPoints.map((point, idx) => (
                                                            <div key={idx} className="ml-4 mb-1 text-tertiary">
                                                                {point.formType}: {formatValue(point.value)}
                                                                <br />
                                                                <span className="text-xs">
                                                                Filed: {point.filingDate.toLocaleDateString()}
                                                            </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-xs text-tertiary">
                                                        {mostRecent.formType}
                                                        <br />
                                                        Filed: {mostRecent.filingDate.toLocaleDateString()}
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FinancialMetricDataTableModal;