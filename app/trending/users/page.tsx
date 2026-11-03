"use client";

import { useEffect, useState } from "react";

import { TrendingTabs } from "@/components/trending/TrendingTabs";
import { TastemakerRow } from "@/components/trending/TastemakerRow";
import { leaderboardApi } from "@/lib/leaderboards";

import type { Tastemaker } from "@/types/leaderboard";

export default function TrendingUsersPage() {
  const [mode, setMode] = useState<"hot" | "global">("hot");
  const [items, setItems] = useState<Tastemaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function changeMode(nextMode: "hot" | "global") {
    if (nextMode === mode) {
      return;
    }

    setLoading(true);
    setError("");
    setMode(nextMode);
  }

  useEffect(() => {
    let active = true;

    Promise.resolve().then(async () => {
      try {
        const response =
          mode === "hot"
            ? await leaderboardApi.hot(7)
            : await leaderboardApi.global();

        if (!active) {
          return;
        }

        setItems(response.items);
      } catch (caught) {
        if (!active) {
          return;
        }

        setError(
          caught instanceof Error
            ? caught.message
            : "Could not load tastemakers.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    });

    return () => {
      active = false;
    };
  }, [mode]);

  return (
    <main className="trending-shell">
      <h1 className="trending-page-title">
        Tastemakers.
      </h1>

      <TrendingTabs active="/trending/users" />

      <div className="window-tabs">
        <button
          type="button"
          className={mode === "hot" ? "active" : ""}
          onClick={() => changeMode("hot")}
        >
          Hot now
        </button>

        <button
          type="button"
          className={mode === "global" ? "active" : ""}
          onClick={() => changeMode("global")}
        >
          All time
        </button>
      </div>

      {error && (
        <p className="trending-error" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="trending-loading" />
      ) : (
        <div className="tastemaker-list">
          {items.map((user) => (
            <TastemakerRow
              key={user.userId}
              user={user}
            />
          ))}
        </div>
      )}
    </main>
  );
}