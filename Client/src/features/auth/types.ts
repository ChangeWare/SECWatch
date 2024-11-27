
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginFormData {
    email: string;
    password: string;
    rememberMe?: boolean;
}

export interface LoginResponse {
    user: User;
    token: string;
    tokenExpires: string;
    message: string;
}

export interface RegisterResponse {
    user: User;
    token: string;
    tokenExpires: string;
    message: string;
}

export interface RegistrationForm {
    email: string;
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

// Type for registration data
export interface RegistrationData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    companyName?: string;
}

// Type for password reset request
export interface PasswordResetRequest {
    email: string;
}

// Type for password update
export interface PasswordUpdateData {
    currentPassword: string;
    newPassword: string;
}