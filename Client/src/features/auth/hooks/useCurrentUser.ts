import { useQuery } from "@tanstack/react-query"
import { authApi } from "../api/authAPI";

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => authApi.getCurrentUser(),
        staleTime: Infinity, // User data rarely needs auto-refresh
    });
}