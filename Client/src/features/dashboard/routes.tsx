import { RouteObject, Navigate } from "react-router-dom";
import DashboardView from "./views/DashboardView";
import { dashboardPaths } from "@features/dashboard";
import {companyRoutes} from "@features/company/routes.tsx";
import CompanySearchView from "@features/dashboard/views/CompanySearchView.tsx";
import companyPaths from "@features/company/paths.ts";
import TrackedCompaniesView from "@features/company/views/TrackedCompaniesView.tsx";

export const dashboardRoutes: RouteObject[] = [
    {
      path: dashboardPaths.default,
      element: <DashboardView />
    },
    {
        path: dashboardPaths.company.search,
        element: <CompanySearchView />
    },
    {
        path: companyPaths.tracked,
        element: <TrackedCompaniesView />
    },
    ...companyRoutes
];

export default dashboardRoutes;