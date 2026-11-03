"use client";
import{useState}from"react";import{ImageUploader}from"@/components/create/ImageUploader";
export function ImageUploadDemo(){const[file,setFile]=useState<File|null>(null);return <section className="image-upload-demo"><span className="eyebrow">IMAGE UPLOAD</span><h2>Pick the desire.</h2><p>The selected file stays local until the desire form submits its multipart request.</p><ImageUploader value={file} onChange={setFile}/>{file&&<p className="upload-file-meta">Ready: {file.name} · {(file.size/1024/1024).toFixed(2)} MB</p>}</section>}
