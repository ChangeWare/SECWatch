import { getBaseUrl } from "@common/api/apiClient";
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from 'js-cookie';

export const isTokenExpired = (token?: string, tokenExpires?: string): boolean => {
    const expires = new Date(tokenExpires!);
    return !token || expires < new Date();
}

export const logoutAndCleanup = (queryClient: QueryClient) => {
    Cookies.remove('authToken');
    queryClient.removeQueries({ queryKey: ['currentUser'] });
};

export const setAuthToken = (authToken: string, tokenExpires: string) => {
    Cookies.set('authToken', authToken, { expires: new Date(tokenExpires) });
}

export const getAuthToken = () => {
    return Cookies.get('authToken');
}

export const refreshAuthToken = async () => {
    try {
      // Call your refresh token endpoint
      // Don't use the intercepted client for refresh calls
      const response = await axios.post('/auth/refresh', {}, {
        baseURL: getBaseUrl()
      });
      
      if (response.data.token) {
        // Store new token
        localStorage.setItem('auth_token', response.data.token);
        return response.data.token;
      }
      return null;
    } catch (error) {
      return null;
    }
};