import type { RenderableContent } from "@/types/global/interface/test.apiInterface";

const URL_REGEX = /(https?:\/\/[^\s"'<>]+)/i;

const sanitizeUrl = (rawUrl: string): string | null => {
  try {
    const candidate = rawUrl.replace(/[),.;!?]+$/, "");
    const parsedUrl = new URL(candidate);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }
    return parsedUrl.toString();
  } catch {
    return null;
  }
};

export const getRenderableContent = (value: string): RenderableContent => {
  const trimmedValue = value.trim();
  const urlMatch = trimmedValue.match(URL_REGEX);

  if (!urlMatch) {
    return {
      kind: "text",
      value,
    };
  }

  const sanitizedUrl = sanitizeUrl(urlMatch[0]);
  if (!sanitizedUrl) {
    return {
      kind: "text",
      value,
    };
  }

  return {
    kind: "image",
    value: sanitizedUrl,
  };
};
