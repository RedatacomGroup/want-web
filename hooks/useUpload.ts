"use client";

import { useCallback, useEffect, useState } from "react";
import { uploadApi } from "@/lib/upload";
import type { UploadConfiguration } from "@/types/upload";

export function useUpload() {
  const [configuration, setConfiguration] = useState<UploadConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const nextConfiguration = await uploadApi.configuration();
      setConfiguration(nextConfiguration);
      return nextConfiguration;
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not load upload configuration.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      try {
        const nextConfiguration = await uploadApi.configuration();
        if (active) setConfiguration(nextConfiguration);
      } catch (caught) {
        if (active) setError(caught instanceof Error ? caught.message : "Could not load upload configuration.");
      } finally {
        if (active) setIsLoading(false);
      }
    });
    return () => { active = false; };
  }, []);

  return { configuration, isLoading, error, reload };
}
