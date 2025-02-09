import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@common/components/Card';
import { X } from 'lucide-react';
import { LoginForm } from '@features/auth/components/LoginForm';
import Button from '@common/components/Button';
import { useNavigate } from 'react-router-dom';
import { paths } from '@routes/paths';

export interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
    onAuthenticated?: () => void;
}

function AuthModal ({
                       isOpen,
                       onClose,
                       title = "Sign in to continue",
                       message = "Sign in to your account or create a new one.",
                       onAuthenticated
                   }: AuthModalProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSignupClick = () => {
        onClose();
        navigate(paths.auth.register);
    };

    const handleLoginSuccess = () => {
        onAuthenticated?.();
    }

    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader className="relative pb-0">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-secondary hover:text-foreground transition"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        <CardTitle>{title}</CardTitle>
                        {message && (
                            <p className="text-secondary text-sm mt-1">{message}</p>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6">
                        <LoginForm onLoginSuccess={handleLoginSuccess} />

                        <div className="mt-6 text-center">
                            <div className="text-secondary mb-2">Don't have an account?</div>
                            <Button
                                variant="info"
                                className="w-full"
                                onClick={handleSignupClick}
                            >
                                Create Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

// Context
interface AuthModalContextType {
    isOpen: boolean;
    config: Omit<AuthModalProps, 'isOpen' | 'onClose'>;
    openAuthModal: (config?: Partial<AuthModalProps>) => void;
    closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<Omit<AuthModalProps, 'isOpen' | 'onClose'>>({});

    const openAuthModal = (newConfig = {}) => {
        setConfig(newConfig);
        setIsOpen(true);
    };

    const closeAuthModal = () => {
        setIsOpen(false);
        setConfig({});
    };

    return (
        <AuthModalContext.Provider value={{ isOpen, config, openAuthModal, closeAuthModal }}>
            {children}
            {isOpen && <AuthModal onClose={close} isOpen={true} {...config} />}
        </AuthModalContext.Provider>
    );
}

export function useAuthModal() {
    const context = useContext(AuthModalContext);
    if (!context) {
        throw new Error('useAuthModal must be used within an AuthModalProvider');
    }
    return context;
}

export default AuthModal;