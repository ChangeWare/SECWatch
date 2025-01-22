import {useMutation} from "@tanstack/react-query";
import {companyApi} from "@features/company/api/companyApi.ts";
import queryClient from "@common/api/queryClient.ts";
import {toast} from "react-toastify";
import {CompanyDetailsResponse} from "@features/company/api/types.ts";

const useCompanyTracking = () => {
    const trackCompanyMutation = useMutation({
        mutationFn: (companyId: string) => companyApi.postTrackCompany(companyId!),
        onSuccess: async (resp) => {
            await queryClient.invalidateQueries({ queryKey: ['trackedCompanies'] });
            toast.success(`${resp.company?.name} has been added to your tracked companies.`);

            // Update the company details query to reflect the change in tracking status
            queryClient.setQueryData<CompanyDetailsResponse>(['company', resp.company.cik], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    company: {
                        ...oldData.company,
                        isTracked: true,
                    },
                };
            });
        }
    });

    const untrackCompanyMutation = useMutation({
        mutationFn: (companyId: string) => companyApi.postUntrackCompany(companyId!),
        onSuccess: async (resp) => {
            await queryClient.invalidateQueries({ queryKey: ['trackedCompanies'] });
            toast.success(`${resp.company?.name} has been removed from your tracked companies.`);

            // Update the company details query to reflect the change in tracking status
            queryClient.setQueryData<CompanyDetailsResponse>(['company', resp.company.cik], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    company: {
                        ...oldData.company,
                        isTracked: false,
                    },
                };
            });
        }
    });

    return {
        trackCompany: trackCompanyMutation.mutate,
        untrackCompany: untrackCompanyMutation.mutate,
    }
}

export default useCompanyTracking;