import { Navigate, Outlet, useLocation } from "react-router-dom";
import { isAuthenticated, isFirstLogin } from "../utils/auth";

const ProtectedRoute = () => {
  const location = useLocation();

  // ❌ Not logged in
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 First login → force password change
  if (
    isFirstLogin() &&
    location.pathname !== "/force-change-password"
  ) {
    return <Navigate to="/force-change-password" replace />;
  }

  // ❌ Normal user trying to access force page
  if (
    !isFirstLogin() &&
    location.pathname === "/force-change-password"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
