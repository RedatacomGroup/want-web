"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { notificationApi } from "@/lib/notifications";

export function useNotificationCount() {
  const { user, isLoading: authLoading } = useAuth();
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!user) { setCount(0); return 0; }
    try {
      const response = await notificationApi.unreadCount();
      setCount(response.unreadCount);
      return response.unreadCount;
    } catch {
      return count;
    }
  }, [user, count]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      if (authLoading || !user) return;
      try {
        const response = await notificationApi.unreadCount();
        if (active) setCount(response.unreadCount);
      } catch { /* nav should remain usable */ }
    });
    return () => { active = false; };
  }, [authLoading, user]);

  return { count, refresh };
}
