import { Suspense } from "react";
import { RouteObject } from "react-router-dom";
import RegisterView from "./views/RegisterView.tsx";
import ForgotPasswordView from "./views/ForgotPasswordView.tsx";
import ResetPasswordView from "./views/ResetPasswordView.tsx";
import VerifyEmailView from "./views/VerifyEmailView.tsx";
import { authPaths } from "./paths";
import RegistrationSuccessfulView from "@features/auth/views/RegistrationSuccessfulView.tsx";
import LogoutView from "@features/auth/views/LogoutView.tsx";
import LoadingScreen from "@common/views/LoadingScreen.tsx";
import LoginView from "./views/LoginView.tsx";

export const authRoutes: RouteObject[] = [
    {
      path: authPaths.login,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <LoginView />
        </Suspense>
      )
    },
    {
        path: authPaths.logout,
        element: (
            <Suspense fallback={<LoadingScreen />}>
                <LogoutView />
            </Suspense>
        )
    },
    {
      path: authPaths.register,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <RegisterView />
        </Suspense>
      )
    },
    {
      path: authPaths.forgotPassword,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <ForgotPasswordView />
        </Suspense>
      )
    },
    {
      path: authPaths.resetPassword,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <ResetPasswordView />
        </Suspense>
      )
    },
    {
        path: authPaths.registerSuccess,
        element: (
            <Suspense fallback={<LoadingScreen />}>
                <RegistrationSuccessfulView />
            </Suspense>
        )
    },

    {
      // Handle email verification links
      path: authPaths.verifyEmail,
      element: (
        <Suspense fallback={<LoadingScreen />}>
          <VerifyEmailView />
        </Suspense>
      )
    }
  ];