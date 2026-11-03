export interface ApiErrorBody { success?: false; error?: { code?: string; message?: string; details?: unknown }; requestId?: string; }
export interface ApiMeta { requestId?: string; }
export interface Pagination { limit: number; offset: number; returned: number; hasMore: boolean; }
export interface ApiRequestOptions extends Omit<RequestInit, "body"> { body?: unknown; auth?: boolean; retryOnUnauthorized?: boolean; timeoutMs?: number; }
