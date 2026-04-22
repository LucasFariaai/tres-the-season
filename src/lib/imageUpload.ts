import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";

export async function uploadSiteImage(file: File, path: string): Promise<string> {
  const compressed = await imageCompression(file, {
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
