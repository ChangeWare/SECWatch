import { Navigate, RouteObject } from "react-router-dom";
import companyPaths from "@features/company/paths.ts";
import CompanyLayout from "./CompanyLayout.tsx";
import { CompanyDashboardView } from "@features/company/views/CompanyDashboardView.tsx";
import {CompanyFilingsView} from "@features/company/views/CompanyFilingsView.tsx";
import CompanyAnalysisView from "@features/company/views/CompanyAnalysisView.tsx";
import {CompanyFilingView} from "@features/company/views/CompanyFilingView.tsx";
import CompanyAlertsView from "@features/company/views/CompanyAlertsView.tsx";
import TrackedCompaniesView from "@features/company/views/TrackedCompaniesView.tsx";
import CompanyConceptsView from "@features/company/views/CompanyConceptsView.tsx";

export const companyRoutes: RouteObject[] = [
    {
        path: companyPaths.dashboard.default,  // Define the parent path
        element: <CompanyLayout />,
        children: [
            {
                index: true,  // This makes it the default route
                element: <Navigate to="overview" replace />
            },
            {
                path: companyPaths.dashboard.overview,  // Now relative to parent
                element: <CompanyDashboardView />
            },
            {
                path: companyPaths.dashboard.filings,
                element: <CompanyFilingsView />
            },
            {
                path: companyPaths.dashboard.concepts,
                element: <CompanyConceptsView />
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