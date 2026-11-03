"use client";
import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Desire } from "@/types/desire";
interface DesireResponse { success: true; desire: Desire; requestId?: string; }
export function useDesire(desireId: string) {
  const [desire, setDesire] = useState<Desire | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => {
    setIsLoading(true); setError("");
    try { const r = await api.get<DesireResponse>(`desires/${encodeURIComponent(desireId)}`, { auth: false }); setDesire(r.desire); return r.desire; }
    catch (e) { setError(e instanceof Error ? e.message : "Could not load desire."); return null; }
    finally { setIsLoading(false); }
  }, [desireId]);
  useEffect(() => { let active = true; Promise.resolve().then(async () => { try { const r = await api.get<DesireResponse>(`desires/${encodeURIComponent(desireId)}`, { auth: false }); if (active) setDesire(r.desire); } catch (e) { if (active) setError(e instanceof Error ? e.message : "Could not load desire."); } finally { if (active) setIsLoading(false); } }); return () => { active = false; }; }, [desireId]);
  return { desire, isLoading, error, reload: load };
}
