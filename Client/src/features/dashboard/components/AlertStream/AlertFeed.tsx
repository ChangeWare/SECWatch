import React from 'react';
import { cn } from "@/common/lib/utils";
import { AlertTriangle, Info, XCircle, Clock, FileText, Bell } from 'lucide-react';

// Types for our alerts
export interface AlertItem {
    id: string;
    type: 'filing' | 'threshold' | 'news' | 'watchlist';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    timestamp: string;
    company?: {
        name: string;
        symbol: string;
    };
    read?: boolean;
}

interface AlertItemProps {
    alert: AlertItem;
    onDismiss?: (id: string) => void;
    onMarkAsRead?: (id: string) => void;
    className?: string;
}

const alertTypeIcons = {
    filing: FileText,
    threshold: AlertTriangle,
    news: Info,
    watchlist: Bell,
} as const;

const priorityStyles = {
    high: "border-red-500/50",
    medium: "border-yellow-500/50",
    low: "border-secondary/50"
} as const;

export const AlertNotification = ({
                                      alert,
                                      onDismiss,
                                      onMarkAsRead,
                                      className
                                  }: AlertItemProps) => {
    const Icon = alertTypeIcons[alert.type];

    return (
        <div className={cn(
            "p-2 rounded-lg border border-white/10 bg-white/5 hover:border-accent/50 transition",
            alert.read ? "opacity-75" : "opacity-100",
            priorityStyles[alert.priority],
            "group",
            className
        )}>
            <div className="flex items-start gap-3 mb-4">
                {/* Icon */}
                <div className={cn(
                    "mt-1 p-2 rounded-full bg-white/5",
                    alert.read ? "text-gray-400" : "text-accent"
                )}>
                    <Icon className="h-4 w-4"/>
                </div>

                <div className="flex-1 min-w-0 pt-1.5">
                    {alert.company && (
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white">
                                {alert.company.name}
                            </span>
                            <span className="text-sm text-gray-400">
                                {alert.company.symbol}
                            </span>
                        </div>
                    )}
                    <h4 className="text-white font-medium mb-1 truncate">
                        {alert.title}
                    </h4>
                    <p className="text-sm text-gray-300 line-clamp-2">
                        {alert.description}
                    </p>


                </div>


                {/* Dismiss button - only shows on hover */}
                {onDismiss && (
                    <button
                        onClick={() => onDismiss(alert.id)}
                        className="opacity-0 group-hover:opacity-100 transition text-gray-400
                                 hover:text-white p-1 rounded-full hover:bg-white/5"
                    >
                        <XCircle className="h-4 w-4"/>
                    </button>
                )}
            </div>
            <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="h-3 w-3"/>
                            {new Date(alert.timestamp).toLocaleString()}
                        </span>
                {!alert.read && onMarkAsRead && (
                    <button
                        onClick={() => onMarkAsRead(alert.id)}
                        className="text-xs text-accent hover:text-accent/80 transition ml-auto"
                    >
                        Mark as read
                    </button>
                )}
            </div>
        </div>
    );
};

interface AlertFeedProps {
    alerts: AlertItem[];
    onDismiss?: (id: string) => void;
    onMarkAsRead?: (id: string) => void;
    className?: string;
}

export const AlertFeed = ({
                              alerts,
                              onDismiss,
                              onMarkAsRead,
                              className
                          }: AlertFeedProps) => {
    // Group alerts by date
    const groupedAlerts = React.useMemo(() => {
        return alerts.reduce((acc, alert) => {
            const date = new Date(alert.timestamp).toLocaleDateString();
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(alert);
            return acc;
        }, {} as Record<string, AlertItem[]>);
    }, [alerts]);

    return (
        <div className={cn("space-y-6", className)}>
            {Object.entries(groupedAlerts).map(([date, dateAlerts]) => (
                <div key={date} className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-400 px-1">
                        {date}
                    </h3>
                    <div className="space-y-3">
                        {dateAlerts.map(alert => (
                            <AlertNotification
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
};

export default AlertFeed;