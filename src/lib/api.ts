export const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const apiFetch: typeof fetch = (input: any, init?: RequestInit) => {
  const path = typeof input === "string" ? input : String(input);
  const url = API_BASE ? `${API_BASE}${path}` : path;
  return fetch(url, init);
};

