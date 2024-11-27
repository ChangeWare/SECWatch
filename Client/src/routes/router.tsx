import { Navigate, useRoutes } from "react-router-dom";
import AuthLayout from "@common/layouts/AuthLayout";
import { authRoutes } from "features/auth";
import { AppLayout } from "@common/layouts/AppLayout";
import { dasboardRoutes, DashboardView } from "features/dashboard";
import GuestGuard from "./components/GuestGuard";
import AuthGuard from "./components/AuthGuard";
import NotFoundView from "@common/views/NotFoundView";
import HomeLayout from "@/common/layouts/HomeLayout";
import { homeRoutes } from "@/features/home/routes";

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
        children: dasboardRoutes
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