import { useId, useState, type ChangeEvent } from "react";
import { Trash2 } from "lucide-react";
import { AdminLibraryBrowser } from "@/components/admin/AdminLibraryBrowser";
import { AdminMediaThumb } from "@/components/admin/AdminMediaThumb";
import { buttonBase, uiPalette } from "@/components/admin/adminStyles";
import type { SiteMediaItem } from "@/lib/site-editor/types";

type AdminImagePickerProps = {
  title: string;
  value: string;
  mediaLibrary: SiteMediaItem[];
  uploadLabel?: string;
  uploadTags: string[];
  previewHeight?: number;
  previewWidth?: string | number;
  previewFit?: "cover" | "contain";
  hidePreview?: boolean;
  onUpload: (file: File, tags: string[]) => Promise<void>;
  onApply: (filePath: string) => void;
  onClear?: () => void;
  clearLabel?: string;
};

export function AdminImagePicker({
  title,
  value,
  mediaLibrary,
  uploadLabel = "Upload new",
  uploadTags,
  previewHeight = 120,
  previewWidth = "100%",
  previewFit = "cover",
  hidePreview = false,
  onUpload,
  onApply,
  onClear,
  clearLabel = "Remove image",
}: AdminImagePickerProps) {
  const [uploading, setUploading] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const inputId = useId();

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
        <h3 style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: 16, fontWeight: 400, color: uiPalette.controlText }}>
          {title}
        </h3>
        {hidePreview ? null : (
          <div
            style={{
              width: previewWidth,
              height: previewHeight,
              borderRadius: 12,
              border: "1px solid rgba(26,20,16,0.06)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <AdminMediaThumb src={value} alt={title} width={1200} quality={82} fit={previewFit} />
            {onClear && value ? (
              <button
                type="button"
                onClick={onClear}
                aria-label={clearLabel}
                title={clearLabel}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 32,
                  height: 32,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 999,
                  border: "1px solid rgba(26,20,16,0.15)",
                  background: "rgba(255,255,255,0.92)",
                  color: "#c0533b",
                  cursor: "pointer",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                }}
              >
                <Trash2 size={16} />
              </button>
            ) : null}
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <label
          htmlFor={inputId}
          style={{
            ...buttonBase,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "8px 14px",
            color: uiPalette.controlText,
            fontSize: 12,
          }}
        >
          {uploading ? "Uploading…" : uploadLabel}
        </label>
        <input id={inputId} type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />
        <button
          type="button"
          onClick={() => setLibraryOpen(true)}
          style={{
            ...buttonBase,
            padding: "8px 14px",
            color: uiPalette.controlText,
            fontSize: 12,
          }}
        >
          Browse library ({mediaLibrary.length})
        </button>
      </div>

      <AdminLibraryBrowser
        open={libraryOpen}
        title={`${title} · Library`}
        mediaLibrary={mediaLibrary}
        initialTags={uploadTags}
        uploadTags={uploadTags}
        uploading={uploading}
        onUpload={async (file, tags) => {
          await onUpload(file, tags);
        }}
        onSelect={(filePath) => {
          onApply(filePath);
          setLibraryOpen(false);
        }}
        onClose={() => setLibraryOpen(false)}
      />
    </div>
  );
}
