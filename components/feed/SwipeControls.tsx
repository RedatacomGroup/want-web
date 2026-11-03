"use client";
export type FeedIntent="pass"|"want";
export function SwipeControls({disabled=false,onIntent}:{disabled?:boolean;onIntent:(intent:FeedIntent)=>void}){return <div className="swipe-controls"><button type="button" className="swipe-button pass" disabled={disabled} onClick={()=>onIntent("pass")} aria-label="Pass"><span>×</span><small>PASS</small></button><button type="button" className="swipe-button want" disabled={disabled} onClick={()=>onIntent("want")} aria-label="Want"><span>♥</span><small>WANT</small></button></div>}
