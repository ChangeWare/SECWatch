import alertPaths from "@features/alerts/paths.ts";
import {RouteObject} from "react-router-dom";
import AlertRulesView from "@features/alerts/views/AlertRulesView.tsx";


export const alertRoutes: RouteObject[] = [
    {
        path: alertPaths.rules,
        element: <AlertRulesView />,
    }
];