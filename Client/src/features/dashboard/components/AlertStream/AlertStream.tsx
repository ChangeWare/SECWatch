import {Card, CardContent, CardHeader, CardTitle} from "@common/components/Card.tsx";
import {Bell} from "lucide-react";
import useAlertNotifications from "@features/alerts/hooks/useAlertNotifications.tsx";
import AlertFeed from "@features/dashboard/components/AlertStream/AlertFeed.tsx";
import LoadingIndicator from "@common/components/LoadingIndicator.tsx";


export default function AlertStream() {
    const { notifications, notificationsLoading, markRead, markDismissed } = useAlertNotifications();

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
                <LoadingIndicator isLoading={notificationsLoading || !notifications}>
                    <AlertFeed
                        alerts={notifications!}
                        onDismiss={handleDismiss}
                        onMarkAsRead={handleMarkAsRead}
                    />
                </LoadingIndicator>
            </CardContent>
        </Card>
    );
};
