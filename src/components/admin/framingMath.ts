/**
 * Conversion between two equivalent representations of a square crop on a
 * source image:
 *
 *  - **Framing fields** (`imageScale`, `imageOffsetX%`, `imageOffsetY%`) — how
 *    `ProducerImageFrame` renders the image inside the on-site square frame.
 *  - **Crop rect** (`cropX`, `cropY`, `cropSize` in original-image px) — what
 *    the admin editor exposes to the user as a draggable square selection over
 *    the full image.
 *
 * The frame size F cancels out of every equation, so these helpers only need
 * the natural dimensions of the source image.
 *
 * Derivation (matches `ProducerImageFrame`):
 *   coverRatio c     = max(F/nw, F/nh)         → c·F⁻¹ = 1/min(nw, nh)
 *   visible size S   = F / (c · scale)         → scale = min(nw,nh) / S
 *   crop center (orig px):
 *     cx = nw/2 − offX/100 · S
 *     cy = nh/2 − offY/100 · S
 */

export type CropRect = { cropX: number; cropY: number; cropSize: number };
export type Framing = { imageScale: number; imageOffsetX: number; imageOffsetY: number };

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function framingToCropRect(
  naturalW: number,
  naturalH: number,
  framing: Partial<Framing>,
): CropRect {
  const scale = typeof framing.imageScale === "number" && framing.imageScale > 0 ? framing.imageScale : 1;
  const offX = typeof framing.imageOffsetX === "number" ? framing.imageOffsetX : 0;
  const offY = typeof framing.imageOffsetY === "number" ? framing.imageOffsetY : 0;
  const minSide = Math.min(naturalW, naturalH);
  const cropSize = clamp(minSide / scale, 1, minSide);
  const cx = naturalW / 2 - (offX / 100) * cropSize;
  const cy = naturalH / 2 - (offY / 100) * cropSize;
  let cropX = cx - cropSize / 2;
  let cropY = cy - cropSize / 2;
  cropX = clamp(cropX, 0, naturalW - cropSize);
  cropY = clamp(cropY, 0, naturalH - cropSize);
  return { cropX, cropY, cropSize };
}

export function cropRectToFraming(
  naturalW: number,
  naturalH: number,
  rect: CropRect,
): Framing {
  const minSide = Math.min(naturalW, naturalH);
  const cropSize = clamp(rect.cropSize, 1, minSide);
  const cx = rect.cropX + cropSize / 2;
  const cy = rect.cropY + cropSize / 2;
  const imageScale = minSide / cropSize;
  const imageOffsetX = ((naturalW / 2 - cx) / cropSize) * 100;
  const imageOffsetY = ((naturalH / 2 - cy) / cropSize) * 100;
  return {
    imageScale: roundTo(imageScale, 4),
    imageOffsetX: roundTo(imageOffsetX, 2),
    imageOffsetY: roundTo(imageOffsetY, 2),
  };
}

function roundTo(value: number, decimals: number) {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}
