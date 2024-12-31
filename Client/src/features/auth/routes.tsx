import { Suspense } from "react";
import { RouteObject } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import ForgotPassword from "./views/ForgotPassword";
import ResetPassword from "./views/ResetPassword";
import VerifyEmail from "./views/VerifyEmail";
import { authPaths } from "./paths";
import RegistrationSuccessful from "@features/auth/views/RegistrationSuccessful.tsx";
import Logout from "@features/auth/views/Logout.tsx";
import LoadingScreen from "@common/views/LoadingScreen.tsx";

export const authRoutes: RouteObject[] = [
    {
      path: authPaths.login,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <Login />
        </Suspense>
      )
    },
    {
        path: authPaths.logout,
        element: (
            <Suspense fallback={<LoadingScreen />}>
                <Logout />
            </Suspense>
        )
    },
    {
      path: authPaths.register,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <Register />
        </Suspense>
      )
    },
    {
      path: authPaths.forgotPassword,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <ForgotPassword />
        </Suspense>
      )
    },
    {
      path: authPaths.resetPassword,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <ResetPassword />
        </Suspense>
      )
    },
    {
        path: authPaths.registerSuccess,
        element: (
            <Suspense fallback={<LoadingScreen />}>
                <RegistrationSuccessful />
            </Suspense>
        )
    },
    {
      // Handle email verification links
      path: authPaths.verifyEmail,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <VerifyEmail />
        </Suspense>
      )
    }
  ];