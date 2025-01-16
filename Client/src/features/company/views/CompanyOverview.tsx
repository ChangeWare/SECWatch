import AccountsPayableSection from "@features/company/components/AccountsPayableSection.tsx";
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
        accountsPayableMetric,
        accountsPayableLoading,
    } = useCompany(companyId);

    const {
        trackCompany,
        untrackCompany
    } = useCompanyTracking();

    const availableCurrencyTypes = useMemo(() => {
        if (!accountsPayableMetric) return ['USD'];

        return accountsPayableMetric.currencyTypes;
    }, [accountsPayableMetric]);

    const [selectedCurrencyType, setSelectedCurrencyType] = useState<string>('USD');

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
                    <CurrencySelector
                        availableCurrencies={availableCurrencyTypes}
                        selectedCurrency={selectedCurrencyType}
                        onCurrencyChange={setSelectedCurrencyType}
                    />

                    <TrackCompanyButton loading={companyDetailsLoading} companyTracked={company?.isTracked} onClick={handleToggleTrackCompany}></TrackCompanyButton>
                </div>


            </div>

            <AccountsPayableSection selectedCurrencyType={selectedCurrencyType}
                                    accountsPayableMetric={accountsPayableMetric}/>
        </div>
    )
}