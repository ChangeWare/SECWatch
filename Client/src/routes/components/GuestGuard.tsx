import { useAuth } from "features/auth";
import { Navigate, useLocation } from "react-router-dom";
import { paths } from "routes/paths";

export default function GuestGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    
    if (isAuthenticated) {
      return <Navigate to={location.state?.from ?? paths.app.default} />;
    }
  
    return <>{children}</>;
};