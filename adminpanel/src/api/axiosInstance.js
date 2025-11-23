import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ONLY this
});

axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("adminToken") || localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

console.log("API Base URL:", import.meta.env.VITE_API_URL); // <-- TEMPORARY: to verify

export default axiosInstance;
