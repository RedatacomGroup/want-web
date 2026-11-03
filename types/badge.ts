export type BadgeRarity = "common" | "uncommon" | "rare" | "epic" | "legendary" | string;
export interface Badge { id:string; code:string; name:string; description:string; iconKey:string|null; iconUrl:string|null; rarity:BadgeRarity; ruleType:string; ruleConfig:Record<string,unknown>; sortOrder:number; earned:boolean; userBadgeId:string|null; awardedAt:string|null; awardReason:string|null; revokedAt:string|null; equipped:boolean; progress:number|null; target:number|null; current:number|null; }
export interface BadgeMine { equipped:Badge|null; earned:Badge[]; locked:Badge[]; }
export interface BadgeMineResponse { success:true; badges:BadgeMine; requestId?:string; }
export interface BadgeCatalogResponse { success:true; badges:Badge[]; requestId?:string; }
export interface BadgeEquipResponse { success:true; badge:Pick<Badge,"id"|"code"|"name"|"description"|"iconKey"|"iconUrl"|"rarity"|"equipped">; requestId?:string; }
export interface BadgeUnequipResponse { success:true; unequipped:boolean; requestId?:string; }
export interface BadgeRefreshResponse { success:true; badges:{awarded:number}&BadgeMine; requestId?:string; }
