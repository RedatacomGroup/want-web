const cleanUrl = (value: string) => value.replace(/\/+$/, "");
const cleanPrefix = (value: string) => `/${value.replace(/^\/+|\/+$/g, "")}`;
const timeout = Number(process.env.NEXT_PUBLIC_REQUEST_TIMEOUT_MS ?? "15000");

if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
}

export const env = Object.freeze({
  apiBaseUrl: cleanUrl(process.env.NEXT_PUBLIC_API_BASE_URL),
  apiPrefix: cleanPrefix(process.env.NEXT_PUBLIC_API_PREFIX ?? "/api"),
  appUrl: cleanUrl(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  requestTimeoutMs: Number.isFinite(timeout) && timeout > 0 ? timeout : 15000,
});
