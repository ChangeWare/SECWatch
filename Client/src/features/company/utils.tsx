import {CurrencyGroupedData, MetricDataPoint, MetricType, ProcessedDataPoint} from "@features/company/types.ts";

export function getMetricTypeDisplayName(metricType: number): string {
    const metricTypeName = MetricType[metricType];
    return metricTypeName ? metricTypeName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'Unknown Metric Type';
}

export function formatFiscalPeriod(point: MetricDataPoint): string {
    if (!point.fiscalPeriod) return 'NA';

    return point.fiscalPeriod === 'FY'
        ? `FY${point.fiscalYear}`
        : `${point.fiscalYear}Q${point.fiscalPeriod.replace('Q', '')}`;
}

export function getInvertedChangePercentClassName(changePercent: number): string {
    if (changePercent === 0) return 'text-metrics-neutral';

    if (changePercent < 0) {
        if (changePercent > -10) {
            return 'text-metrics-stable';
        } else if (changePercent > -25) {
            return 'text-metrics-growth';
        } else {
            return 'text-metrics-strong';
        }
    }  else {
        return 'text-metrics-decline';
    }
}

export function getChangePercentClassName(changePercent: number): string {
    if (changePercent === 0) return 'text-metrics-neutral';

    if (changePercent > 0) {
        if (changePercent < 10) {
            return 'text-metrics-stable';
        } else if (changePercent < 25) {
            return 'text-metrics-stable';
        } else {
            return 'text-metrics-stable';
        }

    }  else {
        return 'text-metrics-decline';
    }
}

export function formatCurrency (value: number): string {
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
}

export const findTextNode = (root: Node, offset: number): Node | null => {
    let total = 0;
    const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let current = walk.nextNode();

    while (current) {
        const length = (current as Text).length;
        if (total + length > offset) {
            return current;
        }
        total += length;
        current = walk.nextNode();
    }
    return null;
};

export function processData(data: MetricDataPoint[]): CurrencyGroupedData {
    // First, group by currency type
    const groupedByCurrency = data.reduce((acc, curr) => {
        if (!acc[curr.currencyType]) {
            acc[curr.currencyType] = [];
        }
        acc[curr.currencyType].push(curr);
        return acc;
    }, {} as Record<string, MetricDataPoint[]>);

    // Process each currency group separately
    return Object.entries(groupedByCurrency).reduce((acc, [currency, currencyData]) => {
        // Group by end date + fiscal period within each currency group
        const groupedByDate = currencyData.reduce((acc, curr) => {
            const dateStr = curr.endDate.toISOString() + curr.fiscalPeriod;
            if (!acc[dateStr]) {
                acc[dateStr] = [];
            }
            acc[dateStr].push(curr);
            return acc;
        }, {} as Record<string, MetricDataPoint[]>);

        // Process each date group within the currency group
        const processedData = Object.entries(groupedByDate).map(([_, points]) => {
            // Sort by filings date to get most recent (descending)
            const sorted = [...points].sort((a, b) =>
                b.filingDate.getTime() - a.filingDate.getTime()
            );

            const uniqueValues = new Set(points.map(p => p.value));
            const hasDiscrepancy = uniqueValues.size > 1;
            const hasMultipleFilings = points.length > 1;
            const mostRecent = sorted[0];

            // Calculate value range if there are discrepancies
            const valueRange = hasDiscrepancy ? {
                min: Math.min(...points.map(p => p.value)),
                max: Math.max(...points.map(p => p.value)),
                diff: Math.max(...points.map(p => p.value)) - Math.min(...points.map(p => p.value))
            } : undefined;

            return {
                date: mostRecent.endDate,
                fiscalYear: mostRecent.fiscalYear,
                fiscalPeriod: mostRecent.fiscalPeriod,
                fiscalLabel: formatFiscalPeriod(mostRecent),
                currencyType: mostRecent.currencyType,
                value: mostRecent.value,
                hasDiscrepancy,
                hasMultipleFilings,
                details: {
                    underlyingData: points,
                    valueRange
                }
            };
        }).sort((a, b) => a.date.getTime() - b.date.getTime());

        acc[currency] = processedData;
        return acc;
    }, {} as CurrencyGroupedData);
}