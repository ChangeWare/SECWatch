import {MetricType} from "@features/company/types.ts";

export function getMetricTypeDisplayName(metricType: number): string {
    const metricTypeName = MetricType[metricType];
    return metricTypeName ? metricTypeName.replace(/([a-z])([A-Z])/g, '$1 $2') : 'Unknown Metric Type';
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
            return 'text-metrics-growth';
        } else {
            return 'text-metrics-strong';
        }

    }  else {
        return 'text-metrics-decline';
    }
}