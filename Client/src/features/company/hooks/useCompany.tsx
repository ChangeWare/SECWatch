import { CompanyDetailsResponse} from "@features/company/types.ts";
import {useQuery} from "@tanstack/react-query";
import {companyApi} from "@features/company/api/companyApi.ts";

export const useCompany = (companyId?: string) => {

    const { data, isLoading, error } = useQuery<CompanyDetailsResponse>({
        queryKey: ['company', companyId],
        queryFn: () => companyApi.getCompanyDetails(companyId!),
        enabled: !!companyId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        company: data?.company,
        isLoading,
        error
    }
}

export default useCompany;