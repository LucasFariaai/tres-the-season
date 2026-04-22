import { getImageUrl } from "@/lib/imageUpload";
import { defaultHomeCmsContent, defaultMediaLibrary, defaultSiteTheme } from "@/lib/site-editor/defaults";
import type {
  EditorSnapshotPayload,
  HomeCmsContent,
  SiteMediaItem,
  SiteThemeTokens,
} from "@/lib/site-editor/types";

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object" && !Array.isArray(value);

export function deepMerge<T>(base: T, incoming: unknown): T {
  if (Array.isArray(base)) {
    return (Array.isArray(incoming) ? incoming : base) as T;
  }

  if (!isObject(base) || !isObject(incoming)) {
    return (incoming as T) ?? base;
  }

  const output: Record<string, unknown> = { ...base };
  Object.entries(incoming).forEach(([key, value]) => {
    const current = output[key];
    if (Array.isArray(current)) {
      output[key] = Array.isArray(value) ? value : current;
      return;
    }
    if (isObject(current) && isObject(value)) {
      output[key] = deepMerge(current, value);
      return;
    }
    output[key] = value;
  });

  return output as T;
}

export function normalizeContent(content: unknown): HomeCmsContent {
  return deepMerge(defaultHomeCmsContent, content);
}

export function normalizeTheme(theme: unknown): SiteThemeTokens {
  return deepMerge(defaultSiteTheme, theme);
}

export function normalizeMediaLibrary(media: unknown): SiteMediaItem[] {
  if (!Array.isArray(media) || media.length === 0) return defaultMediaLibrary;

  return media
    .filter(isObject)
    .map((item) => ({
      id: typeof item.id === "string" ? item.id : undefined,
      file_path: typeof item.file_path === "string" ? item.file_path : "",
      title: typeof item.title === "string" ? item.title : null,
      alt_text: typeof item.alt_text === "string" ? item.alt_text : null,
      tags: Array.isArray(item.tags) ? item.tags.filter((tag): tag is string => typeof tag === "string") : [],
      metadata: isObject(item.metadata) ? item.metadata : {},
    }))
    .filter((item) => item.file_path);
}

export function normalizeSnapshot(payload?: Partial<EditorSnapshotPayload> | null): EditorSnapshotPayload {
  return {
    content: normalizeContent(payload?.content),
    theme: normalizeTheme(payload?.theme),
    media: normalizeMediaLibrary(payload?.media),
  };
}

export function safeJsonParse<T>(value: string | null | undefined): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function resolveMediaUrl(path: string | null | undefined, width = 1600, quality = 82) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("/") || path.startsWith("data:")) {
    return path;
  }
  return getImageUrl(path, width, quality) ?? path;
}

export function snapshotToSiteContentRows(content: HomeCmsContent) {
  return Object.entries(content).map(([section, payload]) => ({
    section,
    key: "payload",
    content_type: "json",
    value: JSON.stringify(payload),
  }));
}

export function siteContentRowsToSnapshot(rows: Array<{ section: string; key: string; value: string | null }>) {
  const payload: Record<string, unknown> = {};

  rows.forEach((row) => {
    if (row.key !== "payload") return;
    const parsed = safeJsonParse<Record<string, unknown>>(row.value);
    if (parsed) payload[row.section] = parsed;
  });

  return normalizeContent(payload);
}

export function themeToTokenRows(theme: SiteThemeTokens, environment: string) {
  return [
    { environment, section: "hero", token: "overlay", value: theme.heroOverlay },
    { environment, section: "concept", token: "background", value: theme.conceptBackground },
    { environment, section: "zoom", token: "background", value: theme.zoomBackground },
    { environment, section: "producers", token: "background", value: theme.producersBackground },
    { environment, section: "reserve", token: "background", value: theme.reserveBackground },
    { environment, section: "footer", token: "background", value: theme.footerBackground },
    { environment, section: "bands", token: "hero_to_zoom", value: theme.bandHeroToZoom },
    { environment, section: "bands", token: "zoom_to_producers", value: theme.bandZoomToProducers },
  ];
}

export function tokenRowsToTheme(rows: Array<{ section: string; token: string; value: string }>) {
  const next = { ...defaultSiteTheme };
  rows.forEach((row) => {
    const key = `${row.section}.${row.token}`;
    switch (key) {
      case "hero.overlay":
        next.heroOverlay = row.value;
        break;
      case "concept.background":
        next.conceptBackground = row.value;
        break;
      case "zoom.background":
        next.zoomBackground = row.value;
        break;
      case "producers.background":
        next.producersBackground = row.value;
        break;
      case "reserve.background":
        next.reserveBackground = row.value;
        break;
      case "footer.background":
        next.footerBackground = row.value;
        break;
      case "bands.hero_to_zoom":
        next.bandHeroToZoom = row.value;
        break;
      case "bands.zoom_to_producers":
        next.bandZoomToProducers = row.value;
        break;
    }
  });
  return next;
}
