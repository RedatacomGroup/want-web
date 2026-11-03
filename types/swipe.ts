import type { FeedStats, FeedSurface } from "@/types/feed";
export type SwipeDecision = "want" | "pass";
export interface SwipeInput { desireId:string; decision:SwipeDecision; surface:FeedSurface; sessionKey:string|null; }
export interface SwipeResponse { success:true; swipe:{id:string;desireId:string;decision:SwipeDecision;surface:string;createdAt:string;updatedAt:string}; desire:{id:string;title:string;stats:FeedStats}; creator:{userId:string;username:string;totalWantsGenerated:number}; requestId?:string; }
