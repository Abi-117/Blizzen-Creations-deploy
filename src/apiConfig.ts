// src/apiConfig.ts

// Determine API base URL
export const API_BASE_URL = (() => {
  // 1️⃣ ENV override
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  // 2️⃣ Browser hostname check (production domain)
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "www.blizzencreations.in" || host === "blizzencreations.in") {
      return "https://api.blizzencreations.com";
    }
  }

  // 3️⃣ Local dev fallback
  return import.meta.env.DEV ? "http://localhost:5001" : "https://api.blizzencreations.com";
})();

// Fetch admin token (dev only)
export const getToken = async (): Promise<string | null> => {
  let token = localStorage.getItem("adminToken");

  if (!token && import.meta.env.DEV) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/token`);
      if (!res.ok) throw new Error("Failed to get token");
      const data = await res.json();
      token = data.token;
      localStorage.setItem("adminToken", token);
    } catch (err) {
      console.error("Error fetching token:", err);
      return null;
    }
  }

  if (!token && !import.meta.env.DEV) {
    console.warn("Admin token missing in production!");
  }

  return token;
};
