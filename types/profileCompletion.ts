export interface ProfileDesire {
  id: string;
  title: string;
  caption: string | null;
  category_slug: string;
  category_name: string;
  image_url: string | null;
  thumbnail_url: string | null;
  want_count: number;
  pass_count: number;
  want_rate: number;
  published_at: string | null;
}
export interface ProfileDesiresResponse { success: true; desires: ProfileDesire[]; requestId?: string; }
export interface PublicStats {
  totalWantsGenerated: number;
  desiresPosted: number;
  globalRank: number | null;
  countryRank: number | null;
  categories: { slug:string; name:string; wantsGenerated:number; desires:number; rank:number }[];
}
export interface PublicStatsResponse { success:true; stats:PublicStats; requestId?:string; }
