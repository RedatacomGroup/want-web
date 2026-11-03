import { authStorage } from "@/lib/auth-storage";
import { env } from "@/lib/env";
import type { ApiErrorBody, ApiRequestOptions } from "@/types/api";
import type { AuthTokens, RefreshResponse } from "@/types/auth";

export class ApiError extends Error {
  constructor(public status: number, public code: string, message: string, public details?: unknown, public requestId?: string) {
    super(message); this.name = "ApiError";
  }
}

let refreshPromise: Promise<AuthTokens | null> | null = null;
const absoluteUrl = (path: string) => `${env.apiBaseUrl}${env.apiPrefix}/${path.replace(/^\/+/, "")}`;

async function parseBody(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const text = await response.text();
  if (!text) return null;
  try { return JSON.parse(text); } catch { return text; }
}

async function refreshAccessToken(): Promise<AuthTokens | null> {
  const current = authStorage.get();
  if (!current?.refreshToken) return null;
  const response = await fetch(absoluteUrl("auth/refresh"), {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken: current.refreshToken }), cache: "no-store",
  });
  if (!response.ok) { authStorage.clear(); return null; }
  const data = (await response.json()) as RefreshResponse;
  const tokens = { accessToken: data.accessToken, refreshToken: data.refreshToken ?? current.refreshToken };
  authStorage.set(tokens); return tokens;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const { auth = true, retryOnUnauthorized = true, timeoutMs = env.requestTimeoutMs, headers, body, ...init } = options;
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  const tokens = auth ? authStorage.get() : null;
  const requestHeaders = new Headers(headers);
  if (!(body instanceof FormData) && body !== undefined && !requestHeaders.has("Content-Type")) requestHeaders.set("Content-Type", "application/json");
  if (tokens?.accessToken) requestHeaders.set("Authorization", `Bearer ${tokens.accessToken}`);
  try {
    const response = await fetch(absoluteUrl(path), { ...init, headers: requestHeaders, body: body instanceof FormData || typeof body === "string" ? body : body === undefined ? undefined : JSON.stringify(body), signal: controller.signal, cache: "no-store" });
    if (response.status === 401 && auth && retryOnUnauthorized) {
      refreshPromise ??= refreshAccessToken().finally(() => { refreshPromise = null; });
      const refreshed = await refreshPromise;
      if (refreshed) return apiRequest<T>(path, { ...options, retryOnUnauthorized: false });
    }
    const payload = await parseBody(response);
    if (!response.ok) {
      const failure = (payload ?? {}) as ApiErrorBody;
      throw new ApiError(response.status, failure.error?.code ?? "REQUEST_FAILED", failure.error?.message ?? `Request failed with status ${response.status}.`, failure.error?.details, failure.requestId);
    }
    return payload as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") throw new ApiError(408, "REQUEST_TIMEOUT", "The request timed out.");
    throw new ApiError(0, "NETWORK_ERROR", error instanceof Error ? error.message : "Network request failed.");
  } finally { globalThis.clearTimeout(timeoutId); }
}

export const api = {
  get: <T>(path: string, options?: ApiRequestOptions) => apiRequest<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => apiRequest<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => apiRequest<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: ApiRequestOptions) => apiRequest<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: ApiRequestOptions) => apiRequest<T>(path, { ...options, method: "DELETE" }),
};
