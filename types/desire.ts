export interface DesireCategory { id?: string; slug: string; name: string; iconKey?: string | null; }
export interface DesireCreator { userId: string; username: string; displayName: string | null; profileImageUrl: string | null; }
export interface DesireImage { id: string; url: string; thumbnailUrl: string | null; mimeType: string; width: number | null; height: number | null; bytes: number | null; altText: string | null; }
export interface DesireStats { wants: number; passes: number; impressions: number; uniqueViewers: number; shares: number; trendingScore: number; breakoutScore: number; }
export interface Desire { id: string; creator: DesireCreator; category: DesireCategory; title: string; caption: string | null; brandName: string | null; productName: string | null; sourceUrl: string | null; countryCode: string | null; status: "pending" | "published" | "removed" | string; image: DesireImage | null; stats: DesireStats; publishedAt: string | null; createdAt: string; updatedAt: string; }
export interface CreateDesireInput { image: File; categorySlug: string; title: string; caption?: string; brandName?: string; productName?: string; sourceUrl?: string; altText?: string; tags: string[]; }
export interface CreateDesireResponse { success: true; desire: Desire; requestId?: string; }
