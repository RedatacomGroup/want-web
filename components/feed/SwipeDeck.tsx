"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DesireCard } from "./DesireCard";
import { SwipeControls, type FeedIntent } from "./SwipeControls";
import { SwipeResult } from "./SwipeResult";
import { useSwipe } from "@/hooks/useSwipe";
import type { FeedItem, FeedSurface } from "@/types/feed";

interface Props {
  items: FeedItem[];
  surface: FeedSurface;
  sessionKey: string;
  onCommitted: (id: string) => void;
  onLow: () => void;
}

type DragAxis = "pending" | "horizontal" | "vertical" | null;

const COOLDOWN_MS = 520;
const VERTICAL_THRESHOLD = 72;
const HORIZONTAL_COMMIT_PX = 110;
const HORIZONTAL_COMMIT_RATIO = 0.24;
const AXIS_LOCK_PX = 10;
const EXIT_MS = 230;

export function SwipeDeck({ items, surface, sessionKey, onCommitted, onLow }: Props) {
  const [intent, setIntent] = useState<FeedIntent | null>(null);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [exiting, setExiting] = useState<FeedIntent | null>(null);

  const { decide, isSwiping, error, clearError } = useSwipe();
  const lastNavigationAt = useRef(0);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const dragAxis = useRef<DragAxis>(null);
  const activePointerId = useRef<number | null>(null);

  useEffect(() => {
    const valid = new Set(items.map((item) => item.id));
    Promise.resolve().then(() => {
      setSkippedIds((current) => current.filter((id) => valid.has(id)));
      setHistory((current) => current.filter((id) => valid.has(id)));
    });
  }, [items]);

  const visibleItems = useMemo(
    () => items.filter((item) => !skippedIds.includes(item.id)),
    [items, skippedIds],
  );

  const historicalId = historyIndex >= 0 ? history[historyIndex] : null;
  const historicalItem = historicalId ? items.find((item) => item.id === historicalId) ?? null : null;
  const top = historicalItem ?? visibleItems[0] ?? null;

  const deckItems = useMemo(() => {
    if (!top) return [];
    if (historicalItem) return [historicalItem];
    return visibleItems.slice(0, 3);
  }, [historicalItem, top, visibleItems]);

  const navigationReady = useCallback(() => {
    const now = Date.now();
    if (now - lastNavigationAt.current < COOLDOWN_MS) return false;
    lastNavigationAt.current = now;
    return true;
  }, []);

  const skip = useCallback(() => {
    if (!top || isSwiping || dragging || exiting || historicalItem || !navigationReady()) return;
    clearError();
    setSkippedIds((current) => current.includes(top.id) ? current : [...current, top.id]);
    setHistory((current) => [...current.slice(-39), top.id]);
    setHistoryIndex(-1);
    if (visibleItems.length <= 5) onLow();
  }, [top, isSwiping, dragging, exiting, historicalItem, navigationReady, clearError, visibleItems.length, onLow]);

  const previous = useCallback(() => {
    if (isSwiping || dragging || exiting || !navigationReady() || history.length === 0) return;
    setHistoryIndex((current) => current < 0 ? history.length - 1 : Math.max(0, current - 1));
  }, [history.length, isSwiping, dragging, exiting, navigationReady]);

  const forward = useCallback(() => {
    if (isSwiping || dragging || exiting || !navigationReady()) return;
    if (historyIndex >= 0) {
      setHistoryIndex((current) => current >= history.length - 1 ? -1 : current + 1);
      return;
    }
    skip();
  }, [historyIndex, history.length, isSwiping, dragging, exiting, navigationReady, skip]);

  const finishCommittedSwipe = useCallback((id: string) => {
    onCommitted(id);
    setSkippedIds((current) => current.filter((skippedId) => skippedId !== id));
    setHistory((current) => current.filter((historyId) => historyId !== id));
    setHistoryIndex(-1);
    setDragX(0);
    setExiting(null);
  }, [onCommitted]);

  async function signal(next: FeedIntent, fromGesture = false) {
    if (!top || isSwiping || exiting) return;
    clearError();
    setIntent(next);

    if (fromGesture) {
      setExiting(next);
      setDragX(next === "want" ? window.innerWidth : -window.innerWidth);
      await new Promise((resolve) => globalThis.setTimeout(resolve, EXIT_MS));
    }

    try {
      await decide(top.id, next, surface, sessionKey || null);
      finishCommittedSwipe(top.id);
      if (visibleItems.length <= 4) onLow();
    } catch {
      setExiting(null);
      setDragX(0);
      globalThis.setTimeout(() => setIntent(null), 500);
      return;
    }

    globalThis.setTimeout(() => setIntent(null), 220);
  }

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      const element = event.target as HTMLElement | null;
      if (element && ["INPUT", "TEXTAREA", "SELECT"].includes(element.tagName)) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        void signal("want");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        void signal("pass");
      } else if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault();
        forward();
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        previous();
      }
    }
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  });

  function onWheel(event: React.WheelEvent<HTMLElement>) {
    if (dragging || Math.abs(event.deltaY) < 18) return;
    if (event.deltaY > 0) forward();
    else previous();
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (!top || isSwiping || exiting || event.button !== 0) return;
    pointerStart.current = { x: event.clientX, y: event.clientY };
    dragAxis.current = "pending";
    activePointerId.current = event.pointerId;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointerStart.current || activePointerId.current !== event.pointerId || !dragging) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;

    if (dragAxis.current === "pending" && Math.max(Math.abs(dx), Math.abs(dy)) >= AXIS_LOCK_PX) {
      dragAxis.current = Math.abs(dx) > Math.abs(dy) * 1.15 ? "horizontal" : "vertical";
    }

    if (dragAxis.current === "horizontal") {
      event.preventDefault();
      setDragX(dx);
    }
  }

  function resetPointer(event?: React.PointerEvent<HTMLDivElement>) {
    if (event && activePointerId.current === event.pointerId && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    pointerStart.current = null;
    activePointerId.current = null;
    dragAxis.current = null;
    setDragging(false);
  }

  function onPointerUp(event: React.PointerEvent<HTMLDivElement>) {
    if (!pointerStart.current || activePointerId.current !== event.pointerId) return;
    const dx = event.clientX - pointerStart.current.x;
    const dy = event.clientY - pointerStart.current.y;
    const axis = dragAxis.current;
    const width = event.currentTarget.getBoundingClientRect().width;
    const horizontalThreshold = Math.max(HORIZONTAL_COMMIT_PX, width * HORIZONTAL_COMMIT_RATIO);
    resetPointer(event);

    if (axis === "horizontal") {
      if (Math.abs(dx) >= horizontalThreshold) {
        void signal(dx > 0 ? "want" : "pass", true);
      } else {
        setDragX(0);
      }
      return;
    }

    setDragX(0);
    if (axis === "vertical" && Math.abs(dy) >= VERTICAL_THRESHOLD) {
      if (dy < 0) forward();
      else previous();
    }
  }

  function onPointerCancel(event: React.PointerEvent<HTMLDivElement>) {
    resetPointer(event);
    setDragX(0);
  }

  if (!top) return null;

  const dragProgress = Math.min(1, Math.abs(dragX) / HORIZONTAL_COMMIT_PX);
  const dragIntent: FeedIntent | null = dragX > 12 ? "want" : dragX < -12 ? "pass" : null;
  const topTransform = `translate3d(${dragX}px,0,0) rotate(${dragX / 28}deg)`;

  return (
    <section className="swipe-stage skip-enabled gesture-enabled" onWheel={onWheel}>
      <div
        className={`deck-stack gesture-deck ${dragging ? "dragging" : ""} ${exiting ? `exiting-${exiting}` : ""}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {deckItems.slice(0, 3).reverse().map((item, index, visible) => {
          const position = visible.length - 1 - index;
          const isTopCard = item.id === top.id;
          return (
            <div
              key={item.id}
              className={`gesture-card-wrap ${isTopCard ? "gesture-card-top" : ""}`}
              style={isTopCard ? { transform: topTransform } : undefined}
            >
              <DesireCard item={item} position={position} />
            </div>
          );
        })}

        <div className={`gesture-indicator pass ${dragIntent === "pass" ? "visible" : ""}`} style={{ opacity: dragIntent === "pass" ? dragProgress : 0 }}>
          <strong>×</strong><span>PASS</span>
        </div>
        <div className={`gesture-indicator want ${dragIntent === "want" ? "visible" : ""}`} style={{ opacity: dragIntent === "want" ? dragProgress : 0 }}>
          <strong>♥</strong><span>WANT</span>
        </div>
        <SwipeResult intent={intent} />
      </div>

      <div className="feed-navigation-row">
        <button type="button" className="feed-nav-button" onClick={previous} disabled={isSwiping || dragging || Boolean(exiting) || history.length === 0} aria-label="Previous desire">↑</button>
        <SwipeControls disabled={isSwiping || dragging || Boolean(exiting)} onIntent={(next) => void signal(next)} />
        <button type="button" className="feed-nav-button next" onClick={forward} disabled={isSwiping || dragging || Boolean(exiting)} aria-label="Skip to next desire">↓</button>
      </div>

      <button type="button" className="feed-skip-button" onClick={forward} disabled={isSwiping || dragging || Boolean(exiting) || Boolean(historicalItem)}>
        Skip · no vote
      </button>

      <p className="feed-navigation-hint">Swipe right WANT · swipe left PASS · swipe up or scroll for next</p>
      {error && <p className="swipe-error" role="alert">{error}</p>}
    </section>
  );
}
