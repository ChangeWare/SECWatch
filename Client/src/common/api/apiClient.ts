import { QueryClient } from "@tanstack/react-query";
import axios from "axios";
import { paths } from "@routes/paths";
import { getAuthToken, logout, refreshAuthToken } from "@features/auth";
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
          url = 'https://cardcheck-api.azurewebsites.net/api/';
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
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
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
      // Attempt to refresh token
      const newToken = await refreshAuthToken();
      if (newToken) {
        // Update request header with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        // Process any pending requests
        processPendingRequests();
        // Retry original request
        return apiClient(originalRequest);
      }
      
      // If refresh failed, logout
      handleAuthFailure();
      return Promise.reject(error);
    } catch (refreshError) {
      // Handle refresh failure
      handleAuthFailure();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

const handleAuthFailure = () => {
  // Process any pending requests with error
  processPendingRequests(new Error('Authentication failed'));
  
  toast.error('Your session has expired. Please log in again.');
  logout(queryClient!);

  window.location.href = paths.auth.login;
};
