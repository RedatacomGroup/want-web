"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { adminApi } from "@/lib/admin";

type AccessState =
  | "checking"
  | "allowed"
  | "denied";

export function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();

  const [access, setAccess] =
    useState<AccessState>("checking");

  useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
      if (isAuthLoading) {
        return;
      }

      if (!user) {
        if (active) {
          setAccess("denied");
          router.replace("/login");
        }

        return;
      }

      try {
        /*
         * This endpoint is protected by the backend's
         * authMiddleware and requireAdmin middleware.
         *
         * We request only one result because this call
         * is being used as an authorization probe.
         */
        await adminApi.users(1, 0);

        if (active) {
          setAccess("allowed");
        }
      } catch {
        if (active) {
          setAccess("denied");
          router.replace("/feed");
        }
      }
    });

    return () => {
      active = false;
    };
  }, [isAuthLoading, router, user]);

  if (isAuthLoading || access === "checking") {
    return (
      <main className="admin-shell">
        <div className="admin-loading" />
      </main>
    );
  }

  if (access !== "allowed") {
    return null;
  }

  return (
    <main className="admin-shell">
      <nav className="admin-nav">
        <Link href="/admin">
          Overview
        </Link>

        <Link href="/admin/reports">
          Reports
        </Link>

        <Link href="/admin/desires">
          Desires
        </Link>

        <Link href="/admin/users">
          Users
        </Link>
      </nav>

      {children}
    </main>
  );
}