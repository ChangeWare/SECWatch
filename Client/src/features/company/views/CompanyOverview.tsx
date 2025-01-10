import AccountsPayableSection from "@features/company/components/AccountsPayableSection.tsx";
import {useParams} from "react-router-dom";
import useCompany from "@features/company/hooks/useCompany.tsx";
import {useMemo, useState} from "react";
import CurrencyTypeSelector from "@features/company/components/financials/CurrencyTypeSelector.tsx";

export function CompanyOverview() {
    const { companyId } = useParams();

    const { company, companyDetailsLoading, accountsPayableMetric, accountsPayableLoading } = useCompany(companyId);

    const availableCurrencyTypes = useMemo(() => {
        if (!accountsPayableMetric) return ['USD'];

        return accountsPayableMetric.currencyTypes;
    }, [accountsPayableMetric]);

    const [selectedCurrencyType, setSelectedCurrencyType] = useState<string>('USD');

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Financial Metrics</h2>
                <CurrencyTypeSelector
                    availableCurrencies={availableCurrencyTypes}
                    selectedCurrency={selectedCurrencyType}
                    onCurrencyChange={setSelectedCurrencyType}
                />
            </div>

            <AccountsPayableSection selectedCurrencyType={selectedCurrencyType}
                                    accountsPayableMetric={accountsPayableMetric}/>
        </div>
    )
}