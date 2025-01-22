import React, {useState, useEffect, useMemo} from 'react';
import {TrendingUp, TrendingDown, TableIcon} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from "@common/components/Card.tsx";
import {
    CompanyConcept,
    CurrencyGroupedData,
    ConceptDataPoint,
    MetricType,
    ProcessedFinancialDataPoint
} from "@features/company/types.ts";
import LoadingScreen from "@common/components/LoadingIndicator.tsx";
import MetricDataTableModal from "@features/company/components/financials/FinancialMetricDataTableModal.tsx";
import CompanyConceptChart from "@features/company/components/financials/CompanyConceptChart.tsx";
import {formatConceptType, formatCurrency, getChangePercentClassName, processData} from "@features/company/utils.tsx";
import Button from "@common/components/Button.tsx";

interface CompanyConceptContentProps {
    companyConcept: CompanyConcept;
    selectedCurrencyType: string;
    onDataPointSelected?: (dataPoint: ProcessedFinancialDataPoint) => void;
}

function CompanyConceptContent(props: CompanyConceptContentProps) {

    const { dataPoints: data } = props.companyConcept;

    const processedData = useMemo<CurrencyGroupedData>(() => {
        return processData(data)
    }, [data]);

    const currentPeriodYoYChange = useMemo(() => {

        const calculateChange = (data: ConceptDataPoint[]) => {
            if (data.length < 2) return { value: 0, percentage: 0 };

            const currentValue = data[data.length - 1].value;

            const previousValue = data.find((point) =>
                (point.fiscalYear === data[data.length - 1].fiscalYear - 1) &&
                (point.fiscalPeriod === data[data.length - 1].fiscalPeriod))?.value ?? 0;

            const change = currentValue - previousValue;
            const percentage = (change / previousValue) * 100;
            return { value: change, percentage };
        };

        if (data?.length <= 0) return { value: 0, percentage: 0 };

        return calculateChange(props.companyConcept.dataPoints);

    }, [props.companyConcept]);

    const handleDataPointSelected = (dataPoint: ProcessedFinancialDataPoint) => {
        props.onDataPointSelected?.(dataPoint);
    }

    return (data?.length ?? 0) > 0 ? (
        <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="elevated">
                    <CardContent className="pt-6">
                        <div className="text-sm text-primary-light">Current Amount</div>
                        <div className="text-2xl font-bold mt-2 text-white">
                            {formatCurrency(props.companyConcept.lastValue)}
                        </div>
                        <div className="flex items-center mt-2">
                            {currentPeriodYoYChange.percentage > 0 ? (
                                <TrendingUp className="text-accent mr-1" size={16} />
                            ) : (
                                <TrendingDown className="text-destructive mr-1" size={16} />
                            )}
                            <span className={`text-sm font-medium mr-1 ${
                                currentPeriodYoYChange.percentage > 0 ? "text-metrics-stable" : "text-metrics-decline"
                            }`}>
                  {currentPeriodYoYChange.percentage.toFixed(1)}%
                </span><span className="text-sm text-secondary">vs previous year</span>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="elevated">
                    <CardContent className="pt-6">
                        <div className="text-sm text-primary-light">Year-over-Year Change</div>
                        <div className="text-2xl font-bold mt-2 text-foreground">
                            {formatCurrency(Math.abs(currentPeriodYoYChange.value))}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            <a className={getChangePercentClassName(currentPeriodYoYChange.percentage)}>{currentPeriodYoYChange.value > 0 ? 'Increase' : 'Decrease'}</a> from previous year
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <CompanyConceptChart
                data={processedData[props.selectedCurrencyType]}
                metricType={MetricType.AccountsPayable}
                valueFormatter={formatCurrency}
                handleDataPointSelected={handleDataPointSelected}
            />

            <div className="text-sm text-muted-foreground">
                Last updated: {props.companyConcept.lastUpdated?.toLocaleDateString() ?? 'N/A'}
            </div>
        </>
    ) : null;
}

interface PinnedCompanyConceptSectionProps {
    companyConcept?: CompanyConcept;
    selectedCurrencyType: string;
}

function PinnedCompanyConceptSection(props: PinnedCompanyConceptSectionProps) {
    const [ focusedDataPointDate, setFocusedDataPointDate] = useState<Date | undefined>();

    const [dataTableModalOpen, setDataTableModalOpen] = useState<boolean>(false);

    const handleDataPointSelected = (dataPoint: ProcessedFinancialDataPoint) => {
        setFocusedDataPointDate(dataPoint.date);
        setDataTableModalOpen(true);
    }

    return (
        <Card>
            <LoadingScreen isLoading={props.companyConcept == null}>
                <>
                    <CardHeader>
                        <CardTitle>{formatConceptType(props.companyConcept!.conceptType)}</CardTitle>
                        <p className="text-sm text-secondary mt-1">
                            {props.companyConcept?.description}
                        </p>
                        <div>
                            <Button
                                variant="foreground"
                                size="sm"
                                onClick={() => setDataTableModalOpen(true)}
                            >
                                <TableIcon className="h-4 w-4 mr-2"/>
                                View Data
                            </Button>
                            <MetricDataTableModal
                                metric={props.companyConcept}
                                formatValue={formatCurrency}
                                initialFocusDate={focusedDataPointDate}
                                isOpen={dataTableModalOpen}
                                onClose={() => setDataTableModalOpen(false)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <CompanyConceptContent
                            selectedCurrencyType={props.selectedCurrencyType}
                            onDataPointSelected={handleDataPointSelected}
                            companyConcept={props.companyConcept!}
                        />
                    </CardContent>
                </>
            </LoadingScreen>
        </Card>
    );
}

export default PinnedCompanyConceptSection;