export type UserRole = "user" | "moderator" | "admin";

export interface Interest {
  id?: string;
  slug: string;
  name: string;
  category?: string;
  iconKey?: string | null;
  weight?: number;
  source?: string;
}

export interface User {
  id: string;
  username: string;
  email?: string;

  displayName: string | null;
  bio?: string | null;
  profileImageUrl: string | null;

  countryCode: string | null;
  region?: string | null;
  city?: string | null;

  ageBand?: AgeBand | null;
  favoriteColors?: string[];

  role?: UserRole;
  onboardingComplete?: boolean;
  createdAt?: string;
}

export interface InterestsResponse {
  success: true;
  interests: Interest[];
  requestId?: string;
}

export interface UserResponse {
  success: true;
  user: User;
  requestId?: string;
}

export type AgeBand =
  | "18-24"
  | "25-34"
  | "35-44"
  | "45-54"
  | "55-64"
  | "65+";

export interface OnboardingInput {
  displayName: string;
  ageBand: AgeBand;
  countryCode: string;
  region?: string;
  city?: string;
  favoriteColors: string[];
  interests: string[];
  bio?: string;
}

export interface ProfileUpdateInput {
  displayName?: string | null;
  bio?: string | null;
  profileImageUrl?: string | null;
  countryCode?: string | null;
  region?: string | null;
  city?: string | null;
  favoriteColors?: string[];
  profileVisibility?: "public" | "private";
  showCountry?: boolean;
}

export interface EquippedBadge {
  code: string;
  name: string;
  iconKey: string | null;
}

export interface PublicBadge {
  code: string;
  name: string;
  description: string;
  iconKey: string | null;
  iconUrl?: string | null;
  rarity: string;
  awardedAt?: string;
}

export interface PublicProfile {
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  profileImageUrl: string | null;

  countryCode: string | null;
  region: string | null;
  city: string | null;

  totalWantsGenerated: number;
  desiresPosted: number;
  profileViews: number;

  currentStreakDays: number;
  longestStreakDays: number;

  equippedBadge?: EquippedBadge | null;

  interests: Interest[];
  badges?: PublicBadge[];
}

export interface PublicProfileResponse {
  success: true;
  profile: PublicProfile;
  requestId?: string;
}