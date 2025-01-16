import { UserPreference } from "@features/user/types.ts";

export interface UserPreferenceResponse {
    preference: UserPreference;
}

export interface UserPreferenceUpdateRequest {
    preference: UserPreference;
}
