import React from 'react';
import { cn } from "@/common/lib/utils";
import { XCircle, Clock, FileText, Bell } from 'lucide-react';
import {AlertEventTypes, AlertNotification, FilingAlertNotification} from "@/features/alerts/types";
import HyperLink from "@common/components/HyperLink.tsx";
import {useNavigate} from "react-router-dom";

interface AlertItemProps {
    alert: AlertNotification;
    onDismiss?: (id: string) => void;
    onMarkAsRead?: (id: string) => void;
    className?: string;
}

const alertTypeIcons = {
    [AlertEventTypes.FilingAlert]: FileText
} as const;

const priorityStyles = {
    high: "before:bg-error",
    medium: "before:bg-metrics-growth",
    low: "before:bg-success"
} as const;

function AlertNotificationEntry(props: AlertItemProps) {
    const {
        alert,
        onDismiss,
        onMarkAsRead,
        className
    } = props;

    const navigate = useNavigate();

    const Icon = alertTypeIcons[alert.eventType];

    const handleViewFiling = (filingAlert: FilingAlertNotification) => {
        onMarkAsRead?.(alert.id);
        navigate(`/companies/${filingAlert.company.cik}/filings/${filingAlert.accessionNumber}`);
    }

    const renderAlertEntry = (alert: AlertNotification) => {

        // Handle different alert types
        switch (alert.eventType) {
            case AlertEventTypes.FilingAlert: {
                const filingAlert = alert as FilingAlertNotification;
                console.log(filingAlert);
                return (
                    <>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-foreground">
                                {filingAlert.company.name}
                            </span>
                            <span className="text-sm text-foreground/50">
                                {filingAlert.company.ticker}
                            </span>
                        </div>
                        <h4 className="text-foreground font-medium truncate mb-1">
                            {filingAlert.formType} Filing Alert
                        </h4>
                        <span className="flex items-center gap-1 text-xs text-foreground/50 mb-5">
                            <Clock className="h-3 w-3"/>
                            Filed {new Date(filingAlert.filingDate).toLocaleString()}
                        </span>
                        <p className="text-sm text-foreground/70 line-clamp-2 mb-4">
                            <HyperLink className="cursor-pointer" onClick={() => handleViewFiling(filingAlert)}>
                                View Filing
                            </HyperLink>
                        </p>
                        <p className="text-sm text-foreground/70">
                            Filed on {new Date(filingAlert.filingDate).toLocaleDateString()}
                        </p>
                    </>
                )
            }
        }
    }

    return (
        <div className={cn(
            // Base card styles
            "p-2 rounded-lg bg-surface/80",
            "shadow-[0_4px_12px_rgba(0,0,0,0.1)]",
            "relative overflow-hidden",
            "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5",
            // Read state
            alert.isViewed ? "opacity-50" : "opacity-100",
            // TODO: Priority indicator
            // priorityStyles[alert.priority],
            "group",
            className
        )}>
            <div className="flex items-start gap-3 mb-4">
                {/* Icon */}
                <div className={cn(
                    "mt-1 p-2 rounded-full bg-surface/40",
                    alert.isViewed ? "text-foreground/50" : "text-info"
                )}>
                    <Icon className="h-4 w-4"/>
                </div>

                <div className="flex-1 min-w-0 pt-1.5">
                    {alert && (renderAlertEntry(alert))}
                </div>

                {/* Dismiss button - only shows on hover */}
                {onDismiss && (
                    <button
                        onClick={() => onDismiss(alert.id)}
                        className="opacity-0 group-hover:opacity-100 transition text-foreground/50
                                 hover:text-foreground p-1 rounded-full hover:bg-surface/40"
                        aria-label="Dismiss alert"
                    >
                        <XCircle className="h-4 w-4"/>
                    </button>
                )}
            </div>
            <div className=" gap-4 mt-2">
                {!alert.isViewed && onMarkAsRead ? (
                    <button
                        onClick={() => onMarkAsRead(alert.id)}
                        className="text-xs text-info hover:text-info/80 transition-colors duration-200 ml-auto"
                    >
                        Mark as read
                    </button>
                ) : (<a className="text-xs text-secondary ml-auto">Notification read {alert.viewedAt?.toLocaleDateString()}</a>)}
            </div>
        </div>
    );
}

interface AlertFeedProps {
    alerts: AlertNotification[];
    onDismiss?: (id: string) => void;
    onMarkAsRead?: (id: string) => void;
    className?: string;
}

function AlertFeed (props: AlertFeedProps) {
    const {
        alerts,
        onDismiss,
        onMarkAsRead,
        className
    } = props;

    const groupedAlerts = React.useMemo(() => {

        return alerts.reduce((acc, alert) => {
            const date = new Date(alert.createdAt).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(alert);
            return acc;
        }, {} as Record<string, AlertNotification[]>);
    }, [alerts]);

    return (
        <div className={cn("space-y-6", className)}>
            {alerts.length === 0 && (
                <div className="space-y-1">
                    <div className="text-md text-foreground/50 px-1">
                        No alerts.
                    </div>
                    <div className="text-md text-foreground/50 px-1">
                        <HyperLink to="/alerts/rules">Create an alert rule</HyperLink>.
                    </div>
                </div>
            )}
            {Object.entries(groupedAlerts).map(([date, dateAlerts]) => (
                <div key={date} className="space-y-2">
                    <h3 className="text-sm font-medium text-foreground/50 px-1">
                        {date}
                    </h3>
                    <div className="space-y-3">
                        {dateAlerts.map(alert => (
                            <AlertNotificationEntry
                                key={alert.id}
                                alert={alert}
                                onDismiss={onDismiss}
                                onMarkAsRead={onMarkAsRead}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default AlertFeed;