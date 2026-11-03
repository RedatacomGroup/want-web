import Link from "next/link";
export function AuthCard({ eyebrow, title, subtitle, footer, children }: { eyebrow: string; title: string; subtitle: string; footer: { text: string; href: string; label: string }; children: React.ReactNode }) {
  return <main className="auth-shell"><section className="auth-card"><Link href="/" className="brand">DESCRAVE</Link><span className="eyebrow">{eyebrow}</span><h1 className="auth-title">{title}</h1><p className="auth-copy">{subtitle}</p>{children}<p className="auth-footer">{footer.text} <Link href={footer.href}>{footer.label}</Link></p></section></main>;
}
