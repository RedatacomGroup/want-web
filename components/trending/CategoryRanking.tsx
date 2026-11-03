"use client";
import{FormEvent,useState}from"react";import{useRouter}from"next/navigation";
export function CategoryRanking(){const router=useRouter();const[slug,setSlug]=useState("automotive");function submit(e:FormEvent){e.preventDefault();if(slug.trim())router.push(`/trending/categories?slug=${encodeURIComponent(slug.trim().toLowerCase())}`)}return <form className="ranking-picker" onSubmit={submit}><label>Category slug<input value={slug} onChange={e=>setSlug(e.target.value)} /></label><button type="submit">View ranking</button></form>}
