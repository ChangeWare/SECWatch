import {useQuery} from "@tanstack/react-query";
import {companyApi} from "@features/company/api/companyApi.ts";
import {TrackedCompaniesResponse} from "@features/company/types.ts";
import {useMemo} from "react";

export const useTrackedCompanies = () => {

    const { data, error, isLoading } = useQuery<TrackedCompaniesResponse>({
        queryKey: ['trackedCompanies'],
        queryFn: () => companyApi.getTrackedCompanies(),
        staleTime: 1000 * 60 * 5,
    });

    const trackedCompanies = useMemo(() => {
        if (!data) return undefined;

        return {
            trackedCompanies: data.trackedCompanies.map(tc => ({
                ...tc,
                lastEvent: new Date(tc.lastEvent),
                dateAdded: new Date(tc.dateAdded),
                company: {
                    ...tc.company,
                    lastUpdated: new Date(tc.company.lastUpdated),
                },
                mostRecentFiling: {
                    ...tc.mostRecentFiling,
                    filingDate: new Date(),
                }
            }))
        };
    }, [data]);

    return {
        trackedCompanies: trackedCompanies?.trackedCompanies,
        trackedCompaniesLoading: isLoading,
        trackedCompaniesError: error
    }
}

export default useTrackedCompanies;