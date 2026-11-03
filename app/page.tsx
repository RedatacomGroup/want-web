import Link from "next/link";

const signals = [
  { label: "Objects", value: "WANT", tone: "rose" },
  { label: "Places", value: "CRAVE", tone: "violet" },
  { label: "Experiences", value: "DESIRE", tone: "amber" },
];

const steps = [
  {
    number: "01",
    title: "Discover",
    copy: "Move through a visual world of objects, places, experiences and ideas that pull people in.",
  },
  {
    number: "02",
    title: "Signal",
    copy: "WANT what speaks to you. PASS what does not. Every decision sharpens your taste.",
  },
  {
    number: "03",
    title: "Become",
    copy: "Build a visible identity from your desires, taste signals, badges, streaks and influence.",
  },
];

const categories = [
  "Fashion",
  "Cars",
  "Travel",
  "Technology",
  "Sneakers",
  "Design",
  "Places",
  "Experiences",
];

export default function HomePage() {
  return (
    <main className="descrave-home">
      <div className="descrave-noise" aria-hidden="true" />
      <div className="descrave-orb descrave-orb-one" aria-hidden="true" />
      <div className="descrave-orb descrave-orb-two" aria-hidden="true" />

      <nav className="descrave-nav" aria-label="Main navigation">
        <Link href="/" className="descrave-brand" aria-label="DESCRAVE home">
          <span className="descrave-brand-mark">D</span>
          <span>
            <strong>DESCRAVE</strong>
            <small>DESIRE + CRAVE</small>
          </span>
        </Link>

        <div className="descrave-nav-actions">
          <Link href="/login" className="descrave-nav-link">
            Sign in
          </Link>
          <Link href="/register" className="descrave-button descrave-button-small">
            Enter DESCRAVE
          </Link>
        </div>
      </nav>

      <section className="descrave-hero">
        <div className="descrave-hero-copy">
          <span className="descrave-kicker">
            <span className="descrave-live-dot" /> A living map of desire
          </span>

          <h1>
            See it.
            <br />
            Feel it.
            <br />
            <em>WANT it.</em>
          </h1>

          <p className="descrave-hero-lead">
            Discover what pulls you in, signal what you want, and build an identity
            around the things you actually desire.
          </p>

          <div className="descrave-hero-actions">
            <Link href="/register" className="descrave-button descrave-button-primary">
              Start wanting <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/trending" className="descrave-button descrave-button-ghost">
              See what is trending
            </Link>
          </div>

          <div className="descrave-proof">
            <div className="descrave-proof-faces" aria-hidden="true">
              <span>W</span><span>D</span><span>C</span><span>+</span>
            </div>
            <p>
              <strong>Your taste is already there.</strong>
              <span>DESCRAVE makes it visible.</span>
            </p>
          </div>
        </div>

        <div className="descrave-hero-visual" aria-label="Preview of the DESCRAVE experience">
          <div className="descrave-visual-ring" aria-hidden="true" />

          <article className="descrave-desire-card descrave-card-main">
            <div className="descrave-card-image descrave-image-main">
              <span className="descrave-image-badge">TRENDING NOW</span>
              <div className="descrave-image-object" aria-hidden="true">
                <span className="descrave-object-glow" />
                <span className="descrave-object-body" />
              </div>
            </div>
            <div className="descrave-card-content">
              <span className="descrave-card-category">DESIGN · TECHNOLOGY</span>
              <h2>The object you cannot stop thinking about.</h2>
              <div className="descrave-card-meta">
                <span><i className="descrave-want-icon">W</i> 18.4K WANT</span>
                <span>82% want rate</span>
              </div>
            </div>
            <div className="descrave-card-controls" aria-hidden="true">
              <span className="descrave-pass-control">×</span>
              <span className="descrave-want-control">WANT</span>
            </div>
          </article>

          <article className="descrave-floating-card descrave-floating-one">
            <span className="descrave-floating-label">YOUR SIGNAL</span>
            <strong>Rare Taste</strong>
            <small>Top 8% this week</small>
          </article>

          <article className="descrave-floating-card descrave-floating-two">
            <span className="descrave-mini-avatar">S</span>
            <span><strong>12.8K</strong><small>Wants generated</small></span>
          </article>
        </div>
      </section>

      <section className="descrave-signal-strip" aria-label="DESCRAVE signals">
        {signals.map((signal) => (
          <div key={signal.label} className={`descrave-signal descrave-signal-${signal.tone}`}>
            <small>{signal.label}</small>
            <strong>{signal.value}</strong>
          </div>
        ))}
        <div className="descrave-signal-statement">
          <span>Followers show who is popular.</span>
          <strong>WANT shows what people desire.</strong>
        </div>
      </section>

      <section className="descrave-section descrave-intro-section">
        <div className="descrave-section-heading">
          <span className="descrave-section-number">THE EXPERIENCE</span>
          <h2>Your desire has a signal.</h2>
          <p>
            DESCRAVE turns instinct into identity. Every WANT and every PASS reveals
            more of what pulls you in.
          </p>
        </div>

        <div className="descrave-steps">
          {steps.map((step) => (
            <article key={step.number} className="descrave-step-card">
              <span>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.copy}</p>
              <i aria-hidden="true">↗</i>
            </article>
          ))}
        </div>
      </section>

      <section className="descrave-manifesto">
        <div className="descrave-manifesto-grid" aria-hidden="true" />
        <span className="descrave-section-number">WHAT DO YOU DESCRAVE?</span>
        <h2>
          Not everything is for you.
          <br />
          <em>That is the point.</em>
        </h2>
        <div className="descrave-category-cloud" aria-label="Popular desire categories">
          {categories.map((category, index) => (
            <span key={category} className={index % 3 === 0 ? "is-hot" : ""}>
              {category}
            </span>
          ))}
        </div>
      </section>

      <section className="descrave-section descrave-world-section">
        <div className="descrave-world-card">
          <div className="descrave-world-copy">
            <span className="descrave-section-number">WHAT THE WORLD WANTS</span>
            <h2>Desire moves.</h2>
            <p>
              Watch tastes rise across people, categories and countries. Find the
              tastemakers shaping what comes next.
            </p>
            <Link href="/trending" className="descrave-inline-link">
              Explore global signals <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="descrave-pulse-board" aria-hidden="true">
            <span className="descrave-pulse-line line-one" />
            <span className="descrave-pulse-line line-two" />
            <span className="descrave-pulse-line line-three" />
            <span className="descrave-pulse-node node-one">ZA</span>
            <span className="descrave-pulse-node node-two">UK</span>
            <span className="descrave-pulse-node node-three">US</span>
            <span className="descrave-pulse-node node-four">JP</span>
            <strong>DESIRE<br />PULSE</strong>
          </div>
        </div>
      </section>

      <section className="descrave-final-cta">
        <span className="descrave-section-number">YOUR IDENTITY IS WAITING</span>
        <h2>
          You already desire things.
          <br />
          <em>Now make it visible.</em>
        </h2>
        <p>Enter DESCRAVE. Build your taste. Show the world what you WANT.</p>
        <div className="descrave-hero-actions descrave-final-actions">
          <Link href="/register" className="descrave-button descrave-button-primary">
            Create your identity <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/login" className="descrave-button descrave-button-ghost">
            I already have one
          </Link>
        </div>
      </section>

      <footer className="descrave-footer">
        <Link href="/" className="descrave-brand">
          <span className="descrave-brand-mark">D</span>
          <span><strong>DESCRAVE</strong><small>DESIRE + CRAVE</small></span>
        </Link>
        <p>Discover. WANT. Become.</p>
        <div>
          <Link href="/login">Sign in</Link>
          <Link href="/register">Join</Link>
          <Link href="/trending">Trending</Link>
        </div>
      </footer>
    </main>
  );
}
