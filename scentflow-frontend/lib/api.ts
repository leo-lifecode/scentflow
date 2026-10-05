import axios from "axios";

function resolveApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  const base = configured || "http://localhost:5000/api";

  // Accept both `http://localhost:5000` and `http://localhost:5000/api`.
  return base.replace(/\/$/, "").endsWith("/api")
    ? base.replace(/\/$/, "")
    : `${base.replace(/\/$/, "")}/api`;
}

export const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
