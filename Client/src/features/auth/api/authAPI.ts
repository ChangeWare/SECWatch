import { apiClient } from "@common/api/apiClient";
import { LoginResponse, LoginCredentials, User, RegistrationData, PasswordResetRequest, PasswordUpdateData, RegisterResponse } from "../types";

/**
 * Authentication API methods
 */
export const authApi = {
  /**
   * Log in a user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    // Store token in secure HTTP-only cookie via backend
    return response.data;
  },

  /**
   * Get the current authenticated user
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  /**
   * Register a new user
   */
  register: async (data: RegistrationData): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Request a password reset
   */
  requestPasswordReset: async (data: PasswordResetRequest): Promise<void> => {
    await apiClient.post('/auth/password-reset-request', data);
  },

  /**
   * Reset password with token (from email)
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    await apiClient.post('/auth/password-reset', {
      token,
      newPassword,
    });
  },

  /**
   * Update password for authenticated user
   */
  updatePassword: async (data: PasswordUpdateData): Promise<void> => {
    await apiClient.post('/auth/password-update', data);
  },

  /**
   * Verify email with token
   */
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post('/auth/verify-email', { token });
  },

  /**
   * Refresh the authentication token
   */
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    return response.data;
  },

  /**
   * Check if current token is valid
   */
  validateToken: async (): Promise<boolean> => {
    try {
      await apiClient.get('/auth/validate');
      return true;
    } catch {
      return false;
    }
  }
};