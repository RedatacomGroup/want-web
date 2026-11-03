export type FeedSurface =
  | "home"
  | "people"
  | "fresh"
  | "local"
  | "category"
  | "trending"
  | "profile"
  | "detail";

export interface FeedBadge { code: string; name: string; iconKey: string | null; }
export interface FeedCreator { userId:string; username:string; displayName:string|null; profileImageUrl:string|null; totalWantsGenerated:number; equippedBadge:FeedBadge|null; }
export interface FeedCategory { id:string; slug:string; name:string; }
export interface FeedImage { url:string; thumbnailUrl:string|null; mimeType:string|null; altText:string|null; }
export interface FeedStats { wants:number; passes:number; impressions:number; shares:number; wantRate:number; }
export interface FeedItem { id:string; creator:FeedCreator; category:FeedCategory; title:string; caption:string|null; brandName:string|null; productName:string|null; sourceUrl:string|null; countryCode:string|null; image:FeedImage|null; stats:FeedStats; viewerDecision:"want"|"pass"|null; publishedAt:string|null; }
export interface FeedPayload { sessionKey:string; surface:FeedSurface|string; countryCode?:string; items:FeedItem[]; hasMore:boolean; }
export interface FeedResponse { success:true; feed:FeedPayload; requestId?:string; }
