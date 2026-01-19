export const getToken = () => localStorage.getItem("token");
export const getRole = () => localStorage.getItem("role");

export const isFirstLogin = () =>
  localStorage.getItem("firstLogin") === "true";

export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

export const logout = () => {
  localStorage.clear();
  window.location.replace("/login");
};
