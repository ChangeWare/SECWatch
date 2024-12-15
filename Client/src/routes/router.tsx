import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "@features/auth/AuthLayout.tsx";
import { dashboardRoutes } from "features/dashboard";
import NotFoundView from "@common/views/NotFoundView";
import HomeLayout from "@features/home/HomeLayout.tsx";
import { homeRoutes } from "@/features/home";
import {GuestGuard, AuthGuard, authRoutes} from "@features/auth";
import DashboardLayout from "@features/dashboard/DashboardLayout.tsx";

export const Routes = () => {

    return useRoutes([
      {
        element: <GuestGuard>
                  <AuthLayout />
                </GuestGuard>,
        children: authRoutes
      },
      {
        element: <AuthGuard>
                    <DashboardLayout />
                  </AuthGuard>,
        children: dashboardRoutes
      },
      {
        element: <HomeLayout />,
        children: homeRoutes
      },
      {
        path: '/404',
        element: <NotFoundView />
      },
      {
        path: '*',
        element: <Navigate to="/404" replace />
      }
    ]);
  };