"use client";

import { api } from "@/lib/api";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (email: string, password: string, fullName?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.defaults.withCredentials = true;
  }, []);

  const refresh = useCallback(async () => {
    try {
      const response = await api.get<{ user: AuthUser }>("/auth/me", {
        withCredentials: true,
      });
      setUser(response.data.user);
      return;
    } catch {
      // The access token may be expired while the refresh token is still valid.
    }

    try {
      await api.post("/auth/refresh", undefined, { withCredentials: true });
      const response = await api.get<{ user: AuthUser }>("/auth/me", {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await api.post<{ user: AuthUser }>(
      "/auth/login",
      { email, password },
      { withCredentials: true }
    );
    setUser(response.data.user);
    return response.data.user;
  }, []);

  const register = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const response = await api.post<{ user: AuthUser | null; requiresEmailConfirmation: boolean }>(
        "/auth/register",
        { email, password, full_name: fullName },
        { withCredentials: true }
      );

      if (response.data.user && !response.data.requiresEmailConfirmation) {
        setUser(response.data.user);
      }

      return response.data.requiresEmailConfirmation;
    },
    []
  );

  const logout = useCallback(async () => {
    await api.post("/auth/logout", undefined, { withCredentials: true });
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refresh }),
    [user, loading, login, register, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
}
