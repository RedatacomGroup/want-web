import { api } from "@/lib/api";
import type { FeedPayload, FeedResponse, FeedSurface } from "@/types/feed";

export interface FeedQuery {
  surface?: FeedSurface;
  category?: string;
  limit?: number;
  exclude?: string[];
}

export async function getFeed({ surface="home", category, limit=20, exclude=[] }: FeedQuery = {}): Promise<FeedPayload> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (exclude.length) params.set("exclude", exclude.join(","));

  let path = "feed";
  if (surface === "people") path = "feed/people";
  else if (surface === "fresh") path = "feed/fresh";
  else if (surface === "local") path = "feed/local";
  else if (surface === "category" && category) path = `feed/category/${encodeURIComponent(category)}`;

  return (await api.get<FeedResponse>(`${path}?${params.toString()}`)).feed;
}
