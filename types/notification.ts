export type NotificationType = "badge_unlocked" | "desire_milestone" | "desire_trending" | "rank_changed" | "moderation" | "system";
export interface WantNotification { id:string; type:NotificationType; title:string; body:string; data:Record<string,unknown>; read:boolean; readAt:string|null; createdAt:string; }
export interface NotificationPagination { limit:number; offset:number; returned:number; hasMore:boolean; }
export interface NotificationListResponse { success:true; notifications:{items:WantNotification[];pagination:NotificationPagination}; requestId?:string; }
export interface UnreadCountResponse { success:true; unreadCount:number; requestId?:string; }
export interface NotificationResponse { success:true; notification:WantNotification; requestId?:string; }
export interface NotificationPreferences { badgeUnlocked:boolean; desireMilestone:boolean; desireTrending:boolean; rankChanged:boolean; system:boolean; updatedAt:string; }
export interface NotificationPreferencesResponse { success:true; preferences:NotificationPreferences; requestId?:string; }
export interface NotificationListQuery { limit?:number;offset?:number;unread?:boolean|null;type?:NotificationType|null; }
