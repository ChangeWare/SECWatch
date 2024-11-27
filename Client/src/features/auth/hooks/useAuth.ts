import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi.ts";
import { useState } from "react";
import { getAuthToken, isTokenExpired, setAuthToken } from "../utils";
import { toast } from "react-toastify";

/**
 * Custom hook for handling authentication logic.
 *
 * @returns {Object} An object containing authentication methods and state.
 * @returns {Function} login - Function to trigger the login mutation.
 * @returns {boolean} isLoggingIn - Boolean indicating if the login mutation is in progress.
 * @returns {Error | null} loginError - Error object if the login mutation failed, otherwise null.
 * @returns {boolean} isAuthenticated - Boolean indicating if the user is authenticated.
 *
 * @example
 * const { login, isLoggingIn, loginError, logout, isAuthenticated } = useAuth();
 *
 * // To login
 * login({ username: 'example', password: 'password' });
 *
 * // To logout
 * logout();
 */
export const useAuth = () => {
    const queryClient = useQueryClient();

    const isValidSession = () => !(!getAuthToken() || isTokenExpired(getAuthToken()));

    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isValidSession());

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (resp) => {
            // Update auth state
            setAuthToken(resp.token, resp.tokenExpires);
            setIsAuthenticated(true);
            queryClient.setQueryData(['currentUser'], resp.user);
            toast.success(`Welcome ${resp.user?.email}`);
        },
        onError: (error: Error) => {
          toast.error(`Bad registration response: ${error.message}`);
        }
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (resp) => {
            // Update auth state
            setAuthToken(resp.token, resp.tokenExpires);
            setIsAuthenticated(true);
            queryClient.setQueryData(['currentUser'], resp.user);
            toast.success(`Welcome back ${resp.user?.email}`);
        },
        onError: (error: Error) => {
          toast.error(`Bad login response: ${error.message}`);
        }
    });
  
    return { 
        login: loginMutation.mutate,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        register: registerMutation.mutate,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,
        isAuthenticated 
    };
  }