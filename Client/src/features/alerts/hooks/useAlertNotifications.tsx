import {useQuery} from "@tanstack/react-query";
import {alertsApi} from "@features/alerts/api/alertsApi.ts";

const useAlertNotifications = () => {

    const { data, error, isLoading } = useQuery({
        queryKey: ['alertNotifications'],
        queryFn: alertsApi.getUserAlertNotifications,
        staleTime: 1000 * 60, // 1 minute
    });


}

export default useAlertNotifications;