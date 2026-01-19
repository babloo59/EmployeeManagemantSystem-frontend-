import { getRole, isAuthenticated, logout } from "../utils/auth";

export const useAuth = () => {
  return {
    isAuthenticated: isAuthenticated(),
    role: getRole(),
    logout,
  };
};
