"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, api } from "@/lib/api";

interface ResetPasswordResponse {
  success: true;
  message: string;
  requestId?: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetToken, setResetToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
  let active = true;

  Promise.resolve().then(() => {
    if (!active) {
      return;
    }

    const token =
      sessionStorage.getItem(
        "want-password-reset-token",
      ) || "";

    const storedEmail =
      sessionStorage.getItem(
        "want-password-reset-email",
      ) || "";

    setResetToken(token);
    setEmail(storedEmail);
    setReady(true);
  });

  return () => {
    active = false;
  };
}, []);

  const passwordRule = useMemo(() => {
    if (!password) return "";
    if (password.length < 8) return "Use at least 8 characters.";
    if (!/[a-z]/.test(password)) return "Include a lowercase letter.";
    if (!/[A-Z]/.test(password)) return "Include an uppercase letter.";
    if (!/[0-9]/.test(password)) return "Include a number.";
    return "";
  }, [password]);

  const mismatch = Boolean(confirmPassword && password !== confirmPassword);
  const canSubmit = Boolean(resetToken && password && confirmPassword && !passwordRule && !mismatch && !busy);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setBusy(true);
    setError("");

    try {
      const response = await api.post<ResetPasswordResponse>(
        "auth/reset-password",
        { resetToken, newPassword: password },
        { auth: false },
      );

      sessionStorage.removeItem("want-password-reset-token");
      sessionStorage.removeItem("want-password-reset-email");
      setResetToken("");
      setPassword("");
      setConfirmPassword("");
      setSuccess(response.message);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Could not reset your password.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return <main className="auth-page"><section className="auth-card"><p>Loading…</p></section></main>;
  }

  if (!resetToken && !success) {
    return (
      <main className="auth-page">
        <section className="auth-card reset-password-card">
          <span className="eyebrow">DESCRAVE ACCOUNT SECURITY</span>
          <h1>Reset session expired.</h1>
          <p>Verify a new six-digit code before choosing a new password.</p>
          <Link className="button auth-submit" href="/forgot-password">Request a new code</Link>
          <Link className="auth-back-link reset-login-link" href="/login">Back to sign in</Link>
        </section>
      </main>
    );
  }

  if (success) {
    return (
      <main className="auth-page">
        <section className="auth-card reset-password-card">
          <span className="eyebrow">DESCRAVE ACCOUNT SECURITY</span>
          <div className="reset-success-mark" aria-hidden="true">✓</div>
          <h1>Password Change Complete</h1>
          <p>{success}</p>
          <button type="button" className="button auth-submit" onClick={() => router.replace("/login")}>Sign in</button>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card reset-password-card">
        <Link href="/login" className="auth-back-link">←</Link>
        <span className="eyebrow">DESCRAVE ACCOUNT SECURITY</span>
        <h1>Set a new password</h1>
        <p>{email ? ` ${email}` : "Your verification code was accepted."}</p>

        <form className="auth-form" onSubmit={submit}>
          <label htmlFor="new-password">
            New password
            <input
              id="new-password"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={8}
              maxLength={72}
              required
              autoFocus
            />
            <small>At least 8 characters with uppercase, lowercase and a number.</small>
          </label>

          {passwordRule && <p className="password-hint invalid">{passwordRule}</p>}

          <label htmlFor="confirm-new-password">
            Confirm new password
            <input
              id="confirm-new-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              minLength={8}
              maxLength={72}
              required
            />
          </label>

          {mismatch && <p className="password-hint invalid">Passwords do not match.</p>}
          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="button auth-submit" disabled={!canSubmit}>
            {busy ? "Changing password…" : "Change password"}
          </button>
        </form>
      </section>
    </main>
  );
}
