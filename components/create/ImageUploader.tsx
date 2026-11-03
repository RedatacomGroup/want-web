"use client";

import Image from "next/image";
import { ChangeEvent, DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { useUpload } from "@/hooks/useUpload";
import { validateImage } from "@/lib/upload";

interface Props {
  value: File | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
}

export function ImageUploader({ value, onChange, disabled = false }: Props) {
  const { configuration, isLoading, error: configError } = useUpload();
  const input = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const preview = useMemo(() => (value ? URL.createObjectURL(value) : null), [value]);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function choose(file?: File) {
    setError("");
    if (!file || !configuration) return;
    const problem = validateImage(file, configuration);
    if (problem) {
      setError(problem);
      onChange(null);
      return;
    }
    onChange(file);
  }

  function changed(event: ChangeEvent<HTMLInputElement>) {
    choose(event.target.files?.[0]);
    event.target.value = "";
  }

  function dropped(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled) choose(event.dataTransfer.files?.[0]);
  }

  const accept = configuration?.acceptedMimeTypes.join(",") || "image/jpeg,image/png,image/webp,image/gif";

  return (
    <div className="image-uploader">
      <input ref={input} className="upload-input" type="file" accept={accept} onChange={changed} disabled={disabled || isLoading} />
      {preview ? (
        <div className="upload-preview">
          <Image src={preview} alt="Selected desire" fill unoptimized className="upload-preview-image" />
          <div className="upload-overlay">
            <button type="button" className="upload-action" onClick={() => input.current?.click()} disabled={disabled}>Replace</button>
            <button type="button" className="upload-action danger" onClick={() => onChange(null)} disabled={disabled}>Remove</button>
          </div>
        </div>
      ) : (
        <div className="upload-dropzone" role="button" tabIndex={0} onDragOver={(event) => event.preventDefault()} onDrop={dropped} onClick={() => input.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") input.current?.click(); }}>
          <span className="upload-mark">+</span>
          <strong>{isLoading ? "Loading upload rules…" : "Add desire image"}</strong>
          <small>JPEG · PNG · WebP · GIF{configuration ? ` · up to ${Math.round(configuration.maxImageBytes / 1024 / 1024)} MB` : ""}</small>
        </div>
      )}
      {(error || configError) && <p className="form-error" role="alert">{error || configError}</p>}
    </div>
  );
}
