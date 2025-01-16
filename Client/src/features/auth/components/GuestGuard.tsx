import { useAuth } from "@features/auth";
import { Navigate, useLocation } from "react-router-dom";
import { paths } from "@routes/paths.ts";
import React from "react";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    
    if (isAuthenticated && location.pathname !== paths.auth.logout) {
      return <Navigate to={location.state?.from ?? paths.dashboard.default} />;
    }
  
    return <>{children}</>;
};