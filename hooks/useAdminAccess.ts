"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/admin";

export function useAdminAccess() {
  const { user, isLoading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
      if (authLoading) return;
      if (!user) {
        if (active) {
          setIsAdmin(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        await adminApi.users(1, 0);
        if (active) setIsAdmin(true);
      } catch {
        if (active) setIsAdmin(false);
      } finally {
        if (active) setIsChecking(false);
      }
    });

    return () => { active = false; };
  }, [authLoading, user]);

  return { isAdmin, isChecking: authLoading || isChecking };
}
