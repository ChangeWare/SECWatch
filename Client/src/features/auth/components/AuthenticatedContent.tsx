import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@common/components/Card';
import { LockKeyhole } from 'lucide-react';
import {useAuth} from "@features/auth";

interface RegistrationOverlayProps {
    children: React.ReactNode;
}

function AuthenticatedContent ({ children,}: RegistrationOverlayProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="relative">
            {/* Original Content (Blurred) */}
            <div className="blur-sm pointer-events-none">
                {children}
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6">
                <Card className="max-w-md w-full bg-surface text-center p-6 shadow-lg">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="p-3 rounded-full bg-surface-foreground">
                            <LockKeyhole className="h-6 w-6 text-info" />
                        </div>

                        <h3 className="text-xl font-semibold text-foreground">
                            Register to Access
                        </h3>

                        <p className="text-secondary text-sm mb-4">
                            Create a free account to unlock this feature and get access to all our tools.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={() => navigate('/register')}
                                className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
                            >
                                Register Now
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="flex-1 bg-surface-foreground text-foreground px-4 py-2 rounded-lg hover:bg-surface-foreground/80 transition"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default AuthenticatedContent;