export interface UploadConfiguration { provider:string; fieldName:"image"; maxImageBytes:number; acceptedMimeTypes:string[]; endpoint:string; method:"POST"; contentType:"multipart/form-data"; }
export interface UploadConfigurationResponse { success:true; upload:UploadConfiguration; requestId?:string; }
export interface ImageSelection { file:File; previewUrl:string; }
