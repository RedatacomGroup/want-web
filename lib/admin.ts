import { api } from "@/lib/api";
import type {
  AdminDesire,
  AdminReport,
  AdminUser,
  DesireModeration,
  ItemsResponse,
  ReportDecision,
  UserEnforcement,
  UserEnforcementResponse,
} from "@/types/admin";

const page = (limit = 50, offset = 0) => `limit=${limit}&offset=${offset}`;

export const adminApi = {
  reports: (status = "open", limit = 50, offset = 0) =>
    api.get<ItemsResponse<AdminReport>>(
      `admin/reports?status=${encodeURIComponent(status)}&${page(limit, offset)}`,
    ),

  decideReport: (id: string, body: ReportDecision) =>
    api.patch<{ success: true; report: AdminReport; requestId?: string }>(
      `admin/reports/${id}`,
      body,
    ),

  desires: (limit = 50, offset = 0) =>
    api.get<ItemsResponse<AdminDesire>>(`admin/desires?${page(limit, offset)}`),

  moderateDesire: (id: string, body: DesireModeration) =>
    api.patch<{ success: true; desire: AdminDesire; requestId?: string }>(
      `admin/desires/${id}`,
      body,
    ),

  users: (limit = 50, offset = 0) =>
    api.get<ItemsResponse<AdminUser>>(`admin/users?${page(limit, offset)}`),

  enforceUser: (id: string, body: UserEnforcement) =>
    api.patch<UserEnforcementResponse>(`admin/users/${id}/enforcement`, body),
};
