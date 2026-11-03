import{api}from"@/lib/api";import type{CreateReportInput,CreateReportResponse}from"@/types/report";
export const reportApi={create:(input:CreateReportInput)=>api.post<CreateReportResponse>("reports",input)};
