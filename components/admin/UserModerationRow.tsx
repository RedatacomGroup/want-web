"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { AdminUser, UserEnforcementAction } from "@/types/admin";

type Props = {
  user: AdminUser;
  busy: boolean;
  onEnforce: (userId: string, action: UserEnforcementAction, reason: string) => void;
};

export function UserModerationRow({ user, busy, onEnforce }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [reason, setReason] = useState("");
  const terminated = user.status === "suspended" || user.status === "deleted";
  const protectedAccount = Boolean(user.admin_role);
  const name = user.display_name || user.username;

  function cancel() {
    setConfirming(false);
    setReason("");
  }

  return (
    <article className={`admin-row admin-user-row ${terminated ? "is-terminated" : ""}`}>
      <div className="admin-user-identity">
        <span className="admin-user-avatar">
          {user.profile_image_url ? (
            <Image src={user.profile_image_url} alt="" fill sizes="48px" />
          ) : (
            name[0].toUpperCase()
          )}
        </span>

        <div>
          <Link href={`/u/${user.username}`}>
            <strong>{name}</strong>
          </Link>
          <small>@{user.username} · {user.email}</small>
        </div>
      </div>

      <span>{user.country_code || "—"}</span>
      <span>{user.desires_posted} desires</span>
      <span className={user.open_report_count > 0 ? "admin-report-signal" : ""}>
        {user.open_report_count} reports
      </span>

      <span className={`admin-account-status status-${user.status}`}>
        {protectedAccount ? user.admin_role : terminated ? "terminated" : user.status}
      </span>

      {!protectedAccount && !confirming && (
        <button
          type="button"
          disabled={busy}
          className={terminated ? "restore" : "danger"}
          onClick={() => setConfirming(true)}
        >
          {terminated ? "Reactivate" : "Terminate"}
        </button>
      )}

      {protectedAccount && <span className="admin-protected-label">Protected</span>}

      {confirming && (
        <div className="admin-enforcement-panel">
          <strong>{terminated ? `Reactivate @${user.username}?` : `Terminate @${user.username}?`}</strong>
          {!terminated && (
            <p>This immediately revokes sessions and removes the account&apos;s visible desires.</p>
          )}
          <label htmlFor={`reason-${user.id}`}>
            Reason
            <textarea
              id={`reason-${user.id}`}
              name="reason"
              value={reason}
              maxLength={1000}
              onChange={(event) => setReason(event.target.value)}
              placeholder={terminated ? "Reason for restoring account access" : "Describe the abuse or policy violation"}
              autoFocus
            />
          </label>
          <div className="admin-actions">
            <button type="button" disabled={busy} onClick={cancel}>Cancel</button>
            <button
              type="button"
              className={terminated ? "restore" : "danger"}
              disabled={busy || reason.trim().length < 8}
              onClick={() => onEnforce(user.id, terminated ? "reactivate" : "terminate", reason.trim())}
            >
              {busy ? "Applying…" : terminated ? "Reactivate account" : "Terminate account"}
            </button>
          </div>
        </div>
      )}

      {user.latest_moderation_action && (
        <small className="admin-latest-action">
          Latest: {user.latest_moderation_action}
          {user.latest_moderation_reason ? ` · ${user.latest_moderation_reason}` : ""}
        </small>
      )}
    </article>
  );
}
