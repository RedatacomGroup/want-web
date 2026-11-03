"use client";

import { usePathname } from "next/navigation";
import { TopBar } from "@/components/layout/TopBar";
import { MobileNav } from "@/components/layout/MobileNav";

const SHELL_EXCLUDED = ["/", "/login", "/register", "/onboarding"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const excluded = SHELL_EXCLUDED.includes(pathname);

  if (excluded) return <>{children}</>;

  return (
    <div className="app-shell">
      <TopBar />
      <div className="app-shell-content">{children}</div>
      <MobileNav />
    </div>
  );
}
