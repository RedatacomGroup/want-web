"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError, api } from "@/lib/api";

interface ForgotPasswordResponse {
  success: true;
  message: string;
  requestId?: string;
}

interface VerifyResetCodeResponse {
  success: true;
  resetToken: string;
  expiresInMinutes: number;
  requestId?: string;
}

type Step = "email" | "code";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post<ForgotPasswordResponse>(
        "auth/forgot-password",
        { email: email.trim().toLowerCase() },
        { auth: false },
      );

      setMessage(response.message);
      setStep("code");
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Could not request a password reset code.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || code.length !== 6) return;

    setBusy(true);
    setError("");

    try {
      const response = await api.post<VerifyResetCodeResponse>(
        "auth/verify-reset-code",
        {
          email: email.trim().toLowerCase(),
          code,
        },
        { auth: false },
      );

      sessionStorage.setItem("want-password-reset-token", response.resetToken);
      sessionStorage.setItem("want-password-reset-email", email.trim().toLowerCase());
      router.push("/reset-password");
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Could not verify the reset code.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function resendCode() {
    if (busy) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await api.post<ForgotPasswordResponse>(
        "auth/forgot-password",
        { email: email.trim().toLowerCase() },
        { auth: false },
      );

      setCode("");
      setMessage(response.message);
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Could not send another reset code.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card forgot-password-card">
        <Link href="/login" className="auth-back-link">
          ←
        </Link>

        <span className="eyebrow">DESCRAVE ACCOUNT SECURITY</span>

        {step === "email" ? (
          <>
            <h1>Password Recovery</h1>
            <p>
              Enter the email connected to your account.We&apos;ll send a
              verification code if an account exists for it.
            </p>

            <form className="auth-form" onSubmit={requestCode}>
              <label htmlFor="forgot-email">
                Start Here
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="enter email address"
                  required
                />
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button
                type="submit"
                className="button auth-submit"
                disabled={busy || !email.trim()}
              >
                {busy ? "Sending code…" : "Send verification code"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Open your email</h1>
            <p>
              Enter the newest six-digit code sent for <strong>{email}</strong>.
            </p>

            {message && <p className="auth-success" role="status">{message}</p>}

            <form className="auth-form" onSubmit={verifyCode}>
              <label htmlFor="reset-code">
                Verification code
                <input
                  id="reset-code"
                  name="code"
                  type="text"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="------"
                  className="otp-input"
                  required
                  autoFocus
                />
              </label>

              {error && <p className="form-error" role="alert">{error}</p>}

              <button
                type="submit"
                className="button auth-submit"
                disabled={busy || code.length !== 6}
              >
                {busy ? "Verifying…" : "Verify code"}
              </button>

              <div className="forgot-password-secondary-actions">
                <button
                  type="button"
                  className="auth-text-button"
                  disabled={busy}
                  onClick={() => void resendCode()}
                >
                  Send a new code
                </button>

                <button
                  type="button"
                  className="auth-text-button"
                  disabled={busy}
                  onClick={() => {
                    setCode("");
                    setMessage("");
                    setError("");
                    setStep("email");
                  }}
                >
                  Use another email
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </main>
  );
}
