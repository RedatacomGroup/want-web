"use client";

import { useEffect, useState } from "react";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { ReportCard } from "@/components/admin/ReportCard";
import { adminApi } from "@/lib/admin";
import type { AdminReport, ReportStatus } from "@/types/admin";

export default function ReportsPage() {
  const [status, setStatus] = useState("open");
  const [items, setItems] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      try {
        const response = await adminApi.reports(status);
        if (active) setItems(response.items);
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : "Could not load reports.");
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; };
  }, [status]);

  function change(next: string) {
    setLoading(true);
    setError("");
    setMessage("");
    setStatus(next);
  }

  async function decide(id: string, next: ReportStatus, resolution: string) {
    setBusy(id);
    setError("");
    try {
      await adminApi.decideReport(id, { status: next, resolution: resolution || undefined });
      if (status === "all") {
        setItems((current) => current.map((item) => item.id === id ? { ...item, status: next, resolution } : item));
      } else {
        setItems((current) => current.filter((item) => item.id !== id));
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not update report.");
    } finally {
      setBusy(null);
    }
  }

  async function terminate(report: AdminReport, reason: string) {
    if (!report.reported_user_id) return;
    setBusy(report.id);
    setError("");
    setMessage("");
    try {
      await adminApi.enforceUser(report.reported_user_id, {
        action: "terminate",
        reason,
        reportId: report.id,
      });
      setItems((current) => current.filter((item) => item.id !== report.id));
      setMessage(`@${report.reported_username || "user"} was terminated and the report was resolved.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not terminate the reported account.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <AdminGuard>
      <header className="admin-page-head">
        <h1>Reports.</h1>
        <select value={status} onChange={(event) => change(event.target.value)}>
          <option value="open">Open</option>
          <option value="reviewing">Reviewing</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
          <option value="all">All</option>
        </select>
      </header>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {message && <p className="admin-success" role="status">{message}</p>}
      {loading ? <div className="admin-loading" /> : (
        <section className="report-grid">
          {items.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              busy={busy === report.id}
              onDecide={(...args) => void decide(...args)}
              onTerminate={(item, reason) => void terminate(item, reason)}
            />
          ))}
        </section>
      )}
    </AdminGuard>
  );
}
