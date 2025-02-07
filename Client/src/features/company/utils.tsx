import { ConceptDataPoint, GroupedConceptDataPoints } from "@features/company/types.ts";

export function getChangeOverPriorYear(data: ConceptDataPoint[]): number {
    const mostRecent = data[0];
    const priorYear = data.find(d => d.fiscalYear === mostRecent.fiscalYear - 1);

    if (!priorYear) return 0;

    return mostRecent.value - priorYear.value;
}

export function getPercentChangeOverPriorYear(data: ConceptDataPoint[]): number {
    const mostRecent = data[0];
    const priorYear = data.find(d => d.fiscalYear === mostRecent.fiscalYear - 1);

    if (!priorYear) return 0;

    return ((mostRecent.value - priorYear.value) / priorYear.value) * 100;
}



export function formatFiscalPeriod(point: ConceptDataPoint): string {
    if (!point.fiscalPeriod) return 'NA';

    return point.fiscalPeriod === 'FY'
        ? `FY${point.fiscalYear}`
        : `${point.fiscalYear}Q${point.fiscalPeriod.replace('Q', '')}`;
}

export function formatConceptType(conceptType: string): string {
    // Format TYPES_LIKE_THIS to Types Like This
    return conceptType
        .toLowerCase() // Convert the entire string to lowercase first
        .replace(/_/g, ' ') // Replace underscores with spaces
        .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize the first letter of each word
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
        maximumFractionDigits: 1,
    }).format(value);
}

export function isValidCurrencyUnitType(unitType: string): boolean {
    return ['USD', 'EUR', 'GBP', 'JPY', 'CNY'].includes(unitType);
}

export function sanitizeUnitType(unitType: string): string {
    if (unitType === 'USD/SHARES') return 'USD';

    return unitType;
}

export function groupByCurrency(data: GroupedConceptDataPoints[]): Record<string, GroupedConceptDataPoints[]> {
    return data.reduce((acc, curr) => {
        if (!acc[curr.unitType]) {
            acc[curr.unitType] = [];
        }
        acc[curr.unitType].push(curr);
        return acc;
    }, {} as Record<string, GroupedConceptDataPoints[]>);
}

export function downloadCSV (csvString: string, filename: string) {
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

export function convertConceptDataPointsToCSV (dataPoints: ConceptDataPoint[]): string {
    const headers = Object.keys(dataPoints[0]).join(',') + '\n';
    const rows = dataPoints.map(dataPoint =>
        Object.values(dataPoint).map(value =>
            typeof value === 'string' ? `"${value}"` : value
        ).join(',')
    ).join('\n');

    return headers + rows;
}


export function separateAnnualAndQuarterlyData(data: ConceptDataPoint[]) {
    const annualData: ConceptDataPoint[] = [];
    const quarterlyData: ConceptDataPoint[] = [];

    data.forEach(point => {
        if (point.fiscalPeriod === 'FY' && point.formType === '10-K') {
            annualData.push(point);
        } else if (point.fiscalPeriod !== 'FY') {
            quarterlyData.push(point);
        }
    });

    // Group annual data by fiscal year
    const annualByYear = annualData.reduce((acc, point) => {
        const yearKey = point.fiscalYear.toString();
        if (!acc[yearKey]) {
            acc[yearKey] = [];
        }
        acc[yearKey].push(point);
        return acc;
    }, {} as Record<string, ConceptDataPoint[]>);

    // For each year, get the most recently reported FY value
    const processedAnnualData = Object.entries(annualByYear).map(([year, yearPoints]) => {
        // Sort by filing date, most recent first
        const sorted = [...yearPoints].sort((a, b) =>
            b.filingDate.getTime() - a.filingDate.getTime()
        );

        const mostRecent = sorted[0];

        return {
            date: mostRecent.endDate,
            fiscalYear: mostRecent.fiscalYear,
            fiscalPeriod: 'FY',
            fiscalLabel: `FY${mostRecent.fiscalYear}`,
            value: mostRecent.value,
            hasMultipleFilings: yearPoints.length > 1,
            unitType: mostRecent.unitType,
            details: {
                underlyingData: yearPoints
            }
        };
    });

    // Process quarterly data by looking for period-specific frames
    const processedQuarterlyData = quarterlyData.reduce((acc, point) => {
        const periodKey = `${point.fiscalYear}-${point.fiscalPeriod}`;
        if (!acc[periodKey]) {
            acc[periodKey] = [];
        }
        acc[periodKey].push(point);
        return acc;
    }, {} as Record<string, ConceptDataPoint[]>);

    // Get the correct quarterly values (non-cumulative)
    const processedQuarterly = Object.entries(processedQuarterlyData)
        .map(([_, points]) => {
            // Sort by filing date, most recent first
            const sorted = [...points].sort((a, b) =>
                b.filingDate.getTime() - a.filingDate.getTime()
            );

            // Look for point with the matching frame for this quarter
            const mostRecent = sorted[0];
            const expectedFrame = `CY${mostRecent.fiscalYear}${mostRecent.fiscalPeriod}`;

            // First try to find a point with matching frame
            let quarterPoint = sorted.find(p => p.frame === expectedFrame);

            // If no matching frame, look for the smallest non-null value
            // (since larger values are likely cumulative)
            if (!quarterPoint) {
                const nonNullValues = sorted.filter(p => p.value !== null);
                quarterPoint = nonNullValues.reduce((min, curr) =>
                        curr.value < min.value ? curr : min
                    , nonNullValues[0]);
            }

            return {
                date: quarterPoint.endDate,
                fiscalYear: quarterPoint.fiscalYear,
                fiscalPeriod: quarterPoint.fiscalPeriod,
                fiscalLabel: `${quarterPoint.fiscalYear}${quarterPoint.fiscalPeriod}`,
                value: quarterPoint.value,
                hasMultipleFilings: points.length > 1,
                unitType: quarterPoint.unitType,
                details: {
                    underlyingData: points
                }
            };
        });

    return {
        annual: processedAnnualData.sort((a, b) => a.date.getTime() - b.date.getTime()),
        quarterly: processedQuarterly.sort((a, b) => a.date.getTime() - b.date.getTime())
    };
}