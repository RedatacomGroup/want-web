export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type UserEnforcementAction = "terminate" | "reactivate";

export interface AdminReport {
  id: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  resolution: string | null;
  created_at: string;
  updated_at: string;
  reporter_id: string;
  reporter_username: string;
  desire_id: string | null;
  desire_title: string | null;
  desire_deleted_at: string | null;
  reported_user_id: string | null;
  reported_username: string | null;
  reported_user_status: string | null;
  assigned_admin_username: string | null;
}

export interface AdminDesire {
  id: string;
  title: string;
  status: string;
  deleted_at: string | null;
  created_at: string;
  username: string;
  user_status?: string;
  report_count: number;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  status: string;
  created_at: string;
  last_login_at: string | null;
  display_name: string | null;
  profile_image_url: string | null;
  country_code: string | null;
  desires_posted: number;
  open_report_count: number;
  admin_role: string | null;
  latest_moderation_action: string | null;
  latest_moderation_reason: string | null;
  latest_moderation_at: string | null;
}

export interface ItemsResponse<T> {
  success: true;
  items: T[];
  requestId?: string;
}

export interface ReportDecision {
  status: ReportStatus;
  resolution?: string;
}

export interface DesireModeration {
  action: "remove" | "restore";
  reason: string;
}

export interface UserEnforcement {
  action: UserEnforcementAction;
  reason: string;
  reportId?: string;
}

export interface UserEnforcementResponse {
  success: true;
  user: {
    id: string;
    username: string;
    email: string;
    status: string;
    updated_at: string;
    sessionsRevoked: boolean;
    contentRemoved: boolean;
  };
  requestId?: string;
}
