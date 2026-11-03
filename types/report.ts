export type ReportReason = "spam"|"scam"|"harassment"|"hate"|"violence"|"illegal"|"copyright"|"impersonation"|"other";
export interface CreateReportInput { desireId?:string; reportedUserId?:string; reason:ReportReason; details?:string; }
export interface CreatedReport { id:string;reason:ReportReason;status:string;created_at:string; }
export interface CreateReportResponse { success:true;report:CreatedReport;requestId?:string; }
