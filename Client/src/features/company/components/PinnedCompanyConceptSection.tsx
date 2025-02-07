import React, {useState, useMemo, useEffect} from 'react';
import {TrendingUp, TrendingDown, TableIcon, PinOff} from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from "@common/components/Card.tsx";
import { CompanyConcept, ConceptDataPoint, GroupedConceptDataPoints } from "@features/company/types.ts";
import LoadingScreen from "@common/components/LoadingIndicator.tsx";
import {
    formatConceptType,
    formatCurrency,
    getChangeOverPriorYear,
    getChangePercentClassName,
    getPercentChangeOverPriorYear,
    groupByCurrency,
    processData,
    separateAnnualAndQuarterlyData
} from "@features/company/utils.tsx";
import Button from "@common/components/Button.tsx";
import CurrencyTypeSelector from "@features/company/components/chart/CurrencyTypeSelector.tsx";
import CompanyConceptDataTableModal from '@features/company/components/chart/CompanyConceptDataTableModal.tsx';
import CompanyConceptViewer from "@features/company/components/CompanyConceptViewer.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";

interface CompanyConceptContentProps {
    companyConcept: CompanyConcept;
    data: {
        annual: GroupedConceptDataPoints[];
        quarterly: GroupedConceptDataPoints[];
    };
    onDataPointSelected?: (dataPoint: GroupedConceptDataPoints) => void;
}

function CompanyConceptContent(props: CompanyConceptContentProps) {
    const {
        companyConcept,
        data
    } = props;

    useEffect(() => {
        console.log('data', data);
    }, [data]);

    const currentPeriodYoYChange = useMemo(() => {
        if (companyConcept.dataPoints?.length <= 0) return { value: 0, percentage: 0 };

        const percentChange = getPercentChangeOverPriorYear(companyConcept.dataPoints);
        const valueChange = getChangeOverPriorYear(companyConcept.dataPoints);

        return { value: valueChange, percentage: percentChange };
    }, [companyConcept]);

    const handleDataPointSelected = (dataPoint: GroupedConceptDataPoints) => {
        props.onDataPointSelected?.(dataPoint);
    };

    const formatValue = companyConcept.isCurrencyData ? formatCurrency : (value: number) => value.toLocaleString();

    return (companyConcept.dataPoints?.length ?? 0) > 0 ? (
        <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="elevated">
                    <CardContent className="pt-6">
                        <div className="text-sm text-primary-light">Current Amount</div>
                        <div className="text-2xl font-bold mt-2 text-white">
                            {formatValue(props.companyConcept.lastValue)}
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
                            </span>
                            <span className="text-sm text-secondary">vs previous year</span>
                        </div>
                    </CardContent>
                </Card>

                <Card variant="elevated">
                    <CardContent className="pt-6">
                        <div className="text-sm text-primary-light">Year-over-Year Change</div>
                        <div className="text-2xl font-bold mt-2 text-foreground">
                            {formatValue(currentPeriodYoYChange.value)}
                        </div>
                        <div className="text-sm text-muted-foreground mt-2">
                            <a className={getChangePercentClassName(currentPeriodYoYChange.percentage)}>
                                {currentPeriodYoYChange.value > 0 ? 'Increase' : 'Decrease'}
                            </a> from previous year
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <LoadingIndicator isLoading={data == null || data.annual == null || data.quarterly == null}>
                {(data?.annual.length > 0 || data?.quarterly.length > 0) && (
                    <CompanyConceptViewer
                        annual={data.annual}
                        quarterly={data.quarterly}
                        valueFormatter={formatValue}
                        handleDataPointSelected={handleDataPointSelected}
                    />
                )}
            </LoadingIndicator>

            <div className="text-sm text-muted-foreground">
                Last updated: {props.companyConcept.lastUpdated?.toLocaleDateString() ?? 'N/A'}
            </div>
        </>
    ) : null;
}

interface DataGroupedByUnit {
    [unitType: string]: {
        annual: GroupedConceptDataPoints[];
        quarterly: GroupedConceptDataPoints[];
    };
}

interface PinnedCompanyConceptSectionProps {
    companyConcept?: CompanyConcept;
    className?: string;
    onUnpin: (concept: CompanyConcept) => void;
}

function PinnedCompanyConceptSection(props: PinnedCompanyConceptSectionProps) {
    const {
        companyConcept
    } = props;

    const [focusedDataPointDate, setFocusedDataPointDate] = useState<Date | undefined>();
    const [dataTableModalOpen, setDataTableModalOpen] = useState<boolean>(false);
    const [selectedCurrency, setSelectedCurrency] = useState<string>('ALL');

    const processedData = useMemo<DataGroupedByUnit>(() => {
        const emptyData = {
            annual: [],
            quarterly: []
        };

        if (!companyConcept || !companyConcept.dataPoints?.length) {
            return { ["ALL"]: emptyData };
        }

        // If underlying grouped data is currency data, group by currency
        // otherwise, we'll just lump everything into a single group
        if (companyConcept.isCurrencyData) {
            const groupedByCurrency = companyConcept.dataPoints.reduce((acc, curr) => {
                const unitType = curr.unitType || 'USD'; // Fallback to USD if unitType is missing
                if (!acc[unitType]) {
                    acc[unitType] = [];
                }
                acc[unitType].push(curr);
                return acc;
            }, {} as Record<string, ConceptDataPoint[]>);

            const result = Object.entries(groupedByCurrency).reduce((acc, [currency, points]) => {
                acc[currency] = separateAnnualAndQuarterlyData(points);
                return acc;
            }, {} as DataGroupedByUnit);

            return Object.keys(result).length > 0 ? result : { ["ALL"]: emptyData };
        } else {
            return {
                ["ALL"]: separateAnnualAndQuarterlyData(companyConcept.dataPoints)
            };
        }
    }, [companyConcept]);

    const availableCurrencies = useMemo(() => {
        return Object.keys(processedData);
    }, [processedData]);

    useEffect(() => {
        if (companyConcept?.isCurrencyData) {
            setSelectedCurrency(availableCurrencies[0]);
        }
    }, [companyConcept, availableCurrencies]);

    const handleDataPointSelected = (dataPoint: GroupedConceptDataPoints) => {
        setFocusedDataPointDate(dataPoint.date);
        setDataTableModalOpen(true);
    };

    const handleUnpinClick = () => {
        props.onUnpin(props.companyConcept!);
    };

    const formatValue = companyConcept?.isCurrencyData ? formatCurrency : (value: number) => value.toLocaleString();

    return (
        <Card className={props.className}>
            <LoadingScreen isLoading={props.companyConcept == null}>
                <>
                    <CardHeader>
                        <div className="flex flex-col">
                            <div className="flex justify-between">
                                <CardTitle>{formatConceptType(props.companyConcept!.conceptType)}</CardTitle>
                                <Button onClick={handleUnpinClick} variant="danger">
                                    <PinOff className="h-4 w-4"/>
                                </Button>
                            </div>
                            <div>
                                <p className="text-sm text-secondary mt-1">
                                    {props.companyConcept?.description}
                                </p>
                            </div>
                            <div className="flex mt-4 justify-between">
                                <Button
                                    variant="foreground"
                                    size="sm"
                                    onClick={() => setDataTableModalOpen(true)}
                                >
                                    <TableIcon className="h-4 w-4 mr-2"/>
                                    View Data
                                </Button>
                                {props.companyConcept?.isCurrencyData && (
                                    <CurrencyTypeSelector
                                        availableCurrencies={availableCurrencies}
                                        selectedCurrency={selectedCurrency}
                                        onCurrencyChange={(currency) => setSelectedCurrency(currency)}
                                    />
                                )}
                                <CompanyConceptDataTableModal
                                    concept={props.companyConcept!}
                                    formatValue={formatValue}
                                    initialFocusDate={focusedDataPointDate}
                                    isOpen={dataTableModalOpen}
                                    onClose={() => setDataTableModalOpen(false)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                        <CompanyConceptContent
                            data={processedData[selectedCurrency]}
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