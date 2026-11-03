"use client";
import{useEffect,useRef}from"react";
export function useInfiniteScroll(onVisible:()=>void,enabled=true){const ref=useRef<HTMLDivElement|null>(null);useEffect(()=>{if(!enabled||!ref.current)return;const node=ref.current;const observer=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting)onVisible()},{rootMargin:"240px"});observer.observe(node);return()=>observer.disconnect()},[enabled,onVisible]);return ref}
