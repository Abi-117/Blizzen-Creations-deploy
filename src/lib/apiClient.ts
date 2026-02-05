// src/lib/apiClient.ts
import axios from "axios";
import { API_BASE_URL } from "@/apiConfig";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Optional: logging & performance monitoring
apiClient.interceptors.request.use((config) => {
  (config as any).metadata = { startTime: Date.now() };
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const duration = Date.now() - (response.config as any).metadata.startTime;
    if (duration > 1000) console.warn(`Slow API call: ${response.config.url} took ${duration}ms`);
    return response;
  },
  (error) => {
    const duration = Date.now() - (error.config as any)?.metadata?.startTime;
    console.error(`API error: ${error.config?.url} failed after ${duration}ms`, error);
    return Promise.reject(error);
  }
);
