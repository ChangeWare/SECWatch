import { RouteObject } from "react-router-dom";
import DashboardView from "./views/DashboardView";
import { dashboardPaths } from "@features/dashboard";

export const dashboardRoutes: RouteObject[] = [
    {
      path: dashboardPaths.default,
      element: <DashboardView />
    },
];

export default dashboardRoutes;