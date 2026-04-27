import { AdminFieldInput } from "@/components/admin/AdminFieldInput";
import { AdminFieldTextarea } from "@/components/admin/AdminFieldTextarea";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { buttonBase, cardStyle, sectionHeaderStyle, uiPalette } from "@/components/admin/adminStyles";
import type { VisualEditor } from "@/components/admin/types";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import { toast } from "@/components/ui/use-toast";

type Producer = VisualEditor["content"]["producers"]["items"][number];

type Props = {
  editor: VisualEditor;
};

export function AdminProducersPanel({ editor }: Props) {
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

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))" }}>
        {editor.content.producers.items.map((producer, index) => {
          const previewUrl = resolveMediaUrl(producer.image, 280, 80) ?? producer.image;
          return (
            <div key={`${producer.name}-${index}`} style={{ ...cardStyle, display: "grid", gap: 14, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", minWidth: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 8, border: "1px solid rgba(26,20,16,0.06)", overflow: "hidden", background: "rgba(26,20,16,0.04)", flexShrink: 0 }}>
                    {previewUrl ? <img src={previewUrl} alt={producer.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" /> : null}
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

              <AdminFieldInput label="Name" value={producer.name} onChange={(value) => setProducer(index, "name", value)} />
              <AdminFieldInput label="Specialty" value={producer.specialty} onChange={(value) => setProducer(index, "specialty", value)} />

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
                <AdminFieldInput label="Region" value={producer.region} onChange={(value) => setProducer(index, "region", value)} />
                <AdminFieldInput label="Distance" value={producer.distance} onChange={(value) => setProducer(index, "distance", value)} />
              </div>

              <div style={{ display: "grid", gap: 10, gridTemplateColumns: "1fr 1fr" }}>
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
