"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useNotificationCount } from "@/hooks/useNotificationCount";

const active = (pathname: string, href: string) =>
  pathname === href || (href !== "/feed" && pathname.startsWith(`${href}/`));

const links = [
  { href: "/feed", label: "Home", icon: "⌂" },
  { href: "/people", label: "Search", icon: "◇" },
  { href: "/create", label: "Post", icon: "+" },
  { href: "/notifications", label: "Alerts", icon: "●" },
  { href: "/profile", label: "Me", icon: "○" },
];

export function MobileNav() {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { count } = useNotificationCount();

  if (isLoading || !isAuthenticated) return null;

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      {links.map((item) => (
        <Link key={item.href} href={item.href} className={active(pathname, item.href) ? "active" : ""}>
          <span className={`mobile-nav-icon ${item.href === "/create" ? "create" : ""}`} aria-hidden="true">
            {item.icon}
            {item.href === "/notifications" && count > 0 && <i>{count > 9 ? "9+" : count}</i>}
          </span>
          <small>{item.label}</small>
        </Link>
      ))}
    </nav>
  );
}
