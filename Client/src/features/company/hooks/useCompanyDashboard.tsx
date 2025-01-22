import {useMutation, useQuery} from "@tanstack/react-query";
import {CompanyUserDashboardPreferencesResponse} from "@features/company/api/types.ts";
import {companyApi} from "@features/company/api/companyApi.ts";
import queryClient from "@common/api/queryClient.ts";
import {toast} from "react-toastify";

const useCompanyDashboard = (companyId?: string) => {

    const { data: companyUserDashboardPreferencesData,
        isLoading: companyUserDashboardPreferencesIsLoading,
        error: companyUserDashboardPreferencesError
    } = useQuery<CompanyUserDashboardPreferencesResponse>({
        queryKey: ['companyDashboardPreferences', companyId],
        queryFn: () => companyApi.getCompanyUserDashboardPreferences(companyId!),
        enabled: !!companyId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    const addConceptToDashboardMutation = useMutation({
        mutationFn: (conceptType: string) => companyApi.postAddConceptToDashboard(companyId!, conceptType),
        onSuccess: async (resp) => {
            toast.success('Concept added to dashboard');
            await queryClient.invalidateQueries({ queryKey: ['companyDashboardPreferences', companyId] });
        }
    });

    const removeConceptFromDashboardMutation = useMutation({
        mutationFn: (conceptType: string) => companyApi.postRemoveConceptFromDashboard(companyId!, conceptType),
        onSuccess: async (resp) => {
            toast.info('Concept removed from dashboard');
            await queryClient.invalidateQueries({ queryKey: ['companyDashboardPreferences', companyId] });
        }
    });

    return {
        dashboardPreferences: companyUserDashboardPreferencesData?.preferences,
        dashboardPreferencesIsLoading: companyUserDashboardPreferencesIsLoading,
        dashboardPreferencesError: companyUserDashboardPreferencesError,

        addConceptToDashboard: addConceptToDashboardMutation.mutate,
        removeConceptFromDashboard: removeConceptFromDashboardMutation.mutate
    }
}

export default useCompanyDashboard;