import React, {useEffect, useMemo, useState} from "react";
import {Card} from "@common/components/Card.tsx";
import WidgetContainer from "@features/dashboard/components/widgets/WidgetContainer.tsx";
import useTrackedCompanies from "@features/company/hooks/useTrackedCompanies.ts";
import {CompanyConcept, TrackedCompanyDetails} from "@features/company/types.ts";
import useCompanyConcepts from "@features/company/hooks/useCompanyConcepts.ts";
import useCompanyDashboard from "@features/company/hooks/useCompanyDashboard.tsx";
import {cn} from "@common/lib/utils.ts";
import {formatConceptType, formatCurrency, getChangePercentClassName} from "@features/company/utils.tsx";
import ConceptPreview from "@features/company/components/ConceptPreview.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";
import {useAuth} from "@features/auth";

interface TrackedCompanyConceptCardProps {
    trackedCompany: TrackedCompanyDetails;
}
function TrackedCompanyConceptCard(props: TrackedCompanyConceptCardProps) {
    const { trackedCompany } = props;
    const { dashboardPreferences, dashboardPreferencesIsLoading } = useCompanyDashboard(trackedCompany.company.cik);

    const { isAuthenticated } = useAuth();

    const { concepts, conceptDataLoading } = useCompanyConcepts(trackedCompany.company.cik, dashboardPreferences?.pinnedConcepts);

    const isLoading = !concepts || dashboardPreferencesIsLoading || conceptDataLoading;

    const selectedConcept = useMemo<CompanyConcept | null>(() => {
        if (!concepts) return null;

        return concepts.sort((a, b) => {
            return b.lastUpdated.getTime() - a.lastUpdated.getTime();
        })[0];

    }, [concepts, dashboardPreferences]);

    return (
        <Card variant="elevated" key={trackedCompany.ticker} className="p-4">
            <LoadingIndicator isLoading={isAuthenticated && isLoading}>
                {selectedConcept && (
                    <>
                        <div className="flex flex-col">
                            <h3 className="text-white font-medium mb-1">{trackedCompany.company.name}</h3>
                            <a className="text-gray-400 text-sm">{trackedCompany.company.ticker}</a>
                        </div>

                        <ConceptPreview concept={selectedConcept} header={formatConceptType(selectedConcept!.conceptType)}/>
                    </>
                )}
            </LoadingIndicator>
        </Card>
    )
}


export function PinnedChartsWidget() {
    const {trackedCompanies, trackedCompaniesLoading } = useTrackedCompanies();

    const recentTrackedCompanies = useMemo(() => {
        if (!trackedCompanies) return [];

        // Select top 3 most recently updated companies
        return trackedCompanies.sort(
            (a, b) =>
                b.lastEvent.getTime() - a.lastEvent.getTime()
        ).slice(0, 3);
    }, [trackedCompanies]);

    const isLoading = !trackedCompanies || trackedCompaniesLoading;

    return (
        <WidgetContainer title="Tracked Company Pinned Metrics">
            <LoadingIndicator isLoading={isLoading}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentTrackedCompanies.map(tc => (
                        <TrackedCompanyConceptCard key={tc.company.ticker} trackedCompany={tc}/>
                    ))}
                </div>
            </LoadingIndicator>
        </WidgetContainer>
    );
}

export default PinnedChartsWidget;