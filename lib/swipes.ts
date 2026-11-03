import { api } from "@/lib/api";
import type { SwipeInput, SwipeResponse } from "@/types/swipe";
export const swipeApi={ decide:(input:SwipeInput)=>api.post<SwipeResponse>("swipes",input) };
