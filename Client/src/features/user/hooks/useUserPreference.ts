import {RecentFilingsWidgetPreference, UserPreference} from "@features/user/types.ts";
import {useMutation, useQuery} from "@tanstack/react-query";
import {userApi} from "@features/user/api/userApi.ts";
import {useMemo} from "react";
import {UserPreferenceResponse, UserPreferenceUpdateRequest} from "@features/user/api/types.ts";
import queryClient from "@common/api/queryClient.ts";
import {toast} from "react-toastify";

const useUserPreference = <T extends UserPreference>(key: string) => {

    const { data, isLoading, error } = useQuery<UserPreferenceResponse>({
        queryKey: ['userPreference', key],
        queryFn: () => userApi.getUserPreference(key)
    });

    const updatePreferenceMutation = useMutation({
        mutationFn: (updatedPref: T) => userApi.updateUserPreference(key, { preference: updatedPref }),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['userPreference'] });
            toast.success('Preference updated');
        }
    });

    const preference = useMemo<T>(() => {
        return data?.preference as T;
    }, [data]);

    return {
        preference,
        updatePreference: updatePreferenceMutation.mutate,
        isLoading,
        error
    }
}

export default useUserPreference;