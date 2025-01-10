import { useQuery} from '@tanstack/react-query';
import React, {useMemo} from "react";
import {filingsApi} from "@features/filings/api/filingsApi.ts";

interface UseSecFilingOptions {
    companyId?: string;
    accessionNumber?: string;
}

const useSecFiling = (opts: UseSecFilingOptions) => {

    const filingFromFilingHistoryQuery = useQuery({
        queryKey: ['companyFilingsHistory', opts.companyId],
        queryFn: () => filingsApi.getCompanyFilingsHistory(opts.companyId!),
        enabled: !!opts.companyId,
        select: (data) => {
            const filing = data?.filingHistory.filings.find(
                filing => filing.accessionNumber === opts.accessionNumber
            );
            return filing ? {
                ...filing,
                filingDate: new Date(filing.filingDate)
            } : undefined;
        }
    });

    const filing = useMemo(() =>
        filingFromFilingHistoryQuery.data, [filingFromFilingHistoryQuery.data]);

    const secUrl = React.useMemo(() => {
        if (!opts.companyId || !opts.accessionNumber || !filing?.primaryDocument) return '';
        return getSecFilingPath(opts.companyId, opts.accessionNumber, filing.primaryDocument);
    }, [filing]);

    const proxiedSecContentQuery = useQuery<string>({
        queryKey: ['sec-filings', secUrl],
        queryFn: () => filingsApi.getCompanyFilingFromSec(secUrl),
        enabled: secUrl !== '',
        staleTime: 1000 * 60 * 60, // 1 hour
    });

    return {
        filingContents: proxiedSecContentQuery.data,
        filingContentsIsLoading: proxiedSecContentQuery.isLoading,
        filingContentsError: proxiedSecContentQuery.error,

        filing: filingFromFilingHistoryQuery.data,
        filingIsLoading: filingFromFilingHistoryQuery.isLoading,
        filingError: filingFromFilingHistoryQuery.error,
    }
}

// Helper to construct SEC filings paths
export function getSecFilingPath(cik: string, accessionNumber: string, filename: string) {
    // Remove dashes from accession number as per SEC format
    const cleanAccessionNumber = accessionNumber.replace(/-/g, '');
    return `edgar/data/${cik}/${cleanAccessionNumber}/${filename}`;
}

export default useSecFiling;