import Link from"next/link";
const tabs=[["/trending","Overview"],["/trending/desires","Desires"],["/trending/users","Tastemakers"],["/trending/countries","Countries"],["/trending/categories","Categories"]];
export function TrendingTabs({active}:{active:string}){return <nav className="trending-tabs">{tabs.map(([href,label])=><Link key={href} href={href} className={active===href?"active":""}>{label}</Link>)}</nav>}
