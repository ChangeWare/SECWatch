import {apiClient} from "@common/api/apiClient.ts";
import {UserPreferenceResponse, UserPreferenceUpdateRequest} from "@features/user/api/types.ts";
import {User, UserPreference} from "@features/user/types.ts";

export const userApi = {
    getUserPreference: async (key: string): Promise<UserPreferenceResponse> => {
        const response = await apiClient.get<UserPreferenceResponse>(`/users/preferences/${key}`);
        return response.data;
    },

    updateUserPreference: async (key: string, req: UserPreferenceUpdateRequest) => {
        const response = await apiClient.post(`/users/preferences/${key}/update`, req);
        return response.data;
    },

    /**
     * Get the current authenticated user
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me');
        return response.data;
    },
}