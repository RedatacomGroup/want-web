"use client";
import { useCallback, useState } from "react";
import { desireApi } from "@/lib/desires";
import type { CreateDesireInput, Desire } from "@/types/desire";
export function useCreateDesire(){const[isCreating,setIsCreating]=useState(false);const[error,setError]=useState("");const[created,setCreated]=useState<Desire|null>(null);const create=useCallback(async(input:CreateDesireInput)=>{setIsCreating(true);setError("");try{const desire=await desireApi.create(input);setCreated(desire);return desire}catch(e){setError(e instanceof Error?e.message:"Could not create desire.");throw e}finally{setIsCreating(false)}},[]);return{create,isCreating,error,created,clearError:()=>setError("")}}
