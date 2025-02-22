import {useQuery} from "@tanstack/react-query";
import {filingsApi} from "@features/filings/api/filingsApi.ts";
import { CompanyFilingHistoryResponse} from "@features/filings/types.ts";

const useCompanyFilings = (companyId?: string) => {
    const { data: companyFilingsHistory, isLoading: filingHistoryLoading, error: filingHistoryError } = useQuery<CompanyFilingHistoryResponse>({
        queryKey: ['companyFilingsHistory', companyId],
        queryFn: () => filingsApi.getCompanyFilingsHistory(companyId!),
        select: (data) => {
            if (!data) return data;
            return {
                ...data,
                filingHistory: {
                    ...data.filingHistory,
                    lastUpdated: new Date(data.filingHistory.lastUpdated),
                    filings: data.filingHistory.filings.map((filing) => ({
                        ...filing,
                        filingDate: new Date(filing.filingDate),
                        reportDate: filing.reportDate ? new Date(filing.reportDate) : undefined,
                    })),
                }
            }
        },
        enabled: !!companyId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        filingHistory: companyFilingsHistory?.filingHistory,
        filingHistoryLoading,
        filingHistoryError,
    }
}

export default useCompanyFilings;