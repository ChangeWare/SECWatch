import { QueryClient } from "@tanstack/react-query";
import { setQueryClient } from "./apiClient";

const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  });

setQueryClient(queryClient);

export default queryClient;