"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { AuthGuard } from "@/components/layout/AuthGuard";
import { useAuth } from "@/hooks/useAuth";
import { profileApi } from "@/lib/profile";
import { ApiError } from "@/lib/api";

import type {
  AgeBand,
  Interest,
  OnboardingInput,
} from "@/types/user";

const COLORS = [
  "black",
  "white",
  "red",
  "pink",
  "purple",
  "blue",
  "green",
  "orange",
  "gold",
  "silver",
];

const AGE_BANDS: AgeBand[] = [
  "18-24",
  "25-34",
  "35-44",
  "45-54",
  "55-64",
  "65+",
];

type OnboardingForm = {
  displayName: string;
  ageBand: AgeBand | "";
  countryCode: string;
  region: string;
  city: string;
  bio: string;
};

export default function OnboardingPage() {
  const router = useRouter();

  const {
    user,
    refreshUser,
  } = useAuth();

  const [interests, setInterests] = useState<
    Interest[]
  >([]);

  const [selected, setSelected] = useState<
    string[]
  >([]);

  const [colors, setColors] = useState<
    string[]
  >([]);

  const [form, setForm] =
    useState<OnboardingForm>({
      displayName:
        user?.displayName || "",

      ageBand:
        user?.ageBand || "",

      countryCode:
        user?.countryCode || "",

      region:
        user?.region || "",

      city:
        user?.city || "",

      bio:
        user?.bio || "",
    });

  const [error, setError] =
    useState("");

  const [busy, setBusy] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let active = true;

    profileApi
      .interests()
      .then((response) => {
        if (active) {
          setInterests(
            response.interests,
          );
        }
      })
      .catch(() => {
        if (active) {
          setError(
            "Could not load interests.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const valid = useMemo(
    () =>
      Boolean(
        form.displayName.trim() &&
          form.ageBand &&
          form.countryCode.trim()
            .length === 2 &&
          selected.length,
      ),
    [
      form.displayName,
      form.ageBand,
      form.countryCode,
      selected.length,
    ],
  );

  function toggle(
    current: string[],
    value: string,
    setter: (
      values: string[],
    ) => void,
  ) {
    setter(
      current.includes(value)
        ? current.filter(
            (item) =>
              item !== value,
          )
        : [...current, value],
    );
  }

  async function submit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!valid || !form.ageBand) {
      return;
    }

    setBusy(true);
    setError("");

    try {
      const payload: OnboardingInput =
        {
          displayName:
            form.displayName.trim(),

          ageBand:
            form.ageBand,

          countryCode:
            form.countryCode
              .trim()
              .toUpperCase(),

          region:
            form.region.trim() ||
            undefined,

          city:
            form.city.trim() ||
            undefined,

          bio:
            form.bio.trim() ||
            undefined,

          favoriteColors:
            colors,

          interests:
            selected,
        };

      await profileApi.onboarding(
        payload,
      );

      await refreshUser();

      router.replace("/feed");
    } catch (caught) {
      setError(
        caught instanceof ApiError
          ? caught.message
          : "Could not finish onboarding.",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthGuard>
      <main className="onboard-shell">
        <form
          className="onboard-card"
          onSubmit={submit}
        >
          <span className="eyebrow">
            BUILD YOUR SIGNAL
          </span>

          <h1 className="onboard-title">
            What pulls you in?
          </h1>

          <p>
            Give WANT enough context
            to start shaping your feed.
            Your actual Wants will
            refine it from here.
          </p>

          <div className="onboard-grid">
            <label
              htmlFor="onboarding-display-name"
            >
              Display name

              <input
                id="onboarding-display-name"
                name="displayName"
                type="text"
                autoComplete="name"
                value={
                  form.displayName
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      displayName:
                        event.target
                          .value,
                    }),
                  )
                }
                maxLength={60}
                required
              />
            </label>

            <label
              htmlFor="onboarding-age-band"
            >
              Age band

              <select
                id="onboarding-age-band"
                name="ageBand"
                value={
                  form.ageBand
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      ageBand:
                        event.target
                          .value as
                          | AgeBand
                          | "",
                    }),
                  )
                }
                required
              >
                <option value="">
                  Select age band
                </option>

                {AGE_BANDS.map(
                  (ageBand) => (
                    <option
                      key={ageBand}
                      value={ageBand}
                    >
                      {ageBand}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label
              htmlFor="onboarding-country"
            >
              Country code

              <input
                id="onboarding-country"
                name="countryCode"
                type="text"
                autoComplete="country"
                placeholder="ZA"
                maxLength={2}
                value={
                  form.countryCode
                }
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      countryCode:
                        event.target
                          .value,
                    }),
                  )
                }
                required
              />
            </label>

            <label
              htmlFor="onboarding-region"
            >
              Region

              <input
                id="onboarding-region"
                name="region"
                type="text"
                autoComplete="address-level1"
                placeholder="Gauteng"
                value={form.region}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      region:
                        event.target
                          .value,
                    }),
                  )
                }
                maxLength={100}
              />
            </label>

            <label
              htmlFor="onboarding-city"
            >
              City

              <input
                id="onboarding-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                placeholder="Johannesburg"
                value={form.city}
                onChange={(event) =>
                  setForm(
                    (current) => ({
                      ...current,
                      city:
                        event.target
                          .value,
                    }),
                  )
                }
                maxLength={100}
              />
            </label>
          </div>

          <label
            className="wide-label"
            htmlFor="onboarding-bio"
          >
            Bio

            <textarea
              id="onboarding-bio"
              name="bio"
              autoComplete="off"
              maxLength={240}
              value={form.bio}
              onChange={(event) =>
                setForm(
                  (current) => ({
                    ...current,
                    bio:
                      event.target
                        .value,
                  }),
                )
              }
            />

            <small>
              {form.bio.length}/240
            </small>
          </label>

          <section>
            <div className="section-line">
              <h2>Interests</h2>

              <span>
                {selected.length} selected
              </span>
            </div>

            <div className="chip-grid">
              {loading ? (
                <span>
                  Loading…
                </span>
              ) : (
                interests.map(
                  (interest) => (
                    <button
                      type="button"
                      key={
                        interest.slug
                      }
                      className={`choice-chip ${
                        selected.includes(
                          interest.slug,
                        )
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggle(
                          selected,
                          interest.slug,
                          setSelected,
                        )
                      }
                    >
                      {interest.name}
                    </button>
                  ),
                )
              )}
            </div>
          </section>

          <section>
            <div className="section-line">
              <h2>
                Colour signals
              </h2>

              <span>Optional</span>
            </div>

            <div className="chip-grid">
              {COLORS.map(
                (color) => (
                  <button
                    type="button"
                    key={color}
                    className={`choice-chip ${
                      colors.includes(
                        color,
                      )
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      toggle(
                        colors,
                        color,
                        setColors,
                      )
                    }
                  >
                    {color}
                  </button>
                ),
              )}
            </div>
          </section>

          {error && (
            <p
              className="form-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button onboard-submit"
            disabled={
              !valid || busy
            }
          >
            {busy
              ? "Building profile…"
              : "Enter WANT"}
          </button>
        </form>
      </main>
    </AuthGuard>
  );
}