import {Card, CardContent, CardHeader, CardTitle} from "@common/components/Card.tsx";
import {Bell} from "lucide-react";
import useAlertNotifications from "@features/alerts/hooks/useAlertNotifications.tsx";
import AlertFeed from "@features/dashboard/components/AlertStream/AlertFeed.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";
import {useAuth} from "@features/auth";


export default function AlertStream() {
    const { notifications, notificationsLoading, markRead, markDismissed } = useAlertNotifications();
    const { isAuthenticated } = useAuth();

    const previewContent = (
        <div className="space-y-4">
            <p className="text-gray-400 text-sm text-right">Date Filed</p>
            {[1, 2, 3].map((i) => (
                <Card variant="elevated" key={i} className="justify-between p-2">
                    <CardContent className="p-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-foreground font-medium">
                                    Example Company {i}
                                </h3>
                                <p className="text-secondary text-sm">
                                    TICK
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-foreground">
                                    Form 10-K
                                </p>
                                <p className="text-foreground/70 text-sm">
                                    {new Date().toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const handleDismiss = (id: string) => {
        markDismissed(id);
    };

    const handleMarkAsRead = (id: string) => {
        markRead(id);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Alerts
                </CardTitle>
            </CardHeader>
            <CardContent>
                <LoadingIndicator isLoading={isAuthenticated && (notificationsLoading || !notifications)}>
                    {!isAuthenticated ? (
                        previewContent
                    ) : (
                        <AlertFeed
                            alerts={notifications!}
                            onDismiss={handleDismiss}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    )}

                </LoadingIndicator>
            </CardContent>
        </Card>
    );
};
