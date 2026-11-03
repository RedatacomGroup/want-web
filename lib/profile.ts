import { api } from "@/lib/api";
import type { InterestsResponse, OnboardingInput, ProfileUpdateInput, PublicProfileResponse, User, UserResponse } from "@/types/user";
export const profileApi = {
  interests: () => api.get<InterestsResponse>("users/interests", { auth: false }),
  me: async (): Promise<User> => (await api.get<UserResponse>("users/me")).user,
  onboarding: async (input: OnboardingInput): Promise<User> => (await api.post<UserResponse>("users/me/onboarding", input)).user,
  update: async (input: ProfileUpdateInput): Promise<User> => (await api.patch<UserResponse>("users/me", input)).user,
  updateAvatar: async (file: File): Promise<User> => {
    const form = new FormData();
    form.append("image", file);
    return (await api.patch<UserResponse>("users/me/avatar", form)).user;
  },
  publicProfile: async (username: string) => (await api.get<PublicProfileResponse>(`users/${encodeURIComponent(username)}`, { auth: false })).profile,
};
