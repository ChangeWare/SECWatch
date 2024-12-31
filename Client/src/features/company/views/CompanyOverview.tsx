import AccountsPayableSection from "@features/company/components/AccountsPayableSection.tsx";
import {useParams} from "react-router-dom";
import useCompany from "@features/company/hooks/useCompany.tsx";

export function CompanyOverview() {
    const { companyId } = useParams();

    const { company, companyDetailsLoading, accountsPayableMetric, accountsPayableLoading } = useCompany(companyId);

    return (
        <div className="space-y-8">
            <AccountsPayableSection accountsPayableMetric={accountsPayableMetric} />
        </div>
    )
}