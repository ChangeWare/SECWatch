import { useQuery } from "@tanstack/react-query"
import {userApi} from "@features/user/api/userApi.ts";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => userApi.getCurrentUser(),
        staleTime: Infinity, // User data rarely needs auto-refresh
    });
}