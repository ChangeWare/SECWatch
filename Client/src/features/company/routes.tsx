import { Navigate, RouteObject } from "react-router-dom";
import companyPaths from "@features/company/paths.ts";
import CompanyDashboardLayout from "./CompanyDashboardLayout.tsx";
import { CompanyOverview } from "@features/company/views/CompanyOverview.tsx";

export const companyRoutes: RouteObject[] = [
    {
        path: 'companies/:companyId',  // Define the parent path
        element: <CompanyDashboardLayout />,
        children: [
            {
                index: true,  // This makes it the default route
                element: <Navigate to="overview" replace />
            },
            {
                path: 'overview',  // Now relative to parent
                element: <CompanyOverview />
            },
        ]
    }
];