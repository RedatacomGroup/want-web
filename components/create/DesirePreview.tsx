"use client";

import Image from "next/image";
import { useEffect, useMemo } from "react";

interface Props {
  file: File | null;
  title: string;
  caption: string;
  categoryName?: string;
  brandName: string;
}

export function DesirePreview({ file, title, caption, categoryName, brandName }: Props) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return (
    <aside className="desire-preview">
      <div className="preview-label">
        <span>LIVE PREVIEW</span>
        <strong>{categoryName || "Uncategorised"}</strong>
      </div>
      <div className="preview-media">
        {url ? (
          <Image src={url} alt="Desire preview" fill unoptimized className="preview-image" />
        ) : (
          <div className="preview-empty">Your image will appear here</div>
        )}
        <div className="preview-gradient" />
        <div className="preview-content">
          {brandName && <span className="preview-brand">{brandName}</span>}
          <h2>{title || "Name the desire"}</h2>
          <p>{caption || "Add a short caption explaining why this pulls you in."}</p>
        </div>
      </div>
    </aside>
  );
}
