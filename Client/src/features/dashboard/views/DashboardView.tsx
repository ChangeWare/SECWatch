import AlertStream from "../components/AlertStream/AlertStream.tsx";
import {AlertItem} from "@features/dashboard/components/AlertStream/AlertFeed.tsx";
import React from "react";
import PinnedCharts from "@features/dashboard/components/PinnedCharts.tsx";
import TrackedCompanies from "@features/dashboard/components/TrackedCompanies.tsx";

// Main Dashboard Component
function DashboardView() {
    const alerts: AlertItem[] = [
        {
            id: '1',
            type: 'filing',
            priority: 'high',
            title: 'New 10-K Filing Available',
            description: 'Apple Inc. has filed their annual report (10-K) with significant changes in revenue projections.',
            timestamp: '2024-03-14T10:30:00',
            company: {
                name: 'Apple Inc.',
                symbol: 'AAPL'
            }
        },
        {
            id: '2',
            type: 'threshold',
            priority: 'medium',
            title: 'Revenue Alert Threshold Exceeded',
            description: 'Microsoft quarterly revenue exceeded your alert threshold of $50B.',
            timestamp: '2024-03-14T09:15:00',
            company: {
                name: 'Microsoft',
                symbol: 'MSFT'
            }
        },
        {
            id: '3',
            type: 'watchlist',
            priority: 'low',
            title: 'New Company Added to Watchlist',
            description: 'Tesla, Inc. has been successfully added to your watchlist.',
            timestamp: '2024-03-13T15:45:00',
            company: {
                name: 'Tesla',
                symbol: 'TSLA'
            },
            read: true
        }
    ];

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <TrackedCompanies />
                        <PinnedCharts />
                    </div>

                    <div className="lg:col-span-1">
                        <AlertStream alerts={alerts} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardView;