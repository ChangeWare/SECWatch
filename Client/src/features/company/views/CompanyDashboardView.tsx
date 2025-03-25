import {Link, useParams} from "react-router-dom";
import useCompany from "@features/company/hooks/useCompany.tsx";
import TrackCompanyButton from "@features/company/components/TrackCompanyButton.tsx";
import useCompanyTracking from "@features/company/hooks/useCompanyTracking.ts";
import useCompanyDashboard from "@features/company/hooks/useCompanyDashboard.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";
import PinnedCompanyConceptSection from "@features/company/components/PinnedCompanyConceptSection.tsx";
import useCompanyConcepts from "@features/company/hooks/useCompanyConcepts.ts";
import {CompanyConcept} from "@features/company/types.ts";
import {Card} from "@common/components/Card.tsx";
import companyPaths from "@features/company/paths.ts";
import HyperLink from "@common/components/HyperLink.tsx";

export function CompanyDashboardView() {
    const { companyId } = useParams();

    const {
        company,
        companyDetailsLoading,
    } = useCompany(companyId);

    const {
        trackCompany,
        untrackCompany
    } = useCompanyTracking();

    const {
        dashboardPreferences,
        dashboardPreferencesIsLoading,
        removeConceptFromDashboard
    } = useCompanyDashboard(companyId);

    const { concepts, conceptDataLoading } = useCompanyConcepts(companyId, dashboardPreferences?.pinnedConcepts);

    const handleToggleTrackCompany = () => {
        if (!company) return;

        if (company.isTracked) {
            untrackCompany(company.cik);
        } else {
            trackCompany(company.cik);
        }
    }

    const handleUnpinConcept = (concept: CompanyConcept) => {
        removeConceptFromDashboard(concept.conceptType);
    }

    return (
        <div className="space-y-8 mt-4">
            <div className="space-y-8 items-center justify-between">
                <div className="company-dashboard-header mb-4">
                    <div className="flex justify-between space-x-6">
                        <h2 className="text-xl font-semibold text-foreground">Dashboard</h2>
                        <TrackCompanyButton loading={companyDetailsLoading} companyTracked={company?.isTracked}
                                            onClick={handleToggleTrackCompany}></TrackCompanyButton>
                    </div>
                </div>

                <LoadingIndicator
                    isLoading={companyDetailsLoading || dashboardPreferencesIsLoading || conceptDataLoading}
                >
                    {dashboardPreferences?.pinnedConcepts?.map((conceptType: string) => {
                        const dashConcept = concepts.find((c) =>
                        c.conceptType === conceptType);

                            if (dashConcept) {
                                return (
                                    <PinnedCompanyConceptSection
                                        key={dashConcept.conceptType}
                                        companyConcept={dashConcept}
                                        onUnpin={handleUnpinConcept}
                                    />
                                );
                            } else {
                                return null;
                            }
                        }
                    )}
                    {dashboardPreferences?.pinnedConcepts?.length === 0 ? (
                        <Card>
                            <div className="flex flex-col space-y-6 justify-center items-center h-64">
                                <p className="text-foreground">No concepts pinned to dashboard</p>
                                <p className="text-foreground">Explore the <Link className="text-info" to={`../${companyPaths.dashboard.concepts}`}>concepts</Link> section to begin pinning information here.</p>
                            </div>
                        </Card>
                    ) : concepts.length === 0 && (
                        <Card>
                            <div className="flex flex-col space-y-6 justify-center items-center h-64">
                                <p className="text-foreground">No concepts available for this entity.</p>
                                <p className="text-foreground">This is not uncommon for entities such as funds. Feel free to instead
                                explore the entities <HyperLink to="../filings">filings</HyperLink></p>
                            </div>
                        </Card>
                    )}

                </LoadingIndicator>

            </div>

        </div>
    )
}