"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getFeed } from "@/lib/feed";
import type { FeedItem, FeedSurface } from "@/types/feed";

const INITIAL_LIMIT = 20;
const REPLENISH_LIMIT = 20;
const PREFETCH_AT = 7;

function appendUnique(current: FeedItem[], incoming: FeedItem[]) {
  const known = new Set(current.map((item) => item.id));
  return [...current, ...incoming.filter((item) => !known.has(item.id))];
}

export function useFeed(surface: FeedSurface = "home", category?: string) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [sessionKey, setSessionKey] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isReplenishing, setIsReplenishing] = useState(false);
  const [error, setError] = useState("");

  const itemsRef = useRef<FeedItem[]>([]);
  const requestInFlight = useRef(false);
  const generation = useRef(0);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const load = useCallback(async () => {
    const requestGeneration = ++generation.current;
    requestInFlight.current = true;
    setIsLoading(true);
    setError("");

    try {
      const feed = await getFeed({
        surface,
        category,
        limit: INITIAL_LIMIT,
      });

      if (requestGeneration !== generation.current) return null;

      itemsRef.current = feed.items;
      setItems(feed.items);
      setSessionKey(feed.sessionKey);
      setHasMore(feed.hasMore);
      return feed;
    } catch (caught) {
      if (requestGeneration === generation.current) {
        setError(caught instanceof Error ? caught.message : "Could not load feed.");
      }
      return null;
    } finally {
      if (requestGeneration === generation.current) {
        setIsLoading(false);
      }
      requestInFlight.current = false;
    }
  }, [surface, category]);

  const replenish = useCallback(async () => {
    if (requestInFlight.current || isLoading || !hasMore) return null;

    requestInFlight.current = true;
    setIsReplenishing(true);

    try {
      const current = itemsRef.current;
      const feed = await getFeed({
        surface,
        category,
        limit: REPLENISH_LIMIT,
        exclude: current.map((item) => item.id),
      });

      const next = appendUnique(current, feed.items);
      itemsRef.current = next;
      setItems(next);
      setSessionKey(feed.sessionKey || sessionKey);
      setHasMore(feed.hasMore && next.length > current.length);
      return feed;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not replenish feed.");
      return null;
    } finally {
      requestInFlight.current = false;
      setIsReplenishing(false);
    }
  }, [surface, category, isLoading, hasMore, sessionKey]);

  useEffect(() => {
  Promise.resolve().then(() => {
    void load();
  });

  return () => {
    generation.current += 1;
    requestInFlight.current = false;
  };
}, [load]);


  useEffect(() => {
    if (!isLoading && hasMore && items.length <= PREFETCH_AT) {
      void replenish();
    }
  }, [items.length, isLoading, hasMore, replenish]);

  const removeTop = useCallback((id: string) => {
    setItems((current) => {
      const next = current.filter((item) => item.id !== id);
      itemsRef.current = next;
      return next;
    });
  }, []);

  return {
    items,
    sessionKey,
    hasMore,
    isLoading,
    isReplenishing,
    error,
    reload: load,
    replenish,
    removeTop,
  };
}
