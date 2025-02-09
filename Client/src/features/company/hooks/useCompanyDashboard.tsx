import { useMutation, useQuery } from "@tanstack/react-query";
import { CompanyUserDashboardPreferencesResponse } from "@features/company/api/types.ts";
import { companyApi } from "@features/company/api/companyApi.ts";
import queryClient from "@common/api/queryClient.ts";
import { toast } from "react-toastify";
import { useAuth } from "@features/auth";
import { useMemo, useState, useEffect } from "react";

// Constants for localStorage
const UNAUTH_PREFERENCES_KEY = 'unauth-dashboard-preferences';
const DEFAULT_PREFERENCES = {
    pinnedConcepts: ['ACCOUNTS_PAYABLE', 'NET_INCOME_LOSS']
};

// Helper functions for localStorage
const getUnauthPreferences = (companyId: string) => {
    try {
        const stored = localStorage.getItem(UNAUTH_PREFERENCES_KEY);
        if (!stored) return DEFAULT_PREFERENCES;

        const preferences = JSON.parse(stored);
        return preferences[companyId] || DEFAULT_PREFERENCES;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return DEFAULT_PREFERENCES;
    }
};

const setUnauthPreferences = (companyId: string, preferences: any) => {
    try {
        const stored = localStorage.getItem(UNAUTH_PREFERENCES_KEY);
        const allPreferences = stored ? JSON.parse(stored) : {};

        allPreferences[companyId] = preferences;
        localStorage.setItem(UNAUTH_PREFERENCES_KEY, JSON.stringify(allPreferences));
    } catch (e) {
        console.error('Error writing to localStorage:', e);
    }
};

const useCompanyDashboard = (companyId?: string) => {
    const { isAuthenticated } = useAuth();
    const [localPreferences, setLocalPreferences] = useState(() =>
        companyId ? getUnauthPreferences(companyId) : DEFAULT_PREFERENCES
    );

    // Authenticated user query
    const {
        data: companyUserDashboardPreferencesData,
        isLoading: companyUserDashboardPreferencesIsLoading,
        error: companyUserDashboardPreferencesError
    } = useQuery<CompanyUserDashboardPreferencesResponse>({
        queryKey: ['companyDashboardPreferences', companyId],
        queryFn: () => companyApi.getCompanyUserDashboardPreferences(companyId!),
        enabled: !!companyId && isAuthenticated,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // Mutations for authenticated users
    const addConceptToDashboardMutation = useMutation({
        mutationFn: (conceptType: string) => {
            if (!isAuthenticated) {
                // Handle unauthenticated users
                const updated = {
                    ...localPreferences,
                    pinnedConcepts: [...localPreferences.pinnedConcepts, conceptType]
                };
                setUnauthPreferences(companyId!, updated);
                setLocalPreferences(updated);
                return Promise.resolve(updated);
            }
            return companyApi.postAddConceptToDashboard(companyId!, conceptType);
        },
        onSuccess: async (resp) => {
            toast.success('Concept added to dashboard');
            if (isAuthenticated) {
                await queryClient.invalidateQueries({ queryKey: ['companyDashboardPreferences', companyId] });
            }
        }
    });

    const removeConceptFromDashboardMutation = useMutation({
        mutationFn: (conceptType: string) => {
            if (!isAuthenticated) {
                // Handle unauthenticated users
                const updated = {
                    ...localPreferences,
                    pinnedConcepts: localPreferences.pinnedConcepts.filter((c: string) => c !== conceptType)
                };
                setUnauthPreferences(companyId!, updated);
                setLocalPreferences(updated);
                return Promise.resolve(updated);
            }
            return companyApi.postRemoveConceptFromDashboard(companyId!, conceptType);
        },
        onSuccess: async (resp) => {
            toast.info('Concept removed from dashboard');
            if (isAuthenticated) {
                await queryClient.invalidateQueries({ queryKey: ['companyDashboardPreferences', companyId] });
            }
        }
    });

    // Update local preferences when companyId changes
    useEffect(() => {
        if (companyId && !isAuthenticated) {
            setLocalPreferences(getUnauthPreferences(companyId));
        }
    }, [companyId, isAuthenticated]);

    const dashboardPreferences = useMemo(() => {
        if (!companyUserDashboardPreferencesData) {
            if (!isAuthenticated && companyId) {
                return localPreferences;
            } else {
                return {};
            }
        }

        return companyUserDashboardPreferencesData.preferences;
    }, [companyUserDashboardPreferencesData, isAuthenticated, companyId, localPreferences]);

    return {
        dashboardPreferences,
        dashboardPreferencesIsLoading: companyUserDashboardPreferencesIsLoading,
        dashboardPreferencesError: companyUserDashboardPreferencesError,
        addConceptToDashboard: addConceptToDashboardMutation.mutate,
        removeConceptFromDashboard: removeConceptFromDashboardMutation.mutate
    };
};

export default useCompanyDashboard;