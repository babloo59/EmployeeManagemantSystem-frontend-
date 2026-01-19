import axios from "axios";
import { getToken, logout, isTokenExpired } from "../utils/auth";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    if (isTokenExpired(token)) {
      logout();
      return Promise.reject("Token expired");
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logout();
    }
    return Promise.reject(err);
  }
);

export default api;
