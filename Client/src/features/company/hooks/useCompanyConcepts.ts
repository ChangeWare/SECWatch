import {useQuery} from "@tanstack/react-query";
import { CompanyConceptsResponse} from "@features/company/api/types.ts";
import {companyApi} from "@features/company/api/companyApi.ts";
import {useMemo} from "react";
import {CompanyConcept} from "@features/company/types.ts";


const useCompanyConcepts = (companyId?: string) => {

    const { data: conceptData, isLoading: conceptDataLoading, error: conceptDataError } = useQuery<CompanyConceptsResponse>({
        queryKey: ['concepts', companyId],
        queryFn: () => companyApi.getCompanyConcepts(companyId!),
        enabled: !!companyId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const concepts = useMemo<CompanyConcept[]>(() => {
        if (!conceptData) return [];

        const data: CompanyConcept[] = conceptData.concepts.map(concept => ({
            ...concept,
            dataPoints: concept.dataPoints.map(point => ({
                ...point,
                endDate: new Date(point.endDate),
                filingDate: new Date(point.filingDate),
            }))
        }));


        // Sort the data points in each concept by end date
        data.forEach(concept => {
            concept.dataPoints.sort((a, b) => {
                return b.endDate.getTime() - a.endDate.getTime();
            });
        });

        return data;
    }, [conceptData]);

    return {
        concepts,
        conceptDataLoading,
        conceptDataError,
    }
}

export default useCompanyConcepts;