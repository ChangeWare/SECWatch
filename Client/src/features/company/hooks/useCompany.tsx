import {CompanyDetailsResponse, CompanyFinancialMetricResponse, MetricDataPoint} from "@features/company/types.ts";
import {useQuery} from "@tanstack/react-query";
import {companyApi} from "@features/company/api/companyApi.ts";

export const useCompany = (companyId?: string) => {

    const { data: companyData, isLoading: companyDetailsLoading, error: companyDetailsError } = useQuery<CompanyDetailsResponse>({
        queryKey: ['company', companyId],
        queryFn: () => companyApi.getCompanyDetails(companyId!),
        enabled: !!companyId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const { data: accountsPayableData, isLoading: accountsPayableIsLoading, error: accountsPayableError } = useQuery<CompanyFinancialMetricResponse>({
        queryKey: ['companyAccountsPayable', companyId],
        queryFn: () => companyApi.getCompanyAccountsPayableByFY(companyId!),
        select: (data) => {
            if (!data) return data;
            return {
                metric: {
                    ...data.metric,
                    lastUpdated: new Date(data.metric.lastUpdated),
                    lastReported: new Date(data.metric.lastReported),
                    dataPoints: data.metric.dataPoints.map((dataPoint: MetricDataPoint) => ({
                        ...dataPoint,
                        endDate: new Date(dataPoint.endDate),
                        filingDate: new Date(dataPoint.filingDate),
                    })),
                },
            };
        },
        enabled: !!companyId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        company: companyData?.company,
        companyDetailsLoading,
        companyDetailsError,

        accountsPayableMetric: accountsPayableData?.metric,
        accountsPayableLoading: accountsPayableIsLoading
    }
}

export default useCompany;