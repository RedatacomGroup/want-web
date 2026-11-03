"use client";
import Image from "next/image";
import { ChangeEvent, useMemo, useRef } from "react";
type Props={currentUrl:string|null;file:File|null;onChange:(file:File|null)=>void;disabled?:boolean};
export function ProfileImageUploader({currentUrl,file,onChange,disabled=false}:Props){
  const input=useRef<HTMLInputElement>(null);const preview=useMemo(()=>file?URL.createObjectURL(file):currentUrl,[file,currentUrl]);
  function changed(event:ChangeEvent<HTMLInputElement>){const next=event.target.files?.[0]||null;if(next&&!['image/jpeg','image/png','image/webp','image/gif'].includes(next.type))return;onChange(next);event.target.value=""}
  return <section className="profile-photo-editor"><div className="profile-photo-preview">{preview?<Image src={preview} alt="Profile preview" fill sizes="112px" unoptimized={Boolean(file)}/>:<span>+</span>}</div><div><strong>Profile photo</strong><p>JPEG, PNG, WebP or GIF.</p><button type="button" className="button secondary" onClick={()=>input.current?.click()} disabled={disabled}>{file?"Choose another":"Upload photo"}</button>{file&&<button type="button" className="profile-photo-clear" onClick={()=>onChange(null)} disabled={disabled}>Cancel selection</button>}</div><input ref={input} className="upload-input" type="file" name="profileImage" accept="image/jpeg,image/png,image/webp,image/gif" onChange={changed} disabled={disabled}/></section>
}
