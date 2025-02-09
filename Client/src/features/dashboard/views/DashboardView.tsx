import AlertStream from "../components/AlertStream/AlertStream.tsx";
import React, {useCallback, useState} from "react";
import PinnedChartsWidget from "@features/dashboard/components/widgets/PinnedChartsWidget.tsx";
import RecentFilingsWidget from "@features/dashboard/components/widgets/RecentFilingsWidget.tsx";
import {Card, CardContent} from "@common/components/Card.tsx";
import CompanySearchBar from "@features/companySearch";
import {useNavigate} from "react-router-dom";
import {CompanyResult, SearchResponse} from "@features/companySearch/types.ts";
import AuthenticatedContent from "@features/auth/components/AuthenticatedContent.tsx";

// Main Dashboard Component
function DashboardView() {
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
            <div className="max-w-7xl mx-auto space-y-6">
                <Card variant="elevated" className="mb-8">
                    <CardContent className="p-6">
                        <CompanySearchBar
                            onQueryComplete={onQueryComplete}
                            onResultSelect={onResultSelected}
                            onSearchStart={() => setIsSearching(true)}
                        />
                    </CardContent>
                </Card>
                <AuthenticatedContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-6">
                            <RecentFilingsWidget />
                            <PinnedChartsWidget />
                        </div>

                        <div className="lg:col-span-1">
                            <AlertStream />
                        </div>
                    </div>
                </AuthenticatedContent>

            </div>
        </div>
    );
}

export default DashboardView;