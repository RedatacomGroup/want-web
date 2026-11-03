import Image from "next/image";
import Link from "next/link";
import type { ProfileDesire } from "@/types/profileCompletion";
export function ProfileDesireGrid({items}:{items:ProfileDesire[]}) {
  if (!items.length) return <section className="profile-empty"><h2>No published desires yet.</h2><Link className="button" href="/create">Create your first desire</Link></section>;
  return <section className="profile-desire-grid">{items.map(item=><Link key={item.id} href={`/desire/${item.id}`} className="profile-desire"><div>{item.image_url&&<Image src={item.thumbnail_url||item.image_url} alt={item.title} fill sizes="(max-width:640px) 50vw, 25vw"/>}<span>{item.category_name}</span></div><h3>{item.title}</h3><p>{Number(item.want_count||0)} wants · {Math.round(Number(item.want_rate||0)*100)}%</p></Link>)}</section>;
}
