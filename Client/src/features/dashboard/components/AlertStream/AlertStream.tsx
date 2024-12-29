import {useEffect, useState} from "react";
import {AlertFeed, AlertItem} from "@features/dashboard/components/AlertStream/AlertFeed.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@common/components/Card.tsx";
import {Bell} from "lucide-react";

interface AlertStreamProps {
    alerts: AlertItem[];
}

export default function AlertStream(props: AlertStreamProps) {
    const [alerts, setAlerts] = useState<AlertItem[]>(props.alerts);

    useEffect(() => {
        setAlerts(props.alerts);
    }, [props.alerts]);

    const handleDismiss = (id: string) => {
        setAlerts(alerts.filter(alert => alert.id !== id));
    };

    const handleMarkAsRead = (id: string) => {
        setAlerts(alerts.map(alert =>
            alert.id === id ? { ...alert, read: true } : alert
        ));
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
                <AlertFeed
                    alerts={alerts}
                    onDismiss={handleDismiss}
                    onMarkAsRead={handleMarkAsRead}
                />
            </CardContent>
        </Card>
    );
};
