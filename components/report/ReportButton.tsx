"use client";
import{useState}from"react";import{ReportModal}from"./ReportModal";
type Props={desireId?:string;reportedUserId?:string;targetLabel:string;disabled?:boolean};
export function ReportButton(props:Props){const[open,setOpen]=useState(false);return <><button type="button" className="report-trigger" disabled={props.disabled} onClick={()=>setOpen(true)}>Report</button>{open&&<ReportModal {...props} onClose={()=>setOpen(false)}/>}</>}
