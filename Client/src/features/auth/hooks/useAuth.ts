import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/authApi.ts";
import { useState } from "react";
import {getAuthToken, isTokenExpired, logoutAndCleanup, setAuthToken} from "../utils";
import { toast } from "react-toastify";
import {AxiosError} from "axios";
import {ApiErrorResponse} from "@common/api/types.ts";

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

    const isAuthenticated = isValidSession();

    const registerMutation = useMutation({
        mutationFn: authApi.register,
        onSuccess: (resp) => {
            toast.success('Registration successful.');
        },
        onError: (error: AxiosError<ApiErrorResponse>) => {
            // If we have a validation error response
            if (error.response?.data?.errors) {
                // Get all error messages and flatten them
                const messages = Object.values(error.response.data.errors).flat();
                toast.error(`Registration failed: ${messages.join(', ')}`);
                return;
            }

            // Fallback for unexpected errors
            toast.error('Registration failed. Please try again.');
        }
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: (resp) => {
            // Update auth state
            setAuthToken(resp.authenticationInfo.token, resp.authenticationInfo.tokenExpires);
            queryClient.setQueryData(['currentUser'], resp.authenticationInfo.user);
            toast.success(`Welcome back ${resp.authenticationInfo.user?.firstName}`);
        },
        onError: (error: Error) => {
          toast.error(`Bad login response: ${error.message}`);
        }
    });

    const logout = () => {
        logoutAndCleanup(queryClient);
        toast.info('You have been logged out.');
    }
  
    return { 
        login: loginMutation.mutate,
        loginSuccess: loginMutation.isSuccess,
        isLoggingIn: loginMutation.isPending,
        loginError: loginMutation.error,
        register: registerMutation.mutate,
        registerSuccess: registerMutation.isSuccess,
        isRegistering: registerMutation.isPending,
        registerError: registerMutation.error,
        isAuthenticated,
        logout
    };
}

export default useAuth;