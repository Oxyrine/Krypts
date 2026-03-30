"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api, UserResponse } from "./api";

interface AuthContextType {
  user: UserResponse | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const cached = localStorage.getItem("cached_user");
      return cached ? JSON.parse(cached) : null;
    } catch { return null; }
  });
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === "undefined") return true;
    return !!localStorage.getItem("access_token") && !localStorage.getItem("cached_user");
  });

  // Restore session on mount — validate token in background
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      api.auth
        .me()
        .then((u) => {
          setUser(u);
          localStorage.setItem("cached_user", JSON.stringify(u));
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("cached_user");
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const resp = await api.auth.login(email, password);
    localStorage.setItem("access_token", resp.access_token);
    const me = await api.auth.me();
    localStorage.setItem("cached_user", JSON.stringify(me));
    setUser(me);
  }, []);

  const signup = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const resp = await api.auth.signup(email, password, fullName);
      localStorage.setItem("access_token", resp.access_token);
      const me = await api.auth.me();
      localStorage.setItem("cached_user", JSON.stringify(me));
      setUser(me);
    },
    []
  );

  const logout = useCallback(() => {
    api.auth.logout().catch(() => {});
    localStorage.removeItem("access_token");
    localStorage.removeItem("cached_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
