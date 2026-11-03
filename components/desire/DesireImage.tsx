import Image from "next/image";
import type { Desire } from "@/types/desire";
export function DesireImage({ desire }: { desire: Desire }) { return <div className="detail-media">{desire.image?.url ? <Image src={desire.image.thumbnailUrl || desire.image.url} alt={desire.image.altText || desire.title} fill priority sizes="(max-width: 900px) 100vw, 58vw" className="detail-image" /> : <div className="detail-image-empty">No image available</div>}<div className="detail-image-shade" /></div>; }
