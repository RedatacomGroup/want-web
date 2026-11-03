import { api } from "@/lib/api";
import type { PeopleResponse, PinResponse, SocialPerson, PinState } from "@/types/social";
export const socialApi = {
  search: async (query:string, limit=20, offset=0):Promise<SocialPerson[]> =>
    (await api.get<PeopleResponse>(`social/search?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`)).people,
  pins: async (limit=50, offset=0):Promise<SocialPerson[]> =>
    (await api.get<PeopleResponse>(`social/pins?limit=${limit}&offset=${offset}`)).people,
  status: async (userId:string):Promise<PinState> =>
    (await api.get<PinResponse>(`social/pins/${encodeURIComponent(userId)}`)).pin,
  pin: async (userId:string):Promise<PinState> =>
    (await api.post<PinResponse>(`social/pins/${encodeURIComponent(userId)}`, {})).pin,
  unpin: async (userId:string):Promise<PinState> =>
    (await api.delete<PinResponse>(`social/pins/${encodeURIComponent(userId)}`)).pin,
};
