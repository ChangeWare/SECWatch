import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "@common/layouts/AuthLayout";
import { AppLayout } from "@common/layouts/AppLayout";
import { dashboardRoutes } from "features/dashboard";
import NotFoundView from "@common/views/NotFoundView";
import HomeLayout from "@/common/layouts/HomeLayout";
import { homeRoutes } from "@/features/home";
import {GuestGuard, AuthGuard, authRoutes} from "@features/auth";

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
                    <AppLayout />
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