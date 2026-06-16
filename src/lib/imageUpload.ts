import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";

/**
 * Decode the file honoring EXIF orientation and re-encode the pixels in their
 * displayed orientation. This guarantees that whatever lands in storage has
 * naturalWidth/naturalHeight matching what the user actually sees — critical
 * for the framing editor, which reads those values to compute the crop.
 *
 * Falls back to the original File if the browser cannot honor
 * `imageOrientation: "from-image"` (older Safari).
 */
async function normalizeOrientation(file: File): Promise<File> {
  if (typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close?.();
      return file;
    }
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close?.();

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.95),
    );
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[a-z0-9]+$/i, ".jpg"), {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}

export async function uploadSiteImage(file: File, path: string): Promise<string> {
  const oriented = await normalizeOrientation(file);

  const compressed = await imageCompression(oriented, {
    maxSizeMB: 4,
    maxWidthOrHeight: 3840,
    useWebWorker: true,
    fileType: "image/jpeg",
    initialQuality: 0.88,
  });

  const { error } = await supabase.storage
    .from("tres-images")
    .upload(path, compressed, { upsert: true, contentType: "image/jpeg" });

  if (error) throw error;

  return path;
}

/**
 * Rotate the image stored at `path` by `degrees` (multiples of 90) and re-upload
 * it to the same path. Used to repair legacy assets that were saved with the
 * wrong orientation before EXIF normalization was in place.
 */
export async function rotateStoredImage(path: string, degrees: 90 | 180 | 270): Promise<void> {
  const base = import.meta.env.VITE_SUPABASE_URL;
  // Hit the raw object (not the render endpoint) so we get the actual stored pixels.
  const url = `${base}/storage/v1/object/public/tres-images/${path}?cb=${Date.now()}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to fetch image (${response.status})`);
  const blob = await response.blob();

  const bitmap = await createImageBitmap(blob);
  const rotated = ((degrees % 360) + 360) % 360;
  const swap = rotated === 90 || rotated === 270;
  const canvas = document.createElement("canvas");
  canvas.width = swap ? bitmap.height : bitmap.width;
  canvas.height = swap ? bitmap.width : bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close?.();
    throw new Error("Canvas 2D context unavailable");
  }
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotated * Math.PI) / 180);
  ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
  bitmap.close?.();

  const outBlob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.92),
  );
  if (!outBlob) throw new Error("Failed to encode rotated image");

  const { error } = await supabase.storage
    .from("tres-images")
    .upload(path, outBlob, { upsert: true, contentType: "image/jpeg" });
  if (error) throw error;
}

export function getImageUrl(path: string | null, width: number = 1920, quality: number = 82): string | null {
  if (!path) return null;
  const base = import.meta.env.VITE_SUPABASE_URL;
  return `${base}/storage/v1/render/image/public/tres-images/${path}?width=${width}&format=webp&quality=${quality}`;
}

export function getThumbUrl(path: string | null): string | null {
  return getImageUrl(path, 400, 70);
}
