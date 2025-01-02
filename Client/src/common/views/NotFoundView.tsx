import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Button from '@common/components/Button';
import {Card, CardContent} from "@common/components/Card.tsx";
import {useAuth} from "@features/auth";
import {paths} from "@routes/paths.ts";

const NotFoundView = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background">
            <Card className="max-w-lg w-full">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                        <div className="rounded-full bg-surface/50 p-6">
                            <FileQuestion className="w-12 h-12 text-info" />
                        </div>

                        <h1 className="text-4xl font-bold mb-2 text-foreground">
                            404
                        </h1>

                        <h2 className="text-xl font-medium mb-4 text-foreground">
                            Page Not Found
                        </h2>

                        <p className="text-secondary mb-2 max-w-md">
                            It seems like we've lost our way.
                        </p>
                        <p className="text-secondary mb-8 max-w-md">
                            The page or content might have been moved, deleted, or never existed.
                        </p>

                        <div className="flex gap-4">
                            <Button
                                variant="primary"
                                onClick={() => isAuthenticated ? navigate(paths.dashboard.default) : navigate('/')}
                            >
                                Go Home
                            </Button>

                            <Button
                                variant="success"
                                onClick={() => navigate(-1)}
                            >
                                Go Back
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default NotFoundView;