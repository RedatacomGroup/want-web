import type { AuthTokens } from "@/types/auth";

const KEY = "want.auth.tokens";
const canUseStorage = () => typeof window !== "undefined";

export const authStorage = {
  get(): AuthTokens | null {
    if (!canUseStorage()) return null;
    try {
      const value = window.localStorage.getItem(KEY);
      return value ? (JSON.parse(value) as AuthTokens) : null;
    } catch { return null; }
  },
  set(tokens: AuthTokens) { if (canUseStorage()) window.localStorage.setItem(KEY, JSON.stringify(tokens)); },
  clear() { if (canUseStorage()) window.localStorage.removeItem(KEY); },
};
