import { Navigate, Outlet } from "react-router-dom";
import { getRole } from "../utils/auth";

const RoleRoute = ({ role }) => {
  return getRole() === role
    ? <Outlet />
    : <Navigate to="/unauthorized" replace />;
};

export default RoleRoute;
