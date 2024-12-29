import {Navigate, RouteObject} from "react-router-dom";
import CompanySearch from "@features/companySearch/components/CompanySearch.tsx";
import companyPaths from "@features/company/paths.ts";
import CompanyDashboardLayout from "./CompanyDashboardLayout.tsx";
import {CompanyOverview} from "@features/company/views/CompanyOverview.tsx";

export const companyRoutes: RouteObject[] = [
    {
        element: <CompanyDashboardLayout />,
        children: [
            {
                path: companyPaths.search,
                element: <CompanySearch />
            },
            {
                path: companyPaths.dashboard.default,
                element: <Navigate to='overview' replace />
            },
            {
                path: companyPaths.dashboard.overview,
                element: <CompanyOverview />
            }
        ]
    }

];