import Link from "next/link";

export default function NotFound() {
  return <main className="shell"><section className="hero-card"><span className="eyebrow">404</span><h1>Not found.</h1><Link className="button" href="/">Return home</Link></section></main>;
}
