import { useAuth } from "features/auth";
import { Navigate, useLocation } from "react-router-dom";
import { paths } from "routes/paths";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
  
    if (!isAuthenticated) {
      return <Navigate to={paths.auth.login} state={{ from: location.pathname }} />;
    }
  
    return <>{children}</>;
};