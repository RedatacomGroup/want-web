import { api } from "@/lib/api";
import type { CreateDesireInput, CreateDesireResponse, Desire } from "@/types/desire";
function appendIfPresent(data: FormData, key: string, value?: string) { const clean = value?.trim(); if (clean) data.append(key, clean); }
export const desireApi = {
  async create(input: CreateDesireInput): Promise<Desire> {
    const data = new FormData();
    data.append("image", input.image);
    data.append("categorySlug", input.categorySlug);
    data.append("title", input.title.trim());
    appendIfPresent(data, "caption", input.caption);
    appendIfPresent(data, "brandName", input.brandName);
    appendIfPresent(data, "productName", input.productName);
    appendIfPresent(data, "sourceUrl", input.sourceUrl);
    appendIfPresent(data, "altText", input.altText);
    if (input.tags.length) data.append("tags", JSON.stringify(input.tags));
    return (await api.post<CreateDesireResponse>("desires", data)).desire;
  },
};
