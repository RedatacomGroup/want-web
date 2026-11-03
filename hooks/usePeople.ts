"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { socialApi } from "@/lib/social";
import type { SocialPerson } from "@/types/social";
export function usePeople(){
  const[pinned,setPinned]=useState<SocialPerson[]>([]);const[results,setResults]=useState<SocialPerson[]>([]);
  const[query,setQuery]=useState("");const[loadingPins,setLoadingPins]=useState(true);const[searching,setSearching]=useState(false);const[error,setError]=useState("");const generation=useRef(0);
  const loadPins=useCallback(async()=>{setLoadingPins(true);try{setPinned(await socialApi.pins())}catch(e){setError(e instanceof Error?e.message:"Could not load pinned people.")}finally{setLoadingPins(false)}},[]);
  useEffect(()=>{Promise.resolve().then(()=>void loadPins())},[loadPins]);
  const search=useCallback(async(value:string)=>{const clean=value.trim();setQuery(value);const current=++generation.current;if(clean.length<2){setResults([]);setSearching(false);return}setSearching(true);setError("");try{const people=await socialApi.search(clean);if(current===generation.current)setResults(people)}catch(e){if(current===generation.current)setError(e instanceof Error?e.message:"Could not search people.")}finally{if(current===generation.current)setSearching(false)}},[]);
  const updatePerson=useCallback((userId:string,isPinned:boolean,pinnedAt:string|null=null)=>{const update=(person:SocialPerson)=>person.userId===userId?{...person,isPinned,pinnedAt}:person;setResults(current=>current.map(update));if(!isPinned)setPinned(current=>current.filter(p=>p.userId!==userId))},[]);
  const pin=useCallback(async(person:SocialPerson)=>{const state=await socialApi.pin(person.userId);updatePerson(person.userId,true,state.pinnedAt||null);setPinned(current=>current.some(p=>p.userId===person.userId)?current:[{...person,isPinned:true,pinnedAt:state.pinnedAt||null},...current])},[updatePerson]);
  const unpin=useCallback(async(person:SocialPerson)=>{await socialApi.unpin(person.userId);updatePerson(person.userId,false)},[updatePerson]);
  return{query,results,pinned,loadingPins,searching,error,search,pin,unpin,reloadPins:loadPins};
}
