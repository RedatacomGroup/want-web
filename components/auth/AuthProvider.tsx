"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authApi } from "@/lib/auth";
import { authStorage } from "@/lib/auth-storage";
import type { AuthContextValue, LoginInput, RegisterInput } from "@/types/auth";
import type { User } from "@/types/user";

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const tokens = authStorage.get();
    if (!tokens?.accessToken) {
      setUser(null);
      return null;
    }
    try {
      const nextUser = await authApi.me();
      setUser(nextUser);
      return nextUser;
    } catch {
      authApi.logout();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      await refreshUser();
      if (active) setIsLoading(false);
    });
    return () => { active = false; };
  }, [refreshUser]);

  const login = useCallback(async (input: LoginInput) => {
    const nextUser = await authApi.login(input);
    setUser(nextUser);
    return nextUser;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const nextUser = await authApi.register(input);
    setUser(nextUser);
    return nextUser;
  }, []);

  const logout = useCallback(() => {
    authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser,
  }), [user, isLoading, login, register, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
