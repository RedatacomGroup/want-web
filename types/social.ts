export interface SocialPerson {
  userId: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  profileImageUrl: string | null;
  countryCode: string | null;
  totalWantsGenerated: number;
  desiresPosted: number;
  equippedBadge: { code:string; name:string; iconKey:string } | null;
  isPinned: boolean;
  pinnedAt: string | null;
}
export interface PeopleResponse { success:true; people:SocialPerson[]; requestId?:string }
export interface PinState { pinnedUserId?:string; isPinned:boolean; pinnedAt?:string|null }
export interface PinResponse { success:true; pin:PinState; requestId?:string }
