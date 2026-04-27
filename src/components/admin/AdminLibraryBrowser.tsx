import { useEffect, useMemo, useRef, useState } from "react";
import { buttonBase, fieldLabelStyle, fieldStyle, navPillStyle, sectionHeaderStyle, uiPalette } from "@/components/admin/adminStyles";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import type { SiteMediaItem } from "@/lib/site-editor/types";

type Props = {
  open: boolean;
  title?: string;
  mediaLibrary: SiteMediaItem[];
  initialTags?: string[];
  uploadTags: string[];
  uploading?: boolean;
  onUpload: (file: File, tags: string[]) => Promise<void>;
  onSelect: (filePath: string) => void;
  onClose: () => void;
};

function normalize(value: string | null | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

export function AdminLibraryBrowser({
  open,
  title = "Media library",
  mediaLibrary,
  initialTags = [],
  uploadTags,
  uploading = false,
  onUpload,
  onSelect,
  onClose,
}: Props) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localUploading, setLocalUploading] = useState(false);

  // Reset filter to the first relevant tag whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    setQuery("");
    setActiveTag(initialTags[0] ?? null);
  }, [open, initialTags.join(",")]);

  // Prevent background scroll while modal is open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const tagOptions = useMemo(() => {
    const set = new Set<string>();
    mediaLibrary.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [mediaLibrary]);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return mediaLibrary.filter((item) => {
      if (activeTag && !item.tags.includes(activeTag)) return false;
      if (!q) return true;
      return [item.title, item.alt_text, item.file_path, ...(item.tags ?? [])]
        .some((field) => normalize(field).includes(q));
    });
  }, [mediaLibrary, activeTag, query]);

  if (!open) return null;

  const handleFile = async (file: File) => {
    setLocalUploading(true);
    try {
      await onUpload(file, uploadTags);
    } finally {
      setLocalUploading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(26,20,16,0.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(1100px, 100%)",
          maxHeight: "calc(100vh - 48px)",
          display: "flex",
          flexDirection: "column",
          background: "rgba(245,239,230,0.98)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          border: "1px solid rgba(26,20,16,0.06)",
          borderRadius: 18,
          boxShadow: "0 24px 64px rgba(26,20,16,0.18)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "18px 22px",
            borderBottom: `1px solid ${uiPalette.panelBorder}`,
          }}
        >
          <h2 style={sectionHeaderStyle}>{title}</h2>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
                event.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || localUploading}
              style={{
                ...buttonBase,
                background: uiPalette.accent,
                color: uiPalette.accentText,
                borderColor: uiPalette.accent,
                padding: "8px 16px",
                opacity: uploading || localUploading ? 0.7 : 1,
              }}
            >
              {uploading || localUploading ? "Uploading…" : "Upload new"}
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{ ...buttonBase, padding: "8px 14px", color: uiPalette.controlText }}
            >
              Close
            </button>
          </div>
        </div>

        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "14px 22px",
            borderBottom: `1px solid ${uiPalette.panelBorder}`,
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            placeholder="Search by name, alt text or path…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ ...fieldStyle, padding: "8px 12px", fontSize: 13, minWidth: 240, flex: 1 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>
            <span style={{ ...fieldLabelStyle, marginRight: 4 }}>Tag</span>
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              style={{
                ...navPillStyle,
                background: activeTag === null ? uiPalette.accent : "transparent",
                color: activeTag === null ? uiPalette.accentText : uiPalette.controlText,
                border: "1px solid " + (activeTag === null ? uiPalette.accent : "rgba(26,20,16,0.08)"),
              }}
            >
              All
            </button>
            {tagOptions.map((tag) => {
              const isActive = activeTag === tag;
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setActiveTag(tag)}
                  style={{
                    ...navPillStyle,
                    background: isActive ? uiPalette.accent : "transparent",
                    color: isActive ? uiPalette.accentText : uiPalette.controlText,
                    border: "1px solid " + (isActive ? uiPalette.accent : "rgba(26,20,16,0.08)"),
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter */}
        <div
          style={{
            padding: "8px 22px",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: uiPalette.controlMuted,
          }}
        >
          {filtered.length} of {mediaLibrary.length}
        </div>

        {/* Grid */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overscrollBehavior: "contain",
            padding: 22,
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "40px 0",
                textAlign: "center",
                color: uiPalette.controlMuted,
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 14,
              }}
            >
              {mediaLibrary.length === 0
                ? "Library is empty. Upload your first image with the button above."
                : "No images match the current filter."}
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 12,
              }}
            >
              {filtered.map((item, index) => {
                const thumbUrl = resolveMediaUrl(item.file_path, 320, 78) ?? item.file_path;
                return (
                  <button
                    key={item.id ?? `${item.file_path}-${index}`}
                    type="button"
                    onClick={() => onSelect(item.file_path)}
                    style={{
                      borderRadius: 12,
                      border: "1px solid rgba(26,20,16,0.06)",
                      background: "rgba(255,255,255,0.5)",
                      padding: 0,
                      cursor: "pointer",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      textAlign: "left",
                      transition: "transform 160ms ease, box-shadow 160ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 6px 20px rgba(26,20,16,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ aspectRatio: "1 / 1", background: "rgba(26,20,16,0.04)", overflow: "hidden" }}>
                      <img
                        src={thumbUrl}
                        alt={item.alt_text ?? item.title ?? ""}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        loading="lazy"
                      />
                    </div>
                    <div style={{ padding: "8px 10px", display: "grid", gap: 4 }}>
                      <span
                        style={{
                          fontFamily: "'Source Sans 3', sans-serif",
                          fontSize: 12,
                          color: uiPalette.controlText,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.title || item.file_path.split("/").pop()}
                      </span>
                      {item.tags.length > 0 ? (
                        <span
                          style={{
                            fontFamily: "'Source Sans 3', sans-serif",
                            fontSize: 10,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            color: uiPalette.controlMuted,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.tags.join(" · ")}
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
