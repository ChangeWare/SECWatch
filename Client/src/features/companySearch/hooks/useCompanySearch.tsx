import {useQuery, useQueryClient} from "@tanstack/react-query";
import { useState } from "react";
import { companySearchApi } from "../api/companySearchApi"

export const useCompanySearch = ()=> {
    const [query, setQuery] = useState("");

    const queryClient = useQueryClient();

    const {data: response, isLoading, error, refetch } = useQuery({
        queryKey: ["searchResults", query],
        queryFn: () => companySearchApi.fetchResults(query),
        enabled: !!query
    });

    const reset = () => {
        setQuery("");
        queryClient.removeQueries({ queryKey: ["searchResults", query] });
    }

    return {
        query,
        setQuery,
        response: response || { companies: [] },
        isLoading,
        error,
        reset,
        refetch
    }
}