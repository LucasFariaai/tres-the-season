import { useId, useRef, useState, type ChangeEvent } from "react";
import { buttonBase, fieldLabelStyle, fieldStyle, uiPalette } from "@/components/admin/adminStyles";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";

type Props = {
  title: string;
  value: string;
  uploadTags: string[];
  onUpload: (file: File, tags: string[]) => Promise<void>;
  onChangeUrl: (url: string) => void;
};

export function AdminVideoField({ title, value, uploadTags, onUpload, onChangeUrl }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputId = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const previewUrl = resolveMediaUrl(value, 1200, 82) ?? value;

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
    <div style={{ display: "grid", gap: 10 }}>
      <h3 style={{ margin: 0, fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: 16, fontWeight: 400, color: uiPalette.controlText }}>
        {title}
      </h3>

      <div
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          borderRadius: 12,
          border: "1px solid rgba(26,20,16,0.06)",
          background: "rgba(26,20,16,0.04)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {previewUrl ? (
          <video
            ref={videoRef}
            src={previewUrl}
            muted
            loop
            playsInline
            controls
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span style={{ ...fieldLabelStyle, color: uiPalette.controlMuted }}>No video</span>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
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
          {uploading ? "Uploading..." : "Upload video"}
        </label>
        <input id={inputId} type="file" accept="video/*" onChange={handleChange} style={{ display: "none" }} />
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <span style={fieldLabelStyle}>Or paste a URL</span>
        <input
          type="text"
          value={value}
          placeholder="https:// or /videos/your-video.mp4"
          onChange={(event) => onChangeUrl(event.target.value)}
          style={{ ...fieldStyle, fontSize: 12 }}
        />
      </div>
    </div>
  );
}
