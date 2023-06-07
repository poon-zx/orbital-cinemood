import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthProvider";

const ProtectedRoute = () => {
    const { auth } = useAuth();
    const location = useLocation();
  
    return auth ? (
      <Outlet />
    ) : (
      <Navigate to={"/login"} replace state={{ path: location.pathname }} />
    );
  };

export default ProtectedRoute;