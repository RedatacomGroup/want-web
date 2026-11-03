"use client";
import { useCallback, useEffect, useState } from "react";
import { profileApi } from "@/lib/profile";
import type { PublicProfile } from "@/types/user";
export function usePublicProfile(username:string){const[profile,setProfile]=useState<PublicProfile|null>(null);const[isLoading,setIsLoading]=useState(true);const[error,setError]=useState("");const load=useCallback(async()=>{setIsLoading(true);setError("");try{const next=await profileApi.publicProfile(username);setProfile(next);return next}catch(e){setError(e instanceof Error?e.message:"Could not load profile.");return null}finally{setIsLoading(false)}},[username]);useEffect(()=>{let active=true;Promise.resolve().then(async()=>{try{const next=await profileApi.publicProfile(username);if(active)setProfile(next)}catch(e){if(active)setError(e instanceof Error?e.message:"Could not load profile.")}finally{if(active)setIsLoading(false)}});return()=>{active=false}},[username]);return{profile,isLoading,error,reload:load}}
