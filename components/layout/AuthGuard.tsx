"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { if (!isLoading && !isAuthenticated) router.replace(`/login?next=${encodeURIComponent(pathname)}`); }, [isAuthenticated, isLoading, pathname, router]);
  if (isLoading || !isAuthenticated) return <main className="shell"><div className="skeleton-card" aria-label="Checking session" /></main>;
  return children;
}
