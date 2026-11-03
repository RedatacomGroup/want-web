"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/hooks/useAuth";
import { ApiError } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const search = useSearchParams();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const user = await login({
        identifier: identifier.trim(),
        password,
      });

      router.replace(
        search.get("next") ||
          (user.onboardingComplete === false ? "/onboarding" : "/feed"),
      );
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : "Unable to sign in.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard
      eyebrow="Welcome Back"
      title="Post Desires."
      subtitle="Generate wants. What pulls you in?"
      footer={{
        text: "New here?",
        href: "/register",
        label: "Create an account",
      }}
    >
      <form className="auth-form" onSubmit={submit}>
        <label htmlFor="login-identifier">
          Username or Email
          <input
            id="login-identifier"
            name="identifier"
            type="text"
            autoComplete="username"
            value={identifier}
            onChange={(event) => setIdentifier(event.target.value)}
            required
            autoFocus
          />
        </label>

        <label htmlFor="login-password">
          <span className="login-password-label">
            <span>Password</span>
            
          </span>

          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            maxLength={72}
          />
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="button auth-submit"
          disabled={busy || !identifier.trim() || !password}
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>

        <Link href="/forgot-password" className="forgot-password-link">
              Recover password
            </Link>
      </form>
    </AuthCard>
  );
}
