import { api } from "@/lib/api";
import type { ProfileDesire, ProfileDesiresResponse, PublicStats, PublicStatsResponse } from "@/types/profileCompletion";
export const profileCompletionApi = {
  desires: async (username:string, limit=24, offset=0):Promise<ProfileDesire[]> =>
    (await api.get<ProfileDesiresResponse>(`users/${encodeURIComponent(username)}/desires?limit=${limit}&offset=${offset}`, { auth:false })).desires,
  stats: async (username:string):Promise<PublicStats> =>
    (await api.get<PublicStatsResponse>(`users/${encodeURIComponent(username)}/stats`, { auth:false })).stats,
};
