import AccountsPayableSection from "@features/company/components/PinnedCompanyConceptSection.tsx";
import {useParams} from "react-router-dom";
import useCompany from "@features/company/hooks/useCompany.tsx";
import {useMemo, useState} from "react";
import CurrencySelector from "@features/company/components/financials/CurrencyTypeSelector.tsx";
import TrackCompanyButton from "@features/company/components/TrackCompanyButton.tsx";
import useTrackedCompanies from "@features/company/hooks/useTrackedCompanies.ts";
import useCompanyTracking from "@features/company/hooks/useCompanyTracking.ts";

export function CompanyOverview() {
    const { companyId } = useParams();

    const {
        company,
        companyDetailsLoading,
    } = useCompany(companyId);

    const {
        trackCompany,
        untrackCompany
    } = useCompanyTracking();

    const handleToggleTrackCompany = () => {
        if (!company) return;

        if (company.isTracked) {
            untrackCompany(company.cik);
        } else {
            trackCompany(company.cik);
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Financial Metrics</h2>
                <div className="flex space-x-6">
                    <TrackCompanyButton loading={companyDetailsLoading} companyTracked={company?.isTracked} onClick={handleToggleTrackCompany}></TrackCompanyButton>
                </div>


            </div>

        </div>
    )
}