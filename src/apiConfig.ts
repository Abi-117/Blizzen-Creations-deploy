export const API_BASE_URL = (() => {
  // 1️⃣ ENV override
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

  // 2️⃣ Browser hostname (production)
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "www.blizzencreations.in" || host === "blizzencreations.in") {
      return "https://blizzen-creations-deploy.onrender.com";
    }
  }

  // 3️⃣ Local dev
  return import.meta.env.DEV ? "http://localhost:5001" : "https://blizzen-creations-deploy.onrender.com";
})();
