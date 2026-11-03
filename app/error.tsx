"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="shell">
      <section className="hero-card">
        <span className="eyebrow">SOMETHING WENT WRONG</span>
        <h1>Try again.</h1>
        <button className="button" onClick={reset}>Reload view</button>
      </section>
    </main>
  );
}
