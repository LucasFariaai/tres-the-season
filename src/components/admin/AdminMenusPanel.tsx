import { useState } from "react";
import { AdminFieldInput } from "@/components/admin/AdminFieldInput";
import { AdminFieldTextarea } from "@/components/admin/AdminFieldTextarea";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { buttonBase, sectionHeaderStyle, uiPalette } from "@/components/admin/adminStyles";
import type { VisualEditor } from "@/components/admin/types";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import type { Season } from "@/lib/site-editor/types";
import { toast } from "@/components/ui/use-toast";

const SEASONS: { id: Season; label: string }[] = [
  { id: "spring", label: "Spring" },
  { id: "summer", label: "Summer" },
  { id: "autumn", label: "Autumn" },
  { id: "winter", label: "Winter" },
];

type Props = {
  editor: VisualEditor;
};

export function AdminMenusPanel({ editor }: Props) {
  const [activeSeason, setActiveSeason] = useState<Season>("spring");
  const activeMenu = editor.content.menus[activeSeason];

  type MenuDish = VisualEditor["content"]["menus"][Season]["items"][number];

  const setSubtitle = (value: string) => {
    editor.setContent((current) => ({
      ...current,
      menus: { ...current.menus, [activeSeason]: { ...current.menus[activeSeason], subtitle: value } },
    }));
  };

  const setDish = (index: number, key: keyof MenuDish, value: string) => {
    editor.setContent((current) => ({
      ...current,
      menus: {
        ...current.menus,
        [activeSeason]: {
          ...current.menus[activeSeason],
          items: current.menus[activeSeason].items.map((dish, dishIndex) =>
            dishIndex === index ? { ...dish, [key]: value } : dish,
          ),
        },
      },
    }));
  };

  const addDish = () => {
    editor.setContent((current) => ({
      ...current,
      menus: {
        ...current.menus,
        [activeSeason]: {
          ...current.menus[activeSeason],
          items: [...current.menus[activeSeason].items, { name: "New dish", description: "", image: "" }],
        },
      },
    }));
  };

  const removeDish = (index: number) => {
    editor.setContent((current) => ({
      ...current,
      menus: {
        ...current.menus,
        [activeSeason]: {
          ...current.menus[activeSeason],
          items: current.menus[activeSeason].items.filter((_, dishIndex) => dishIndex !== index),
        },
      },
    }));
  };

  const moveDish = (index: number, direction: -1 | 1) => {
    editor.setContent((current) => {
      const nextItems = [...current.menus[activeSeason].items];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= nextItems.length) return current;
      [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
      return {
        ...current,
        menus: { ...current.menus, [activeSeason]: { ...current.menus[activeSeason], items: nextItems } },
      };
    });
  };

  const uploadDishImage = async (file: File, index: number) => {
    const result = await editor.uploadMedia(file, ["menus", activeSeason]);
    if (result.error || !result.item?.file_path) {
      toast({ title: "Upload failed", description: result.error ?? "The file could not be stored.", variant: "destructive" });
      return;
    }
    setDish(index, "image", result.item.file_path);
  };

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Season tabs */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", borderBottom: `1px solid ${uiPalette.controlBorder}`, paddingBottom: 12 }}>
        {SEASONS.map((season) => {
          const isActive = activeSeason === season.id;
          return (
            <button
              key={season.id}
              type="button"
              onClick={() => setActiveSeason(season.id)}
              style={{
                ...buttonBase,
                padding: "8px 18px",
                fontSize: 12,
                background: isActive ? uiPalette.accent : "transparent",
                borderColor: isActive ? uiPalette.accent : uiPalette.ghostBorder,
                color: isActive ? uiPalette.accentText : uiPalette.controlText,
              }}
            >
              {season.label}
            </button>
          );
        })}
      </div>

      <AdminFieldInput
        label="Season subtitle"
        value={activeMenu.subtitle}
        onChange={setSubtitle}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={sectionHeaderStyle}>Dishes ({activeMenu.items.length})</h2>
        <button type="button" onClick={addDish} style={{ ...buttonBase, padding: "8px 14px", color: uiPalette.controlText }}>
          + Add dish
        </button>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))" }}>
        {activeMenu.items.map((dish, index) => {
          const previewUrl = resolveMediaUrl(dish.image, 320, 80) ?? dish.image;
          return (
            <div key={`${activeSeason}-${index}`} style={{ display: "grid", gap: 14, border: `1px solid ${uiPalette.controlBorder}`, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic", fontSize: 18, color: uiPalette.controlText }}>
                  {String(index + 1).padStart(2, "0")} · {dish.name || "Untitled"}
                </span>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" onClick={() => moveDish(index, -1)} disabled={index === 0} style={{ ...buttonBase, padding: "6px 10px", opacity: index === 0 ? 0.4 : 1, color: uiPalette.controlText, fontSize: 11 }}>
                    ↑
                  </button>
                  <button type="button" onClick={() => moveDish(index, 1)} disabled={index === activeMenu.items.length - 1} style={{ ...buttonBase, padding: "6px 10px", opacity: index === activeMenu.items.length - 1 ? 0.4 : 1, color: uiPalette.controlText, fontSize: 11 }}>
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Remove "${dish.name || `dish ${index + 1}`}"?`)) removeDish(index);
                    }}
                    style={{ ...buttonBase, padding: "6px 10px", color: "#c0533b", borderColor: "rgba(192,83,59,0.4)", fontSize: 11 }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gap: 14, gridTemplateColumns: previewUrl ? "120px 1fr" : "1fr", alignItems: "start" }}>
                {previewUrl ? (
                  <div style={{ width: 120, height: 150, border: `1px solid ${uiPalette.controlBorder}`, overflow: "hidden", background: "rgba(26,20,16,0.08)" }}>
                    <img src={previewUrl} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" />
                  </div>
                ) : null}
                <div style={{ display: "grid", gap: 10 }}>
                  <AdminFieldInput label="Name" value={dish.name} onChange={(value) => setDish(index, "name", value)} />
                  <AdminFieldTextarea label="Description" value={dish.description} minRows={2} onChange={(value) => setDish(index, "description", value)} />
                </div>
              </div>

              <AdminImagePicker
                title="Dish photo"
                value={dish.image}
                mediaLibrary={editor.mediaLibrary}
                uploadTags={["menus", activeSeason]}
                quickPickTags={["menus", activeSeason]}
                quickPickLimit={4}
                onApply={(filePath) => setDish(index, "image", filePath)}
                onUpload={(file) => uploadDishImage(file, index)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
