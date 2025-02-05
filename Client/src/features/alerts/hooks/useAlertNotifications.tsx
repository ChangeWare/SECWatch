import {useMutation, useQuery} from "@tanstack/react-query";
import {alertsApi} from "@features/alerts/api/alertsApi.ts";
import {useMemo} from "react";
import queryClient from "@/common/api/queryClient";
import {toast} from "react-toastify";

const useAlertNotifications = () => {

    const { data, error, isLoading } = useQuery({
        queryKey: ['alertNotifications'],
        queryFn: alertsApi.getUserAlertNotifications,
        staleTime: 1000 * 60, // 1 minute
    });

    const markReadMutation = useMutation({
       mutationFn: (notificationId: string) => alertsApi.markAlertNotificationAsRead(notificationId),
       onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['alertNotifications'] });
       },
       onError: (error) => {
          toast.error('Failed to mark notification as read');
       }
    });

    const markDismissedMutation = useMutation({
        mutationFn: (notificationId: string) => alertsApi.markAlertNotificationAsDismissed(notificationId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['alertNotifications'] });
        },
        onError: (error) => {
            toast.error('Failed to dismiss notification');
        }
    });

    const notifications = useMemo(() => {
        if (!data) {
            return undefined;
        }

        return data.notifications.map(notification => ({
            ...notification,
            createdAt: new Date(notification.createdAt),
            viewedAt: notification.viewedAt ? new Date(notification.viewedAt) : undefined,
        }));


    }, [data]);

    return {
        notifications,
        notificationsError: error,
        notificationsLoading: isLoading,

        markRead: markReadMutation.mutate,
        markDismissed: markDismissedMutation.mutate,
    };
}

export default useAlertNotifications;