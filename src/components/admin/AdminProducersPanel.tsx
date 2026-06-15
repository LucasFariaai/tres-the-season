import { useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { AdminFieldInput } from "@/components/admin/AdminFieldInput";
import { AdminFieldTextarea } from "@/components/admin/AdminFieldTextarea";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { buttonBase, cardStyle, fieldLabelStyle, sectionHeaderStyle, uiPalette } from "@/components/admin/adminStyles";
import { ProducerImageFrame } from "@/components/producers/ProducerImageFrame";
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
  const previewRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ startX: number; startY: number; baseX: number; baseY: number; width: number; height: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const scale = typeof producer.imageScale === "number" ? producer.imageScale : 1;
  const offsetX = typeof producer.imageOffsetX === "number" ? producer.imageOffsetX : 0;
  const offsetY = typeof producer.imageOffsetY === "number" ? producer.imageOffsetY : 0;

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    dragState.current = {
      startX: event.clientX,
      startY: event.clientY,
      baseX: offsetX,
      baseY: offsetY,
      width: rect.width,
      height: rect.height,
    };
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    setDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const state = dragState.current;
    if (!state) return;
    const dxPct = ((event.clientX - state.startX) / state.width) * 100;
    const dyPct = ((event.clientY - state.startY) / state.height) * 100;
    onChange({
      imageOffsetX: clamp(Math.round(state.baseX + dxPct), -50, 50),
      imageOffsetY: clamp(Math.round(state.baseY + dyPct), -50, 50),
    });
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    dragState.current = null;
    setDragging(false);
    try {
      (event.target as HTMLElement).releasePointerCapture(event.pointerId);
    } catch {
      // ignore
    }
  };

  const reset = () => onChange({ imageScale: 1, imageOffsetX: 0, imageOffsetY: 0 });

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <span style={fieldLabelStyle}>Framing (drag to reposition · slider to zoom)</span>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div
          ref={previewRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            width: 160,
            height: 160,
            borderRadius: 8,
            overflow: "hidden",
            position: "relative",
            backgroundColor,
            border: "1px solid rgba(26,20,16,0.1)",
            cursor: dragging ? "grabbing" : "grab",
            touchAction: "none",
            flexShrink: 0,
          }}
        >
          <ProducerImageFrame image={producer.image} alt="Framing preview" frameSize={160} backgroundColor={backgroundColor} scale={scale} offsetX={offsetX} offsetY={offsetY} mediaWidth={600} quality={82} />
        </div>

        <div style={{ flex: 1, minWidth: 200, display: "grid", gap: 10 }}>
          <label style={{ display: "grid", gap: 4, fontSize: 12, color: uiPalette.controlText }}>
            <span>Zoom: {scale.toFixed(2)}×</span>
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.01}
              value={scale}
              onChange={(event) => onChange({ imageScale: parseFloat(event.target.value) })}
            />
          </label>
          <label style={{ display: "grid", gap: 4, fontSize: 12, color: uiPalette.controlText }}>
            <span>Horizontal: {offsetX}%</span>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={offsetX}
              onChange={(event) => onChange({ imageOffsetX: parseInt(event.target.value, 10) })}
            />
          </label>
          <label style={{ display: "grid", gap: 4, fontSize: 12, color: uiPalette.controlText }}>
            <span>Vertical: {offsetY}%</span>
            <input
              type="range"
              min={-50}
              max={50}
              step={1}
              value={offsetY}
              onChange={(event) => onChange({ imageOffsetY: parseInt(event.target.value, 10) })}
            />
          </label>
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
        {editor.content.producers.items.map((producer, index) => {
          const previewScale = typeof producer.imageScale === "number" ? producer.imageScale : 1;
          const previewOffsetX = typeof producer.imageOffsetX === "number" ? producer.imageOffsetX : 0;
          const previewOffsetY = typeof producer.imageOffsetY === "number" ? producer.imageOffsetY : 0;
          return (
            <div key={`${producer.name}-${index}`} style={{ ...cardStyle, display: "grid", gap: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                  <ProducerImageFrame image={producer.image} alt={producer.name} frameSize={56} backgroundColor={producersBackground} scale={previewScale} offsetX={previewOffsetX} offsetY={previewOffsetY} mediaWidth={280} quality={80} />
                  <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: 18, color: uiPalette.controlText }}>
                    {producer.name || `Point ${index + 1}`}
                  </span>
                </div>
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

              <AdminImagePicker
                title="Photo"
                value={producer.image}
                mediaLibrary={editor.mediaLibrary}
                uploadTags={["producers"]}
                quickPickTags={["producers"]}
                quickPickLimit={4}
                onApply={(filePath) => setProducer(index, "image", filePath)}
                onUpload={(file) => uploadImage(file, index)}
                onClear={() => setProducer(index, "image", "")}
                clearLabel="Remove photo"
              />

              <FramingControls
                producer={producer}
                backgroundColor={producersBackground}
                onChange={(patch) => patchProducer(index, patch)}
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
          );
        })}
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
