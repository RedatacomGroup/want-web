import type { ApiMeta } from "./api";
import type { User } from "./user";

export interface AuthTokens { accessToken: string; refreshToken?: string; }
export interface LoginInput { identifier: string; password: string; }
export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  ageBand: "18-24" | "25-34" | "35-44" | "45-54" | "55-64" | "65+";
  countryCode?: string;
  interests?: string[];
  favoriteColors?: string[];
}
export interface UsernameAvailabilityResponse extends ApiMeta {
  success: true;
  username: string;
  available: boolean;
  valid: boolean;
  message: string;
}
export interface AuthResponse extends ApiMeta, AuthTokens { success: true; user: User; }
export interface RefreshResponse extends ApiMeta, AuthTokens { success: true; }
export interface CurrentUserResponse extends ApiMeta { success: true; user: User; }
export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login(input: LoginInput): Promise<User>;
  register(input: RegisterInput): Promise<User>;
  logout(): void;
  refreshUser(): Promise<User | null>;
}
