import { RouteObject } from "react-router-dom";
import DashboardView from "./views/DashboardView";
import { paths } from "@/routes/paths";

export const dasboardRoutes: RouteObject[] = [
    {
      path: paths.app.default,
      element: <DashboardView />
    },
];

export default dasboardRoutes;