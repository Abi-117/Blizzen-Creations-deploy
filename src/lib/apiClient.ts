// src/apiConfig.ts

/**
 * Get the base API URL depending on environment.
 * - Uses environment variable if set.
 * - Uses production URL if hostname matches.
 * - Defaults to localhost in dev.
 */
export const getApiUrl = (): string => {
  // Check if Vite environment variable is set
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  // Check current hostname for production
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "www.blizzencreations.in" || host === "blizzencreations.in") {
      return "https://blizzen-creations-deploy.onrender.com";
    }
  }

  // Dev environment fallback
  if (import.meta.env.DEV) return "http://localhost:5001";

  // Default fallback
  return "http://localhost:5001";
};

// Base API URL
export const API_BASE_URL = getApiUrl();

/**
 * Get admin token.
 * - Returns localStorage token if present.
 * - In dev, fetches a dev token from backend if missing.
 */
export const getToken = async (): Promise<string | null> => {
  let token = localStorage.getItem("adminToken");

  // If token missing and in development, fetch from backend
  if (!token && import.meta.env.DEV) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/token`);
      if (!res.ok) throw new Error("Failed to get token from backend");

      const data = await res.json();
      token = data.token;

      // Save to localStorage
      localStorage.setItem("adminToken", token);
    } catch (err) {
      console.error("Error fetching dev token:", err);
      return null;
    }
  }

  return token;
};

/**
 * Helper: Full fetch wrapper including admin token.
 */
export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
};
