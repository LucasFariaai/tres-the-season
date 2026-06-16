import { useState } from "react";
import { AdminFieldInput } from "@/components/admin/AdminFieldInput";
import { AdminFieldTextarea } from "@/components/admin/AdminFieldTextarea";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { buttonBase, cardStyle, sectionHeaderStyle, uiPalette } from "@/components/admin/adminStyles";
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
