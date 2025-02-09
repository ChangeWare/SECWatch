import React, {useState, useEffect, useMemo} from 'react';
import { Card, CardContent } from "@common/components/Card.tsx";
import useTrackedCompanies from "@features/company/hooks/useTrackedCompanies.ts";
import {Link, useNavigate} from "react-router-dom";
import WidgetContainer from './WidgetContainer';
import useUserPreference from "@features/user/hooks/useUserPreference.ts";
import {RecentFilingsWidgetPreference, UserPreferenceKeys} from "@features/user/types.ts";
import UpdateRecentFilingsWidgetPreferencesModal from "./UpdateRecentFilingsWidgetPreferencesModal.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";
import {dashboardPaths} from "@features/dashboard";
import {useAuth} from "@features/auth";


function RecentFilingsWidget() {
    const { isAuthenticated } = useAuth();

    const navigate = useNavigate();
    const { trackedCompanies } = useTrackedCompanies();
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

    const previewContent = (
        <div className="space-y-4">
            <p className="text-gray-400 text-sm text-right">Date Filed</p>
            {[1, 2, 3].map((i) => (
                <Card variant="elevated" key={i} className="justify-between p-2">
                    <CardContent className="p-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-foreground font-medium">
                                    Example Company {i}
                                </h3>
                                <p className="text-secondary text-sm">
                                    TICK
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-foreground">
                                    Form 10-K
                                </p>
                                <p className="text-foreground/70 text-sm">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const { preference, updatePreference } = useUserPreference<RecentFilingsWidgetPreference>(UserPreferenceKeys.RecentFilingsWidget);

    const savePreferences = (newPref: RecentFilingsWidgetPreference) => {
        updatePreference(newPref);
        setIsPreferencesOpen(false);
    };

    const companiesWithMostRecentFiling = useMemo(() => {
        if (!trackedCompanies || !preference) return [];

        const companiesWithFiling = trackedCompanies.filter(tc => tc.mostRecentFiling);
        return companiesWithFiling
            .sort((a, b) =>
                b.mostRecentFiling.filingDate?.getTime() - a.mostRecentFiling.filingDate?.getTime())
            .slice(0, preference.numFilingsToShow);
    }, [trackedCompanies, preference]);

    return (
        <>
            <WidgetContainer
                title="Recent Filings"
                onConfigure={() => setIsPreferencesOpen(true)}
                widgetLoading={(!companiesWithMostRecentFiling || !preference)}
            >
                <LoadingIndicator isLoading={isAuthenticated &&  (!trackedCompanies || !preference)}>
                    <div className="space-y-4">
                        {!isAuthenticated && (
                            previewContent
                        )}

                        {companiesWithMostRecentFiling.length === 0 ? (
                            <p className="text-secondary">Start <Link className="text-info hover:opacity-80" to={dashboardPaths.company.tracked}>tracking</Link> companies to see recent filings.</p>
                        ) : (
                            <>
                                <p className="text-gray-400 text-sm text-right">Date Filed</p>
                                {companiesWithMostRecentFiling.map(tc => (
                                    <Card variant="elevated"
                                          key={tc.company.cik}
                                          onClick={() => navigate(`/companies/${tc.company.cik}`)}
                                          className="justify-between p-2 hover:border-info/50 cursor-pointer"
                                    >
                                        <CardContent className="p-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-foreground font-medium">
                                                        {tc.company.name}
                                                    </h3>
                                                    {preference.showTicker && (
                                                        <p className="text-secondary text-sm">
                                                            {tc.company.ticker}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    {preference.showFilingType && (
                                                        <p className="text-foreground">
                                                            Form {tc.mostRecentFiling.form}
                                                        </p>
                                                    )}
                                                    <p className="text-foreground/70 text-sm">
                                                        {tc.mostRecentFiling.filingDate?.toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </>
                        )}
                    </div>
                </LoadingIndicator>
            </WidgetContainer>

            <UpdateRecentFilingsWidgetPreferencesModal
                isOpen={isPreferencesOpen}
                currentPreference={preference}
                onCancel={() => setIsPreferencesOpen(false)}
                onSubmit={savePreferences}
            />
        </>
    );
}

export default RecentFilingsWidget;