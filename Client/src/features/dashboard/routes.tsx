import { RouteObject } from "react-router-dom";
import DashboardView from "./views/DashboardView";
import { dashboardPaths } from "@features/dashboard";
import CompanySearch from "@features/companySearch/components/CompanySearch.tsx";

export const dashboardRoutes: RouteObject[] = [
    {
      path: dashboardPaths.default,
      element: <DashboardView />
    },
    {
        path: dashboardPaths.companies.search,
        element: <CompanySearch />
    }
];

export default dashboardRoutes;