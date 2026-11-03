import { env } from "@/lib/env";

export default function HomePage() {
  return (
    <main className="shell">
      <section className="hero-card">
        <span className="eyebrow">FOUNDATION READY</span>
        <h1>WANT</h1>
        <p>Fresh App Router foundation, typed environment, shared API client, and product-ready design tokens.</p>
        <div className="status-row">
          <span className="status-dot" />
          <span>API: {env.apiBaseUrl}{env.apiPrefix}</span>
        </div>
      </section>
    </main>
  );
}
