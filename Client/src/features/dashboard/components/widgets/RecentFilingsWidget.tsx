import React, {useState, useEffect, useMemo} from 'react';
import { Card, CardContent } from "@common/components/Card.tsx";
import useTrackedCompanies from "@features/company/hooks/useTrackedCompanies.ts";
import { useNavigate } from "react-router-dom";
import WidgetContainer from './WidgetContainer';
import useUserPreference from "@features/user/hooks/useUserPreference.ts";
import {RecentFilingsWidgetPreference, UserPreferenceKeys} from "@features/user/types.ts";
import UpdateRecentFilingsWidgetPreferencesModal from "./UpdateRecentFilingsWidgetPreferencesModal.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";


function RecentFilingsWidget() {
    const navigate = useNavigate();
    const { trackedCompanies } = useTrackedCompanies();
    const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

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
                widgetLoading={!companiesWithMostRecentFiling || !preference}
            >
                <LoadingIndicator isLoading={!trackedCompanies || !preference}>
                    <div className="space-y-4">
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