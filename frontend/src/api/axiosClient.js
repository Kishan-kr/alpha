import axios from "axios";

/**
 * Session-based auth:
 * - Server should set an httpOnly session cookie (SameSite=Lax or None + Secure).
 * - We must send credentials (cookies) on every request.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true, // IMPORTANT for session cookies
  timeout: 20000,
});

// Optional: attach X-Requested-With for CSRF middleware or logging
api.interceptors.request.use((config) => {
  config.headers["X-Requested-With"] = "XMLHttpRequest";
  // No Authorization header here (session-based)
  return config;
});

// Normalize errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Bubble up a consistent error shape
    const message =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      "Request failed";
    err.normalizedMessage = message;
    return Promise.reject(err);
  }
);

export default api;