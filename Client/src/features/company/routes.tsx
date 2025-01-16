import { Navigate, RouteObject } from "react-router-dom";
import companyPaths from "@features/company/paths.ts";
import CompanyDashboardLayout from "./CompanyDashboardLayout.tsx";
import { CompanyOverview } from "@features/company/views/CompanyOverview.tsx";
import {CompanyFilings} from "@features/company/views/CompanyFilings.tsx";
import CompanyAnalysisView from "@features/company/views/CompanyAnalysisView.tsx";
import {CompanyFilingView} from "@features/company/views/CompanyFilingView.tsx";
import CompanyAlertsView from "@features/company/views/CompanyAlertsView.tsx";
import TrackedCompaniesView from "@features/company/views/TrackedCompaniesView.tsx";

export const companyRoutes: RouteObject[] = [
    {
        path: companyPaths.dashboard.default,  // Define the parent path
        element: <CompanyDashboardLayout />,
        children: [
            {
                index: true,  // This makes it the default route
                element: <Navigate to="overview" replace />
            },
            {
                path: companyPaths.dashboard.overview,  // Now relative to parent
                element: <CompanyOverview />
            },
            {
                path: companyPaths.dashboard.filings,
                element: <CompanyFilings />
            },
            {
                path: companyPaths.dashboard.analysis,
                element: <CompanyAnalysisView />
            },
            {
                path: companyPaths.dashboard.filing,
                element: <CompanyFilingView />
            },
            {
                path: companyPaths.dashboard.alerts,
                element: <CompanyAlertsView />
            }
        ]
    }
];