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

export function getImageUrl(path: string | null, width: number = 1920, quality: number = 82): string | null {
  if (!path) return null;
  const base = import.meta.env.VITE_SUPABASE_URL;
  return `${base}/storage/v1/render/image/public/tres-images/${path}?width=${width}&format=webp&quality=${quality}`;
}

export function getThumbUrl(path: string | null): string | null {
  return getImageUrl(path, 400, 70);
}
