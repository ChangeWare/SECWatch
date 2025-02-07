import React, {useEffect, useState} from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@common/components/Card';
import { GroupedConceptDataPoints } from '../types';
import CompanyConceptChart from './chart/CompanyConceptChart';

interface CompanyConceptViewerProps {
    annual: GroupedConceptDataPoints[];
    quarterly: GroupedConceptDataPoints[];
    valueFormatter: (value: number) => string;
    dateFormatter?: (date: Date) => string;
    handleDataPointSelected?: (processedDataPoint: GroupedConceptDataPoints) => void;
}

function CompanyConceptViewer({
                                  annual,
                                  quarterly,
                                  valueFormatter,
                                  dateFormatter,
                                  handleDataPointSelected
                              }: CompanyConceptViewerProps) {
    const [viewMode, setViewMode] = useState<'annual' | 'quarterly'>('annual');

    useEffect(() => {
        console.log('data', annual);
    }, [annual]);


    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => setViewMode('annual')}
                    className={`px-4 py-2 rounded-lg transition ${
                        viewMode === 'annual'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface text-secondary hover:text-primary'
                    }`}
                >
                    Annual Data
                </button>
                <button
                    onClick={() => setViewMode('quarterly')}
                    className={`px-4 py-2 rounded-lg transition ${
                        viewMode === 'quarterly'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-surface text-secondary hover:text-primary'
                    }`}
                >
                    Quarterly Data
                </button>
            </div>

            <Card variant="subtle" className="w-full">
                <CardHeader>
                    <CardTitle>
                        {viewMode === 'annual' ? 'Annual' : 'Quarterly'} Time Series
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-96">
                        <CompanyConceptChart
                            data={viewMode === 'annual' ? annual : quarterly}
                            valueFormatter={valueFormatter}
                            dateFormatter={dateFormatter}
                            handleDataPointSelected={handleDataPointSelected}
                            periodType={viewMode}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex items-start space-x-2 text-sm text-secondary">
                <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-primary rounded-full" />
                    <span>Standard Data Point</span>
                </div>
                <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-success rounded-full" />
                    <span>Multiple Filings</span>
                </div>
            </div>
        </div>
    );
}

export default CompanyConceptViewer;