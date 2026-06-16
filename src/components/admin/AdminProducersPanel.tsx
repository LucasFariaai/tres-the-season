import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { AdminFieldInput } from "@/components/admin/AdminFieldInput";
import { AdminFieldTextarea } from "@/components/admin/AdminFieldTextarea";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { buttonBase, cardStyle, fieldLabelStyle, sectionHeaderStyle, uiPalette } from "@/components/admin/adminStyles";
import { ProducerImageFrame } from "@/components/producers/ProducerImageFrame";
import { cropRectToFraming, framingToCropRect, type CropRect } from "@/components/admin/framingMath";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import type { VisualEditor } from "@/components/admin/types";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Producer = VisualEditor["content"]["producers"]["items"][number];

type Props = {
  editor: VisualEditor;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const EDITOR_BOX = 360;
const MIN_CROP_DISPLAY_PX = 32;

type Natural = { width: number; height: number };

type DragMode = "move" | "resize";

type DragState = {
  mode: DragMode;
  pointerId: number;
  startX: number;
  startY: number;
  startRect: CropRect;
  pxPerOrig: number;
};

/**
 * Computes the displayed rect (in container px) of an image rendered with
 * object-fit:contain inside the editor box.
 */
function getContainRect(natural: Natural, box: number) {
  const ratio = natural.width / natural.height;
  let width: number;
  let height: number;
  if (ratio >= 1) {
    width = box;
    height = box / ratio;
  } else {
    height = box;
    width = box * ratio;
  }
  const left = (box - width) / 2;
  const top = (box - height) / 2;
  return { left, top, width, height };
}

function FramingControls({
  producer,
  backgroundColor,
  onChange,
  onClear,
}: {
  producer: Producer;
  backgroundColor: string;
  onChange: (patch: Partial<Pick<Producer, "imageScale" | "imageOffsetX" | "imageOffsetY">>) => void;
  onClear?: () => void;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<DragState | null>(null);
  const [natural, setNatural] = useState<Natural | null>(null);
  const [dragging, setDragging] = useState<DragMode | null>(null);

  const scale = typeof producer.imageScale === "number" ? producer.imageScale : 1;
  const offsetX = typeof producer.imageOffsetX === "number" ? producer.imageOffsetX : 0;
  const offsetY = typeof producer.imageOffsetY === "number" ? producer.imageOffsetY : 0;

  // Reset natural size when the underlying image path changes.
  useEffect(() => {
    setNatural(null);
  }, [producer.image]);

  const editorSrc = useMemo(
    () => (producer.image ? resolveMediaUrl(producer.image, 1280, 82) ?? producer.image : null),
    [producer.image],
  );

  const contain = natural ? getContainRect(natural, EDITOR_BOX) : null;
  const cropRect = natural
    ? framingToCropRect(natural.width, natural.height, {
        imageScale: scale,
        imageOffsetX: offsetX,
        imageOffsetY: offsetY,
      })
    : null;

  // Convert the original-pixel crop rect into display pixels for overlay positioning.
  const cropDisplay = useMemo(() => {
    if (!natural || !contain || !cropRect) return null;
    const pxPerOrig = contain.width / natural.width;
    return {
      left: contain.left + cropRect.cropX * pxPerOrig,
      top: contain.top + cropRect.cropY * pxPerOrig,
      size: cropRect.cropSize * pxPerOrig,
      pxPerOrig,
    };
  }, [natural, contain, cropRect]);

  const applyRect = (next: CropRect) => {
    if (!natural) return;
    const minSide = Math.min(natural.width, natural.height);
    const minOrig = Math.max(1, (MIN_CROP_DISPLAY_PX / EDITOR_BOX) * Math.max(natural.width, natural.height));
    const size = clamp(next.cropSize, minOrig, minSide);
    const x = clamp(next.cropX, 0, natural.width - size);
    const y = clamp(next.cropY, 0, natural.height - size);
    const framing = cropRectToFraming(natural.width, natural.height, { cropX: x, cropY: y, cropSize: size });
    onChange(framing);
  };

  const beginDrag = (
    mode: DragMode,
    event: React.PointerEvent<HTMLElement>,
  ) => {
    if (!natural || !cropRect || !cropDisplay) return;
    event.preventDefault();
    event.stopPropagation();
    const pointerId = event.pointerId;
    (event.currentTarget as HTMLElement).setPointerCapture(pointerId);
    dragState.current = {
      mode,
      pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startRect: { ...cropRect },
      pxPerOrig: cropDisplay.pxPerOrig,
    };
    setDragging(mode);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const state = dragState.current;
    if (!state) return;
    const dxOrig = (event.clientX - state.startX) / state.pxPerOrig;
    const dyOrig = (event.clientY - state.startY) / state.pxPerOrig;
    if (state.mode === "move") {
      applyRect({
        cropX: state.startRect.cropX + dxOrig,
        cropY: state.startRect.cropY + dyOrig,
        cropSize: state.startRect.cropSize,
      });
    } else {
      // Resize from bottom-right corner; preserve square by averaging.
      const delta = (dxOrig + dyOrig) / 2;
      applyRect({
        cropX: state.startRect.cropX,
        cropY: state.startRect.cropY,
        cropSize: state.startRect.cropSize + delta,
      });
    }
  };

  const endDrag = (event: React.PointerEvent<HTMLElement>) => {
    const state = dragState.current;
    dragState.current = null;
    setDragging(null);
    if (state) {
      try {
        (event.currentTarget as HTMLElement).releasePointerCapture(state.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const reset = () => {
    if (!natural) {
      onChange({ imageScale: 1, imageOffsetX: 0, imageOffsetY: 0 });
      return;
    }
    const minSide = Math.min(natural.width, natural.height);
    applyRect({
      cropX: (natural.width - minSide) / 2,
      cropY: (natural.height - minSide) / 2,
      cropSize: minSide,
    });
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <span style={fieldLabelStyle}>Framing · drag the square to reposition, drag the corner to resize</span>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div
          ref={boxRef}
          style={{
            width: EDITOR_BOX,
            height: EDITOR_BOX,
            maxWidth: "100%",
            borderRadius: 10,
            overflow: "hidden",
            position: "relative",
            background: "#1a1410",
            border: "1px solid rgba(26,20,16,0.18)",
            flexShrink: 0,
            touchAction: "none",
            userSelect: "none",
          }}
        >
          {editorSrc ? (
            <img
              src={editorSrc}
              alt="Source"
              draggable={false}
              onLoad={(event) => {
                const target = event.currentTarget;
                setNatural({ width: target.naturalWidth, height: target.naturalHeight });
              }}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
                pointerEvents: "none",
                display: "block",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(255,255,255,0.55)",
                fontSize: 12,
                fontStyle: "italic",
              }}
            >
              No image selected
            </div>
          )}

          {contain && cropDisplay ? (
            <>
              {/* Dark mask outside the crop, built with 4 rectangles. */}
              <div style={maskStyle(0, 0, EDITOR_BOX, cropDisplay.top)} />
              <div
                style={maskStyle(
                  0,
                  cropDisplay.top + cropDisplay.size,
                  EDITOR_BOX,
                  EDITOR_BOX - (cropDisplay.top + cropDisplay.size),
                )}
              />
              <div style={maskStyle(0, cropDisplay.top, cropDisplay.left, cropDisplay.size)} />
              <div
                style={maskStyle(
                  cropDisplay.left + cropDisplay.size,
                  cropDisplay.top,
                  EDITOR_BOX - (cropDisplay.left + cropDisplay.size),
                  cropDisplay.size,
                )}
              />

              {/* Draggable crop square. */}
              <div
                onPointerDown={(event) => beginDrag("move", event)}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
                style={{
                  position: "absolute",
                  left: cropDisplay.left,
                  top: cropDisplay.top,
                  width: cropDisplay.size,
                  height: cropDisplay.size,
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.9), 0 0 0 2px rgba(0,0,0,0.4)",
                  cursor: dragging === "move" ? "grabbing" : "grab",
                  touchAction: "none",
                }}
              >
                {/* Rule-of-thirds guides */}
                <div style={gridLineStyle("h", 33.33)} />
                <div style={gridLineStyle("h", 66.66)} />
                <div style={gridLineStyle("v", 33.33)} />
                <div style={gridLineStyle("v", 66.66)} />

                {/* Resize handle (bottom-right) */}
                <div
                  onPointerDown={(event) => beginDrag("resize", event)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  title="Drag to resize"
                  style={{
                    position: "absolute",
                    right: -7,
                    bottom: -7,
                    width: 14,
                    height: 14,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.95)",
                    boxShadow: "0 0 0 1px rgba(0,0,0,0.4)",
                    cursor: dragging === "resize" ? "nwse-resize" : "nwse-resize",
                    touchAction: "none",
                  }}
                />
              </div>
            </>
          ) : null}

          {onClear && producer.image ? (
            <button
              type="button"
              onPointerDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.stopPropagation();
                onClear();
              }}
              aria-label="Remove photo"
              title="Remove photo"
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
                zIndex: 5,
              }}
            >
              <Trash2 size={16} />
            </button>
          ) : null}
        </div>

        <div style={{ flex: 1, minWidth: 180, display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <span style={{ ...fieldLabelStyle, fontSize: 11 }}>How it appears on the site</span>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: 6,
                overflow: "hidden",
                background: backgroundColor,
                border: "1px solid rgba(26,20,16,0.12)",
              }}
            >
              <ProducerImageFrame
                image={producer.image}
                alt="Site preview"
                frameSize={120}
                backgroundColor={backgroundColor}
                scale={scale}
                offsetX={offsetX}
                offsetY={offsetY}
                mediaWidth={400}
                quality={80}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={reset}
            style={{ ...buttonBase, padding: "6px 12px", color: uiPalette.controlText, fontSize: 11, justifySelf: "start" }}
          >
            Reset framing
          </button>
        </div>
      </div>
    </div>
  );
}

const maskStyle = (left: number, top: number, width: number, height: number): React.CSSProperties => ({
  position: "absolute",
  left,
  top,
  width: Math.max(0, width),
  height: Math.max(0, height),
  background: "rgba(0,0,0,0.55)",
  pointerEvents: "none",
});

const gridLineStyle = (orientation: "h" | "v", percent: number): React.CSSProperties => ({
  position: "absolute",
  left: orientation === "v" ? `${percent}%` : 0,
  top: orientation === "h" ? `${percent}%` : 0,
  width: orientation === "v" ? 1 : "100%",
  height: orientation === "h" ? 1 : "100%",
  background: "rgba(255,255,255,0.35)",
  pointerEvents: "none",
});

// Silence the unused toast import warning if it appears (toast remains used elsewhere in this file).
void toast;



export function AdminProducersPanel({ editor }: Props) {
  const producersBackground = editor.theme.producersBackground;

  const setProducers = <K extends keyof VisualEditor["content"]["producers"]>(
    key: K,
    value: VisualEditor["content"]["producers"][K],
  ) => {
    editor.setContent((current) => ({ ...current, producers: { ...current.producers, [key]: value } }));
  };

  const [pendingRemoveIndex, setPendingRemoveIndex] = useState<number | null>(null);
  const pendingRemoveProducer = pendingRemoveIndex !== null ? editor.content.producers.items[pendingRemoveIndex] : null;

  const setProducer = (index: number, key: keyof Producer, value: Producer[keyof Producer]) => {
    editor.setContent((current) => ({
      ...current,
      producers: {
        ...current.producers,
        items: current.producers.items.map((producer, producerIndex) =>
          producerIndex === index ? { ...producer, [key]: value } : producer,
        ),
      },
    }));
  };

  const patchProducer = (index: number, patch: Partial<Producer>) => {
    editor.setContent((current) => ({
      ...current,
      producers: {
        ...current.producers,
        items: current.producers.items.map((producer, producerIndex) =>
          producerIndex === index ? { ...producer, ...patch } : producer,
        ),
      },
    }));
  };

  const addProducer = () => {
    editor.setContent((current) => ({
      ...current,
      producers: {
        ...current.producers,
        items: [
          ...current.producers.items,
          {
            name: "New producer",
            specialty: "",
            distance: "0km",
            image: "",
            region: "",
            lat: 51.9,
            lng: 4.495,
            quote: "",
            imageScale: 1,
            imageOffsetX: 0,
            imageOffsetY: 0,
          },
        ],
      },
    }));
  };

  const removeProducer = (index: number) => {
    editor.setContent((current) => ({
      ...current,
      producers: {
        ...current.producers,
        items: current.producers.items.filter((_, producerIndex) => producerIndex !== index),
      },
    }));
  };

  const moveProducer = (index: number, direction: -1 | 1) => {
    editor.setContent((current) => {
      const nextItems = [...current.producers.items];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= nextItems.length) return current;
      [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
      return { ...current, producers: { ...current.producers, items: nextItems } };
    });
  };

  const uploadImage = async (file: File, index: number) => {
    const result = await editor.uploadMedia(file, ["producers"]);
    if (result.error || !result.item?.file_path) {
      toast({ title: "Upload failed", description: result.error ?? "The file could not be stored.", variant: "destructive" });
      return;
    }
    setProducer(index, "image", result.item.file_path);
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div style={{ display: "grid", gap: 14, maxWidth: 720 }}>
        <h2 style={sectionHeaderStyle}>Closing quote</h2>
        <AdminFieldTextarea label="Shown below the map cards" value={editor.content.producers.closingQuote} minRows={2} onChange={(value) => setProducers("closingQuote", value)} />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={sectionHeaderStyle}>Map points ({editor.content.producers.items.length})</h2>
        <button type="button" onClick={addProducer} style={{ ...buttonBase, padding: "8px 14px", color: uiPalette.controlText }}>
          + Add point
        </button>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(min(440px, 100%), 1fr))" }}>
        {editor.content.producers.items.map((producer, index) => (
          <div key={`${producer.name}-${index}`} style={{ ...cardStyle, display: "grid", gap: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: 18, color: uiPalette.controlText }}>
                  {producer.name || `Point ${index + 1}`}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" onClick={() => moveProducer(index, -1)} disabled={index === 0} style={{ ...buttonBase, padding: "6px 10px", opacity: index === 0 ? 0.4 : 1, color: uiPalette.controlText, fontSize: 11 }}>
                    ↑
                  </button>
                  <button type="button" onClick={() => moveProducer(index, 1)} disabled={index === editor.content.producers.items.length - 1} style={{ ...buttonBase, padding: "6px 10px", opacity: index === editor.content.producers.items.length - 1 ? 0.4 : 1, color: uiPalette.controlText, fontSize: 11 }}>
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingRemoveIndex(index)}
                    style={{ ...buttonBase, padding: "6px 10px", color: "#c0533b", borderColor: "rgba(192,83,59,0.4)", fontSize: 11 }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <FramingControls
                producer={producer}
                backgroundColor={producersBackground}
                onChange={(patch) => patchProducer(index, patch)}
                onClear={() => setProducer(index, "image", "")}
              />

              <AdminImagePicker
                title="Photo"
                value={producer.image}
                mediaLibrary={editor.mediaLibrary}
                uploadTags={["producers"]}
                hidePreview
                onApply={(filePath) => setProducer(index, "image", filePath)}
                onUpload={(file) => uploadImage(file, index)}
              />

              <AdminFieldInput label="Name" value={producer.name} onChange={(value) => setProducer(index, "name", value)} />
              <AdminFieldInput label="Specialty" value={producer.specialty} onChange={(value) => setProducer(index, "specialty", value)} />

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))" }}>
                <AdminFieldInput label="Region" value={producer.region} onChange={(value) => setProducer(index, "region", value)} />
                <AdminFieldInput label="Distance" value={producer.distance} onChange={(value) => setProducer(index, "distance", value)} />
              </div>

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))" }}>
                <AdminFieldInput
                  label="Latitude"
                  value={String(producer.lat)}
                  onChange={(value) => {
                    const parsed = parseFloat(value);
                    if (!Number.isNaN(parsed)) setProducer(index, "lat", parsed);
                  }}
                />
                <AdminFieldInput
                  label="Longitude"
                  value={String(producer.lng)}
                  onChange={(value) => {
                    const parsed = parseFloat(value);
                    if (!Number.isNaN(parsed)) setProducer(index, "lng", parsed);
                  }}
                />
              </div>

              <AdminFieldTextarea label="Quote (shown when card is expanded)" value={producer.quote} minRows={3} onChange={(value) => setProducer(index, "quote", value)} />
            </div>
          ))}
        </div>

      <AlertDialog
        open={pendingRemoveIndex !== null}
        onOpenChange={(open) => {
          if (!open) setPendingRemoveIndex(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this producer?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingRemoveProducer
                ? `"${pendingRemoveProducer.name || `Point ${(pendingRemoveIndex ?? 0) + 1}`}" will be removed from the producers list. This action cannot be undone until you discard the draft.`
                : "This producer will be removed."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (pendingRemoveIndex !== null) removeProducer(pendingRemoveIndex);
                setPendingRemoveIndex(null);
              }}
              style={{ backgroundColor: "#c0533b" }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
