"use client";
import type { Interest } from "@/types/user";
interface Props { categories: Interest[]; value: string; onChange: (slug:string)=>void; loading?: boolean; }
export function CategoryPicker({categories,value,onChange,loading=false}:Props){return <section className="create-section"><div className="create-section-head"><h2>Category</h2><span>{value||"Choose one"}</span></div><div className="create-categories">{loading?<span className="create-muted">Loading categories…</span>:categories.map(category=><button type="button" key={category.slug} className={`create-category ${value===category.slug?"active":""}`} onClick={()=>onChange(category.slug)}>{category.name}</button>)}</div></section>}
