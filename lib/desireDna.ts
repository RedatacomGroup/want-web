import{api}from"@/lib/api";import type{DesireDna,DesireDnaResponse}from"@/types/desireDna";
export const desireDnaApi={mine:async():Promise<DesireDna>=>(await api.get<DesireDnaResponse>("desire-dna/me")).dna,public:async(username:string):Promise<DesireDna>=>(await api.get<DesireDnaResponse>(`desire-dna/users/${encodeURIComponent(username)}`,{auth:false})).dna};
