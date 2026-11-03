import type{Badge}from"@/types/badge";
export function BadgeShareCard({badge}:{badge:Badge}){return <section className="badge-share-card"><span>WANT</span><div className="badge-share-icon">✦</div><strong>{badge.name}</strong><small>{badge.rarity} badge</small></section>}
