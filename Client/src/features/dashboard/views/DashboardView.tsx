import React, { useState } from 'react';
import { Search, Pin, Bell, ChevronRight, X } from 'lucide-react';
import {Card, CardContent, CardHeader, CardTitle} from '../components/Card';

// Search Component
const CompanySearch = () => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <div className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search companies..."
                    className="w-full px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10
                     text-gray-300 placeholder-gray-400 focus:outline-none focus:border-accent"
                />
                <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
        </div>
    );
};

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

// Alert Stream Section
const AlertStream = () => {
    const alerts = [
        {
            id: 1,
            type: 'filing',
            company: 'AAPL',
            message: 'New 10-K filing available',
            timestamp: '10 min ago'
        },
        {
            id: 2,
            type: 'threshold',
            company: 'MSFT',
            message: 'Revenue exceeded alert threshold',
            timestamp: '1 hour ago'
        }
    ];

    return (
        <Card className="bg-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-white">Alerts</CardTitle>
                <Bell className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {alerts.map(alert => (
                        <></>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

// Main Dashboard Component
const DashboardView = () => {
    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <CompanySearch />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <TrackedCompanies />
                        <PinnedCharts />
                    </div>

                    <div className="lg:col-span-1">
                        <AlertStream />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardView;