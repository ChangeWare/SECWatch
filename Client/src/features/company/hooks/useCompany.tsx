import { useQuery} from "@tanstack/react-query";
import {companyApi} from "@features/company/api/companyApi.ts";
import {CompanyDetailsResponse} from "@features/company/api/types.ts";

export const useCompany = (companyId?: string) => {

    const { data: companyData, isLoading: companyDetailsLoading, error: companyDetailsError } = useQuery<CompanyDetailsResponse>({
        queryKey: ['company', companyId],
        queryFn: () => companyApi.getCompanyDetails(companyId!),
        enabled: !!companyId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        company: companyData?.company,
        companyDetailsLoading,
        companyDetailsError,
    }
}

export default useCompany;