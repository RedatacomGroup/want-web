"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthGuard } from "@/components/layout/AuthGuard";
import { SwipeDeck } from "@/components/feed/SwipeDeck";
import { EmptyFeed } from "@/components/feed/EmptyFeed";
import { useFeed } from "@/hooks/useFeed";
import type { FeedSurface } from "@/types/feed";

const surfaces: [FeedSurface, string][] = [
  ["home", "  Global"],
  ["people", "Friends"],
  ["fresh", "New"],
  ["local", "Nearby"],
];

export default function FeedPage() {
  const [surface, setSurface] = useState<FeedSurface>("home");
  const { items, sessionKey, isLoading, isReplenishing, error, reload, replenish, removeTop } = useFeed(surface);

  return (
    <AuthGuard>
      <main className="feed-shell">
        <header className="feed-top">
          <div>
            <span className="feed-logo">DO YOU OWN OR DESIRE?</span>
            <p>{surface === "people" ? "From the people you've pinned." : "Generate Wants. Show Your Taste."}</p>
          </div>
          <nav className="feed-tabs" aria-label="Feed surface">
            {surfaces.map(([key, label]) => (
              <button key={key} type="button" className={surface === key ? "active" : ""} onClick={() => setSurface(key)}>
                {label}
              </button>
            ))}
          </nav>
        </header>

        {error && (
          <section className="feed-error">
            <p>{error}</p>
            <button className="button" onClick={() => void reload()}>Retry</button>
          </section>
        )}

        {isLoading ? (
          <div className="feed-loading"><div className="feed-loading-card" /></div>
        ) : items.length ? (
          <>
            <SwipeDeck
              items={items}
              surface={surface}
              sessionKey={sessionKey}
              onCommitted={removeTop}
              onLow={() => void replenish()}
            />
            {isReplenishing && <p className="feed-replenishing" role="status">Loading more desires…</p>}
          </>
        ) : !error && surface === "people" ? (
          <section className="people-feed-empty">
            <span className="eyebrow">YOUR PEOPLE FEED</span>
            <h2>Nothing here yet.</h2>
            <p>
  Pin people whose taste you want to keep close, or come back when someone you&apos;ve pinned posts something new.
</p>
            <div className="people-feed-empty-actions">
              <Link className="button" href="/people">Find people</Link>
              <button className="button secondary" type="button" onClick={() => void reload()}>Refresh</button>
            </div>
          </section>
        ) : !error ? (
          <EmptyFeed onRefresh={() => void reload()} />
        ) : null}
      </main>
    </AuthGuard>
  );
}
