"use client";
import type{Badge}from"@/types/badge";
export function BadgeUnlockModal({badge,onClose}:{badge:Badge|null;onClose:()=>void}){if(!badge)return null;return <div className="badge-modal-backdrop" role="presentation" onClick={onClose}><section className="badge-modal" role="dialog" aria-modal="true" aria-label="Badge unlocked" onClick={e=>e.stopPropagation()}><span className="badge-modal-icon">✦</span><span className="eyebrow">BADGE UNLOCKED</span><h2>{badge.name}</h2><p>{badge.description}</p><button className="button" type="button" onClick={onClose}>Nice</button></section></div>}
