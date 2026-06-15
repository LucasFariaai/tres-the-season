import { useRef, useState } from "react";
import { AdminFieldInput } from "@/components/admin/AdminFieldInput";
import { AdminFieldTextarea } from "@/components/admin/AdminFieldTextarea";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { buttonBase, cardStyle, fieldLabelStyle, sectionHeaderStyle, uiPalette } from "@/components/admin/adminStyles";
import type { VisualEditor } from "@/components/admin/types";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import { toast } from "@/components/ui/use-toast";

type Producer = VisualEditor["content"]["producers"]["items"][number];

type Props = {
  editor: VisualEditor;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function FramingControls({
  producer,
  backgroundColor,
  onChange,
}: {
  producer: Producer;
  backgroundColor: string;
  onChange: (patch: Partial<Pick<Producer, "imageScale" | "imageOffsetX" | "imageOffsetY">>) => void;
}) {
  const previewRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{ startX: number; startY: number; baseX: number; baseY: number; width: number; height: number } | null>(null);
  const [dragging, setDragging] = useState(false);

  const scale = typeof producer.imageScale === "number" ? producer.imageScale : 1;
  const offsetX = typeof producer.imageOffsetX === "number" ? producer.imageOffsetX : 0;
  const offsetY = typeof producer.imageOffsetY === "number" ? producer.imageOffsetY : 0;

  const previewUrl = resolveMediaUrl(producer.image, 600, 82) ?? producer.image;

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
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Framing preview"
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: scale < 1 ? "contain" : "cover",
                transform: `translate(${offsetX}%, ${offsetY}%) scale(${scale})`,
                transformOrigin: "center center",
                pointerEvents: "none",
                userSelect: "none",
              }}
            />
          ) : null}
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
          const previewUrl = resolveMediaUrl(producer.image, 280, 80) ?? producer.image;
          return (
            <div key={`${producer.name}-${index}`} style={{ ...cardStyle, display: "grid", gap: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 8, border: "1px solid rgba(26,20,16,0.06)", overflow: "hidden", background: producersBackground, flexShrink: 0, position: "relative" }}>
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={producer.name}
                        style={{
                          position: "absolute",
                          inset: 0,
                          width: "100%",
                          height: "100%",
                          objectFit: (producer.imageScale ?? 1) < 1 ? "contain" : "cover",
                          transform: `translate(${producer.imageOffsetX ?? 0}%, ${producer.imageOffsetY ?? 0}%) scale(${producer.imageScale ?? 1})`,
                          transformOrigin: "center center",
                          display: "block",
                        }}
                        loading="lazy"
                      />
                    ) : null}
                  </div>
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
                    onClick={() => {
                      if (window.confirm(`Remove "${producer.name || `point ${index + 1}`}"?`)) removeProducer(index);
                    }}
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
    </div>
  );
}
