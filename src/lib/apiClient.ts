// src/lib/apiClient.ts

/**
 * Get the base API URL depending on environment.
 * - Uses environment variable if set (Vite: VITE_API_URL)
 * - Uses Render backend URL in production
 * - Defaults to localhost in development
 */
export const getApiUrl = (): string => {
  // 1️⃣ Vite environment variable (optional override)
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  // 2️⃣ Production URL (Render backend)
  if (typeof window !== "undefined") {
    const host = window.location.hostname;

    // Your production frontend domains
    const prodFrontends = [
      "www.blizzencreations.in",
      "blizzen-creations-git-main-zenelaits-projects.vercel.app",
      "blizzen-creations-ec552rl3u-zenelaits-projects.vercel.app",
    ];

    if (prodFrontends.includes(host)) {
      return "https://blizzen-creations-deploy.onrender.com/api";
    }
  }

  // 3️⃣ Local development fallback
  return "http://localhost:5001/api";
};

// Base API URL
export const API_BASE_URL = getApiUrl();

/**
 * Get admin token from localStorage (optional)
 */
export const getToken = async (): Promise<string | null> => {
  let token = localStorage.getItem("adminToken") || null;

  // In development, fetch a dev token if missing (optional)
  if (!token && import.meta.env.DEV) {
    try {
      const res = await fetch(`${API_BASE_URL}/token`);
      if (!res.ok) throw new Error("Failed to get dev token");
      const data = await res.json();
      token = data.token;
      localStorage.setItem("adminToken", token);
    } catch (err) {
      console.error("Error fetching dev token:", err);
      return null;
    }
  }

  return token;
};

/**
 * API fetch wrapper with automatic headers + token
 */
export const apiFetch = async (path: string, options: RequestInit = {}) => {
  const token = await getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) throw new Error(`API request failed: ${res.status}`);
  return res.json();
};
