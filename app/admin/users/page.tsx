"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { UserModerationRow } from "@/components/admin/UserModerationRow";
import { adminApi } from "@/lib/admin";
import type { AdminUser, UserEnforcementAction } from "@/types/admin";

export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      try {
        const response = await adminApi.users();
        if (active) setItems(response.items);
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : "Could not load users.");
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  async function enforce(userId: string, action: UserEnforcementAction, reason: string) {
    setBusy(userId);
    setError("");
    setMessage("");
    try {
      const response = await adminApi.enforceUser(userId, { action, reason });
      setItems((current) => current.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: response.user.status,
              latest_moderation_action: action === "terminate" ? "suspend" : "unsuspend",
              latest_moderation_reason: reason,
              latest_moderation_at: response.user.updated_at,
            }
          : user,
      ));
      setMessage(action === "terminate" ? `@${response.user.username} was terminated.` : `@${response.user.username} was reactivated.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not enforce account action.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminGuard>
      <header className="admin-page-head">
        <div><h1>Users.</h1><span>Accounts with report signals first</span></div>
        <span className="admin-enforcement-badge">Immediate enforcement enabled</span>
      </header>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {message && <p className="admin-success" role="status">{message}</p>}
      {loading ? <div className="admin-loading" /> : (
        <section className="admin-list">
          {items.map((user) => (
            <UserModerationRow key={user.id} user={user} busy={busy === user.id} onEnforce={(...args) => void enforce(...args)} />
          ))}
        </section>
      )}
    </AdminGuard>
  );
}
