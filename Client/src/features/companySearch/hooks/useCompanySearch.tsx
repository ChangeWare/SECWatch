import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useMemo, useState} from "react";
import { companySearchApi } from "../api/companySearchApi"
import {SearchResponse} from "@features/companySearch/types.ts";

export const useCompanySearch = ()=> {
    const [query, setQuery] = useState("");

    const queryClient = useQueryClient();

    const {data, isLoading, error, refetch } = useQuery({
        queryKey: ["searchResults", query],
        queryFn: () => companySearchApi.fetchResults(query),
        enabled: !!query
    });

    const response = useMemo(() =>
        data ?? { companies: [] } as SearchResponse
    , [data]);

    const reset = () => {
        setQuery("");
        queryClient.removeQueries({ queryKey: ["searchResults", query] });
    }

    return {
        query,
        setQuery,
        response,
        isLoading,
        error,
        reset,
        refetch
    }
}