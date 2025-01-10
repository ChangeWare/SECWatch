
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface AuthenticationInfo {
    user: User;
    token: string;
    tokenExpires: string;
    message: string;
}

export interface LoginResponse {
    authenticationInfo: AuthenticationInfo;
}

export interface RegisterResponse {
    authenticationInfo: AuthenticationInfo;
}

export interface RegistrationFormData {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    confirmPassword: string;
    companyName?: string;
    agreeToTerms: boolean;
}

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    lastLoginAt: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordUpdateData {
    currentPassword: string;
    newPassword: string;
}