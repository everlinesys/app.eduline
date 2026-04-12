import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ,
});

// 🔑 Attach TENANT ID (static per frontend build)
api.defaults.headers.common["x-tenant-id"] = localStorage.getItem("tenant_id");
// import.meta.env.VITE_TENANT_ID ||

// 🔐 Attach JWT token (dynamic per user)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
