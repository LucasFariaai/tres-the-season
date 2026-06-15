import { useMemo, useState } from "react";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";

type NaturalSize = { width: number; height: number } | null;

type ProducerImageFrameProps = {
  image: string;
  alt: string;
  frameSize: number;
  backgroundColor: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  mediaWidth?: number;
  quality?: number;
  loading?: "eager" | "lazy";
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function ProducerImageFrame({
  image,
  alt,
  frameSize,
  backgroundColor,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  mediaWidth = 400,
  quality = 80,
  loading = "lazy",
}: ProducerImageFrameProps) {
  const [naturalSize, setNaturalSize] = useState<NaturalSize>(null);
  const src = resolveMediaUrl(image, mediaWidth, quality) ?? image;

  const layout = useMemo(() => {
    const safeScale = clamp(scale, 0.2, 1.8);
    if (!naturalSize) {
      return {
        width: frameSize,
        height: frameSize,
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) scale(${safeScale})`,
        objectFit: "cover" as const,
      };
    }

    const coverRatio = Math.max(frameSize / naturalSize.width, frameSize / naturalSize.height);
    const width = naturalSize.width * coverRatio * safeScale;
    const height = naturalSize.height * coverRatio * safeScale;
    const maxOffsetX = (Math.abs(width - frameSize) / 2 / frameSize) * 100;
    const maxOffsetY = (Math.abs(height - frameSize) / 2 / frameSize) * 100;
    const appliedOffsetX = clamp(offsetX, -maxOffsetX, maxOffsetX);
    const appliedOffsetY = clamp(offsetY, -maxOffsetY, maxOffsetY);

    return {
      width,
      height,
      left: `calc(50% + ${appliedOffsetX}%)`,
      top: `calc(50% + ${appliedOffsetY}%)`,
      transform: "translate(-50%, -50%)",
      objectFit: "fill" as const,
    };
  }, [frameSize, naturalSize, offsetX, offsetY, scale]);

  return (
    <div
      style={{
        width: frameSize,
        height: frameSize,
        borderRadius: 6,
        backgroundColor,
        overflow: "hidden",
        position: "relative",
        flexShrink: 0,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={loading}
          draggable={false}
          onLoad={(event) => {
            const target = event.currentTarget;
            setNaturalSize({ width: target.naturalWidth, height: target.naturalHeight });
          }}
          style={{
            position: "absolute",
            left: layout.left,
            top: layout.top,
            width: layout.width,
            height: layout.height,
            maxWidth: "none",
            objectFit: layout.objectFit,
            transform: layout.transform,
            pointerEvents: "none",
            userSelect: "none",
            display: "block",
          }}
        />
      ) : null}
    </div>
  );
}