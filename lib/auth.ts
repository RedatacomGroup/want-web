import { api } from "@/lib/api";
import { authStorage } from "@/lib/auth-storage";
import type {
  AuthResponse,
  CurrentUserResponse,
  LoginInput,
  RegisterInput,
  UsernameAvailabilityResponse,
} from "@/types/auth";
import type { User } from "@/types/user";

function persistAuth(response: AuthResponse): User {
  authStorage.set({ accessToken: response.accessToken, refreshToken: response.refreshToken });
  return response.user;
}

export const authApi = {
  async login(input: LoginInput): Promise<User> {
    return persistAuth(await api.post<AuthResponse>("auth/login", input, { auth: false }));
  },
  async register(input: RegisterInput): Promise<User> {
    return persistAuth(await api.post<AuthResponse>("auth/register", input, { auth: false }));
  },
  async usernameAvailability(username: string): Promise<UsernameAvailabilityResponse> {
    return api.get<UsernameAvailabilityResponse>(
      `auth/username-availability?username=${encodeURIComponent(username)}`,
      { auth: false },
    );
  },
  async me(): Promise<User> {
    const response = await api.get<CurrentUserResponse>("auth/me");
    return response.user;
  },
  logout() { authStorage.clear(); },
};
