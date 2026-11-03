"use client";
import{FormEvent,useState}from"react";import{useRouter}from"next/navigation";
export function CountryRanking(){const router=useRouter();const[code,setCode]=useState("ZA");function submit(e:FormEvent){e.preventDefault();if(/^[a-zA-Z]{2}$/.test(code))router.push(`/trending/countries?code=${code.toUpperCase()}`)}return <form className="ranking-picker" onSubmit={submit}><label>Country code<input value={code} maxLength={2} onChange={e=>setCode(e.target.value)} /></label><button type="submit">View ranking</button></form>}
