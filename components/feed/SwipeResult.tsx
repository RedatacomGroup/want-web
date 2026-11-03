import type{FeedIntent}from"./SwipeControls";
export function SwipeResult({intent}:{intent:FeedIntent|null}){if(!intent)return null;return <div className={`swipe-result ${intent}`}>{intent==="want"?"WANT":"PASS"}</div>}
