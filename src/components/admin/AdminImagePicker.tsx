import { useId, useMemo, useState, type ChangeEvent } from "react";
import { buttonBase, fieldLabelStyle, uiPalette } from "@/components/admin/adminStyles";
import type { SiteMediaItem } from "@/lib/site-editor/types";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";

type AdminImagePickerProps = {
  title: string;
  value: string;
  mediaLibrary: SiteMediaItem[];
  uploadLabel?: string;
  uploadTags: string[];
  quickPickTags?: string[];
  quickPickLimit?: number;
  previewHeight?: number;
  previewWidth?: string | number;
  previewFit?: "cover" | "contain";
  onUpload: (file: File, tags: string[]) => Promise<void>;
  onApply: (filePath: string) => void;
};

function getQuickPicks(mediaLibrary: SiteMediaItem[], quickPickTags: string[], quickPickLimit: number) {
  const exact = mediaLibrary.filter((item) => quickPickTags.every((tag) => item.tags.includes(tag)));
  if (exact.length >= quickPickLimit) return exact.slice(0, quickPickLimit);

  const partial = mediaLibrary.filter((item) => quickPickTags.some((tag) => item.tags.includes(tag)));
  if (partial.length >= quickPickLimit) return partial.slice(0, quickPickLimit);

  return mediaLibrary.slice(0, quickPickLimit);
}

export function AdminImagePicker({
  title,
  value,
  mediaLibrary,
  uploadLabel = "Upload new image",
  uploadTags,
  quickPickTags,
  quickPickLimit = 0,
  previewHeight = 120,
  previewWidth = "100%",
  previewFit = "cover",
  onUpload,
  onApply,
}: AdminImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const inputId = useId();
  const previewUrl = resolveMediaUrl(value, 1200, 82) ?? value;
  const quickPicks = useMemo(() => {
    if (!quickPickLimit) return [];
    return getQuickPicks(mediaLibrary, quickPickTags ?? uploadTags, quickPickLimit);
  }, [mediaLibrary, quickPickLimit, quickPickTags, uploadTags]);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await onUpload(file, uploadTags);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontStyle: "italic", fontSize: 16, fontWeight: 400, color: uiPalette.controlText }}>
          {title}
        </h3>
        <div
          style={{
            width: previewWidth,
            height: previewHeight,
            border: `1px solid ${uiPalette.controlBorder}`,
            background: "hsl(24 18% 10%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {previewUrl ? (
            <img src={previewUrl} alt={title} style={{ width: "100%", height: "100%", objectFit: previewFit, display: "block" }} loading="lazy" />
          ) : (
            <span style={{ ...fieldLabelStyle, color: uiPalette.controlMuted }}>No image</span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <label
          htmlFor={inputId}
          style={{
            ...buttonBase,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 12px",
            color: uiPalette.controlText,
            borderColor: uiPalette.controlBorder,
            fontSize: 11,
          }}
        >
          {uploading ? "Uploading..." : uploadLabel}
        </label>
        <input id={inputId} type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
      </div>

      {quickPicks.length > 0 ? (
        <div style={{ display: "grid", gap: 8 }}>
          <span style={fieldLabelStyle}>Library options</span>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${quickPicks.length}, minmax(0, 1fr))`, gap: 8 }}>
            {quickPicks.map((item, index) => {
              const thumbUrl = resolveMediaUrl(item.file_path, 240, 76) ?? item.file_path;
              return (
                <button
                  key={item.id ?? `${item.file_path}-${index}`}
                  type="button"
                  onClick={() => onApply(item.file_path)}
                  style={{
                    borderRadius: 0,
                    border: `1px solid ${uiPalette.controlBorder}`,
                    background: "transparent",
                    padding: 0,
                    cursor: "pointer",
                    aspectRatio: "1 / 1",
                    overflow: "hidden",
                  }}
                >
                  <img src={thumbUrl} alt={item.alt_text ?? item.title ?? title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
