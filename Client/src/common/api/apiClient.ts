import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { paths } from "@routes/paths";
import {getAuthToken, logoutAndCleanup, refreshAuthToken} from "@features/auth";
import { toast } from "react-toastify";

// Initialize with undefined and set it later
let queryClient: QueryClient | undefined;

// Function to set queryClient after it's created
export const setQueryClient = (client: QueryClient) => {
  queryClient = client;
};

export const getBaseUrl = () => {
  let url;
  switch(process.env.NODE_ENV) {
      case 'production':
          url = 'https://secwatch-api.azurewebsites.net/api/';
          break;
      case 'development':
      default:
          url = 'http://localhost:5181/api/';
  }

  return url;
}

export const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
      'Content-Type': 'application/json',
      'Cross-Origin-Opener-Policy': 'cross-origin',
  },
});

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
// Store pending requests that are awaiting token refresh
let pendingRequests: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;}> = [];
  
// Process pending requests after token refresh
const processPendingRequests = (error?: any) => {
  pendingRequests.forEach(request => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(true);
    }
  });
  pendingRequests = [];
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers['X-Auth-Status'] = token ? 'authenticated' : 'unauthenticated';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use((response) => response,
  async (error) => {
    const originalRequest = error.config;

    const token = getAuthToken();

    if (!token || error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
    }

    // If we're already refreshing, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then(() => {
        return apiClient(originalRequest);
      }).catch((err) => {
        return Promise.reject(err);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await refreshAuthToken();
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        processPendingRequests();
        return apiClient(originalRequest);
      }

      handleAuthFailure();
      return Promise.reject(error);
    } catch (refreshError) {
      handleAuthFailure();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

const handleAuthFailure = () => {
    processPendingRequests(new Error('Authentication failed'));

    const token = getAuthToken();
    if (token) {
        logoutAndCleanup(queryClient!);
        window.location.href = paths.auth.login;
        toast.error('Your session has expired. Please log in again.');
    }
};
