import {Card, CardContent, CardHeader, CardTitle} from "@common/components/Card.tsx";
import {ChevronRight} from "lucide-react";
import React from "react";

function TrackedCompanies(){
    const companies = [
        { name: 'Apple Inc.', symbol: 'AAPL', recentFiling: '10-Q', filingDate: '2024-01-15' },
        { name: 'Microsoft', symbol: 'MSFT', recentFiling: '8-K', filingDate: '2024-01-10' }
    ];

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-white">Tracked Companies</CardTitle>
                <ChevronRight className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <p className="text-gray-400 text-sm text-right">Latest Filing</p>
                    {companies.map(company => (
                        <Card interactive={true} variant="elevated" key={company.symbol}
                              className="justify-between p-2 hover:border-info/50">
                            <CardContent className="p-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-foreground font-medium">{company.name}</h3>
                                        <p className="text-secondary text-sm">{company.symbol}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-foreground">{company.recentFiling}</p>
                                        <p className="text-foreground/70 text-sm">{company.filingDate}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default TrackedCompanies;