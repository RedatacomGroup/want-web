import { api } from "@/lib/api";

import type {
  UploadConfiguration,
  UploadConfigurationResponse,
} from "@/types/upload";

export const uploadApi = {
  async configuration(): Promise<UploadConfiguration> {
    const response =
      await api.get<UploadConfigurationResponse>(
        "uploads/configuration",
      );

    return response.upload;
  },
};

export function validateImage(
  file: File,
  configuration: UploadConfiguration,
): string | null {
  if (!configuration.acceptedMimeTypes.includes(file.type)) {
    return "Only JPEG, PNG, WebP, or GIF images are accepted.";
  }

  if (file.size > configuration.maxImageBytes) {
    const maximumMegabytes = Math.round(
      configuration.maxImageBytes / 1024 / 1024,
    );

    return `Image exceeds the ${maximumMegabytes} MB limit.`;
  }

  return null;
}