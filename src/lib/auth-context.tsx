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
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
    if (token) {
      api.auth
        .me()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem("access_token");
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
    setUser(me);
  }, []);

  const signup = useCallback(
    async (email: string, password: string, fullName?: string) => {
      const resp = await api.auth.signup(email, password, fullName);
      localStorage.setItem("access_token", resp.access_token);
      const me = await api.auth.me();
      setUser(me);
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
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
