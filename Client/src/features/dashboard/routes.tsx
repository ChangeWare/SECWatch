import { RouteObject, Navigate } from "react-router-dom";
import DashboardView from "./views/DashboardView";
import { dashboardPaths } from "@features/dashboard";
import CompanySearch from "@features/companySearch/components/CompanySearch.tsx";
import {companyRoutes} from "@features/company/routes.tsx";

export const dashboardRoutes: RouteObject[] = [
    {
      path: dashboardPaths.default,
      element: <DashboardView />
    },
    {
        path: dashboardPaths.company.search,
        element: <CompanySearch />
    },
    ...companyRoutes
];

export default dashboardRoutes;