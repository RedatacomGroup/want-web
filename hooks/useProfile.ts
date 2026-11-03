"use client";
import { useCallback, useState } from "react";
import { profileApi } from "@/lib/profile";
import type { OnboardingInput, ProfileUpdateInput, User } from "@/types/user";
export function useProfile(){const [profile,setProfile]=useState<User|null>(null);const [isLoading,setIsLoading]=useState(false);const load=useCallback(async()=>{setIsLoading(true);try{const v=await profileApi.me();setProfile(v);return v}finally{setIsLoading(false)}},[]);const onboard=useCallback(async(input:OnboardingInput)=>{setIsLoading(true);try{const v=await profileApi.onboarding(input);setProfile(v);return v}finally{setIsLoading(false)}},[]);const update=useCallback(async(input:ProfileUpdateInput)=>{setIsLoading(true);try{const v=await profileApi.update(input);setProfile(v);return v}finally{setIsLoading(false)}},[]);return{profile,isLoading,load,onboard,update}}
