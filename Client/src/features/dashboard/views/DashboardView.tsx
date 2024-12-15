import { Pin, Bell, ChevronRight, X } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '../components/Card';
import AlertStream from "../components/AlertStream/AlertStream.tsx";
import {AlertItem} from "@features/dashboard/components/AlertStream/AlertFeed.tsx";

// Tracked Companies Section
const TrackedCompanies = () => {
    const companies = [
        { name: 'Apple Inc.', symbol: 'AAPL', recentFiling: '10-Q', filingDate: '2024-01-15' },
        { name: 'Microsoft', symbol: 'MSFT', recentFiling: '8-K', filingDate: '2024-01-10' }
    ];

    return (
        <Card className="bg-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-white">Tracked Companies</CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-gray-400 text-sm text-right">Latest Filing</p>
                    {companies.map(company => (
                        <div key={company.symbol}
                             className="flex items-center justify-between p-3 rounded-lg
                           border border-white/10 hover:border-accent/50
                           transition cursor-pointer">
                            <div>
                                <h3 className="text-white font-medium">{company.name}</h3>
                                <p className="text-gray-400 text-sm">{company.symbol}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-accent">{company.recentFiling}</p>
                                <p className="text-gray-400 text-sm">{company.filingDate}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Pinned Charts Section
const PinnedCharts = () => {
    const charts = [
        { id: 1, title: 'Revenue Growth YoY', company: 'AAPL' },
        { id: 2, title: 'Debt to Equity Ratio', company: 'MSFT' }
    ];

    return (
        <Card className="bg-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-white">Pinned Charts</CardTitle>
                <Pin className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {charts.map(chart => (
                    <div key={chart.id}
                         className="p-4 rounded-lg border border-white/10
                         hover:border-accent/50 transition">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-white font-medium">{chart.title}</h3>
                            <X className="h-4 w-4 text-gray-400 hover:text-accent cursor-pointer" />
                        </div>
                        <p className="text-gray-400 text-sm mb-4">{chart.company}</p>
                        {/* Placeholder for actual chart */}
                        <div className="h-32 bg-white/5 rounded-lg"></div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};

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
};

export default DashboardView;