import {Navigate, RouteObject} from "react-router-dom";
import companyPaths from "@features/company/paths.ts";
import CompanyDashboardLayout from "./CompanyDashboardLayout.tsx";
import {CompanyOverview} from "@features/company/views/CompanyOverview.tsx";

export const companyRoutes: RouteObject[] = [
    {
        element: <CompanyDashboardLayout />,
        children: [
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