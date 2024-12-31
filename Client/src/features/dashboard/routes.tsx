import { RouteObject, Navigate } from "react-router-dom";
import DashboardView from "./views/DashboardView";
import { dashboardPaths } from "@features/dashboard";
import {companyRoutes} from "@features/company/routes.tsx";
import CompanySearchView from "@features/dashboard/views/CompanySearchView.tsx";

export const dashboardRoutes: RouteObject[] = [
    {
      path: dashboardPaths.default,
      element: <DashboardView />
    },
    {
        path: dashboardPaths.company.search,
        element: <CompanySearchView />
    },
    ...companyRoutes
];

export default dashboardRoutes;