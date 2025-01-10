import React, {useCallback, useState} from 'react';
import { useNavigate } from "react-router-dom";
import CompanySearchBar from "@features/companySearch";
import { CompanyResult, SearchResponse } from "@features/companySearch/types.ts";
import { Card, CardContent } from "@common/components/Card.tsx";
import { Building2, TrendingUp, BookOpen } from "lucide-react";
import CompanySearchResults from "@features/companySearch/components/CompanySearchResults.tsx";

export default function CompanySearchView() {
    const navigate = useNavigate();
    const [searchResults, setSearchResults] = useState<CompanyResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const onQueryComplete = useCallback((response: SearchResponse) => {
        setSearchResults(response.companies);
        setIsSearching(false);
    }, []);

    const onResultSelected = (company: CompanyResult) => {
        navigate(`/companies/${company.cik}`);
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl font-bold text-foreground">
                        Company Search
                    </h1>
                    <p className="text-secondary text-lg max-w-2xl mx-auto">
                        Search through public company filings, financial data, and insights
                    </p>
                </div>

                {/* Search Section */}
                <Card variant="elevated" className="mb-8">
                    <CardContent className="p-6">
                        <CompanySearchBar
                            onQueryComplete={onQueryComplete}
                            onResultSelect={onResultSelected}
                            onSearchStart={() => setIsSearching(true)}
                        />
                    </CardContent>
                </Card>

                {/* Features Section */}
                {!searchResults.length && !isSearching && (
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card variant="subtle" className="text-center p-6">
                            <Building2 className="mx-auto h-12 w-12 text-info mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Company Profiles</h3>
                            <p className="text-secondary text-sm">
                                Access detailed company information and filing history
                            </p>
                        </Card>
                        <Card variant="subtle" className="text-center p-6">
                            <TrendingUp className="mx-auto h-12 w-12 text-success mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Financial Metrics</h3>
                            <p className="text-secondary text-sm">
                                Track key performance indicators and financial trends
                            </p>
                        </Card>
                        <Card variant="subtle" className="text-center p-6">
                            <BookOpen className="mx-auto h-12 w-12 text-metrics-strong mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Filing Analysis</h3>
                            <p className="text-secondary text-sm">
                                Deep dive into SEC filings and regulatory documents
                            </p>
                        </Card>
                    </div>
                )}

                <CompanySearchResults searchResults={searchResults} onResultSelected={onResultSelected} />

                {/* Loading State */}
                {isSearching && !searchResults.length && (
                    <Card variant="subtle" className="p-12">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="animate-spin h-6 w-6 border-3 border-info border-t-transparent rounded-full"/>
                            <div className="text-secondary">Searching companies...</div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}