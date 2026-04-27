import { useEffect, useState, type CSSProperties } from "react";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import { uiPalette } from "@/components/admin/adminStyles";

type Props = {
  src: string | null | undefined;
  alt?: string | null;
  width?: number;
  quality?: number;
  /** Object-fit applied to the underlying img. */
  fit?: "cover" | "contain";
  /** Container style overrides. */
  style?: CSSProperties;
  /** Custom fallback content when src is empty or fails to load. */
  fallback?: React.ReactNode;
  loading?: "lazy" | "eager";
};

/**
 * Robust thumbnail used across the admin. Resolves the path through
 * Supabase image transform when needed, downsizes with sensible defaults
 * (so mobile gets light webp), and falls back to a gracefully styled
 * placeholder if the URL fails — so broken images never leak through.
 */
export function AdminMediaThumb({
  src,
  alt = "",
  width = 320,
  quality = 76,
  fit = "cover",
  style,
  fallback,
  loading = "lazy",
}: Props) {
  const [errored, setErrored] = useState(false);
  const resolved = resolveMediaUrl(src ?? null, width, quality) ?? src ?? null;

  useEffect(() => {
    setErrored(false);
  }, [resolved]);

  const showFallback = !resolved || errored;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "rgba(26,20,16,0.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        ...style,
      }}
    >
      {showFallback ? (
        fallback ?? (
          <span
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 10,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: uiPalette.controlMuted,
            }}
          >
            No image
          </span>
        )
      ) : (
        <img
          src={resolved as string}
          alt={alt ?? ""}
          loading={loading}
          decoding="async"
          onError={() => setErrored(true)}
          style={{ width: "100%", height: "100%", objectFit: fit, display: "block" }}
        />
      )}
    </div>
  );
}
