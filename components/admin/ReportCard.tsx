"use client";

import Link from "next/link";
import { useState } from "react";
import type { AdminReport, ReportStatus } from "@/types/admin";

type Props = {
  report: AdminReport;
  busy: boolean;
  onDecide: (id: string, status: ReportStatus, resolution: string) => void;
  onTerminate: (report: AdminReport, reason: string) => void;
};

export function ReportCard({ report, busy, onDecide, onTerminate }: Props) {
  const [resolution, setResolution] = useState(report.resolution || "");
  const [terminating, setTerminating] = useState(false);
  const [terminationReason, setTerminationReason] = useState("");
  const canTerminate = Boolean(
    report.reported_user_id && report.reported_user_status !== "suspended" && report.reported_user_status !== "deleted",
  );

  return (
    <article className="admin-card report-card">
      <header>
        <span className={`admin-status status-${report.status}`}>{report.status}</span>
        <small>{new Date(report.created_at).toLocaleString()}</small>
      </header>

      <h3>{report.reason}</h3>
      <p>{report.details || "No additional details."}</p>

      <dl>
        <div><dt>Reporter</dt><dd>@{report.reporter_username}</dd></div>
        <div>
          <dt>Target</dt>
          <dd>
            {report.desire_title
              ? `Desire: ${report.desire_title}`
              : report.reported_username
                ? `User: @${report.reported_username}`
                : "Unknown"}
          </dd>
        </div>
        {report.reported_username && (
          <div>
            <dt>Responsible account</dt>
            <dd>
              <Link href={`/u/${report.reported_username}`}>@{report.reported_username}</Link>
              {report.reported_user_status ? ` · ${report.reported_user_status}` : ""}
            </dd>
          </div>
        )}
      </dl>

      <textarea
        name="resolution"
        value={resolution}
        maxLength={1000}
        onChange={(event) => setResolution(event.target.value)}
        placeholder="Resolution or review notes"
      />

      <div className="admin-actions">
        <button disabled={busy} onClick={() => onDecide(report.id, "reviewing", resolution)}>Reviewing</button>
        <button disabled={busy} onClick={() => onDecide(report.id, "resolved", resolution)}>Resolve</button>
        <button disabled={busy} onClick={() => onDecide(report.id, "dismissed", resolution)}>Dismiss</button>
        {canTerminate && (
          <button disabled={busy} className="danger" onClick={() => setTerminating(true)}>Terminate account</button>
        )}
      </div>

      {terminating && (
        <div className="admin-enforcement-panel report-enforcement-panel">
          <strong>Terminate @{report.reported_username}?</strong>
          <p>This resolves this report, revokes the user&apos;s sessions and removes their visible desires.</p>
          <textarea
            name="terminationReason"
            value={terminationReason}
            maxLength={1000}
            onChange={(event) => setTerminationReason(event.target.value)}
            placeholder="Required enforcement reason"
            autoFocus
          />
          <div className="admin-actions">
            <button type="button" disabled={busy} onClick={() => { setTerminating(false); setTerminationReason(""); }}>Cancel</button>
            <button
              type="button"
              className="danger"
              disabled={busy || terminationReason.trim().length < 8}
              onClick={() => onTerminate(report, terminationReason.trim())}
            >
              {busy ? "Terminating…" : "Confirm termination"}
            </button>
          </div>
        </div>
      )}

      {!canTerminate && report.reported_user_id && (
        <p className="admin-enforcement-note">Account is already {report.reported_user_status || "unavailable"}.</p>
      )}
    </article>
  );
}
