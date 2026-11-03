"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/hooks/useAuth";
import { authApi } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import type { RegisterInput } from "@/types/auth";

type Availability = "idle" | "invalid" | "checking" | "available" | "taken" | "error";
const USERNAME_REGEX = /^[A-Za-z0-9_]{3,30}$/;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const generation = useRef(0);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    ageBand: "" as RegisterInput["ageBand"] | "",
  });
  const [availability, setAvailability] = useState<Availability>("idle");
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const username = form.username.trim();
    const current = ++generation.current;

    if (!username) {
      Promise.resolve().then(() => {
        if (current === generation.current) {
          setAvailability("idle");
          setAvailabilityMessage("");
        }
      });
      return;
    }

    if (!USERNAME_REGEX.test(username)) {
      Promise.resolve().then(() => {
        if (current === generation.current) {
          setAvailability("invalid");
          setAvailabilityMessage("Use 3-30 letters, numbers, or underscores.");
        }
      });
      return;
    }

    const timer = window.setTimeout(async () => {
      setAvailability("checking");
      setAvailabilityMessage(`Checking @${username}…`);

      try {
        const result = await authApi.usernameAvailability(username);
        if (current !== generation.current) return;
        setAvailability(result.available ? "available" : "taken");
        setAvailabilityMessage(result.message);
      } catch {
        if (current !== generation.current) return;
        setAvailability("error");
        setAvailabilityMessage("Could not check this username. Try again.");
      }
    }, 450);

    return () => window.clearTimeout(timer);
  }, [form.username]);

  function field(key: keyof typeof form) {
    return (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((current) => ({ ...current, [key]: event.target.value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (availability !== "available") {
      setError("Choose an available username before creating your account.");
      return;
    }

    if (!form.ageBand) {
      setError("Select your age band.");
      return;
    }

    setBusy(true);
    try {
      await register({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
        ageBand: form.ageBand,
      });
      router.replace("/onboarding");
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Unable to create your account.");
    } finally {
      setBusy(false);
    }
  }

  const canSubmit =
    !busy &&
    availability === "available" &&
    Boolean(form.ageBand) &&
    Boolean(form.email.trim()) &&
    form.password.length >= 8;

  return (
    <AuthCard
      eyebrow="JOIN WANT"
      title="Show us your taste."
      subtitle="Create your identity first. We will build the desire profile from what you actually want."
      footer={{ text: "Already have an account?", href: "/login", label: "Sign in" }}
    >
      <form className="auth-form" onSubmit={submit}>
        <label htmlFor="register-username">
          Username
          <input
            id="register-username"
            name="username"
            autoComplete="username"
            value={form.username}
            onChange={field("username")}
            required
            minLength={3}
            maxLength={30}
            pattern="[A-Za-z0-9_]{3,30}"
            aria-describedby="username-availability"
          />
          <span
            id="username-availability"
            className={`username-availability ${availability}`}
            role="status"
            aria-live="polite"
          >
            {availabilityMessage}
          </span>
        </label>

        <label htmlFor="register-email">
          Email
          <input
            id="register-email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={field("email")}
            required
          />
        </label>

        <label htmlFor="register-age-band">
          Age band
          <select
            id="register-age-band"
            name="ageBand"
            value={form.ageBand}
            onChange={field("ageBand")}
            required
          >
            <option value="">Select age band</option>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-44">35-44</option>
            <option value="45-54">45-54</option>
            <option value="55-64">55-64</option>
            <option value="65+">65+</option>
          </select>
        </label>

        <label htmlFor="register-password">
          Password
          <input
            id="register-password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={field("password")}
            required
            minLength={8}
          />
        </label>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="button auth-submit" disabled={!canSubmit}>
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
