"use client";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSwipe } from "@/hooks/useSwipe";
import type { Desire } from "@/types/desire";
import type { SwipeDecision } from "@/types/swipe";
export function DesireActions({ desire }: { desire: Desire }) { const { isAuthenticated, user } = useAuth(); const { decide, isSwiping, error } = useSwipe(); const [decision, setDecision] = useState<SwipeDecision | null>(null); const own = user?.id === desire.creator.userId; async function act(next: SwipeDecision) { if (!isAuthenticated || own || isSwiping) return; await decide(desire.id, next, "detail", null); setDecision(next); } if (own) return <p className="detail-owner-note">This is your desire.</p>; return <div className="detail-actions"><button type="button" className={`detail-action pass ${decision === "pass" ? "selected" : ""}`} disabled={!isAuthenticated || isSwiping} onClick={() => void act("pass")}>PASS</button><button type="button" className={`detail-action want ${decision === "want" ? "selected" : ""}`} disabled={!isAuthenticated || isSwiping} onClick={() => void act("want")}>♥ WANT</button>{!isAuthenticated && <small>Sign in to WANT or PASS.</small>}{error && <small className="form-error">{error}</small>}</div>; }
