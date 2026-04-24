import { useEffect } from "react";
import type { TresGalleryItem, TresGalleryWidth } from "@/data/tresGalleryItems";
import { AdminFieldInput } from "@/components/admin/AdminFieldInput";
import { AdminFieldTextarea } from "@/components/admin/AdminFieldTextarea";
import { AdminHistoryPanel } from "@/components/admin/AdminHistoryPanel";
import { AdminImagePicker } from "@/components/admin/AdminImagePicker";
import { buttonBase, fieldLabelStyle, sectionHeaderStyle, toolbarHeight, uiPalette } from "@/components/admin/adminStyles";
import type { Selection, VisualEditor } from "@/components/admin/types";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";

const unavailableMessage = "This section is configured through its data files or the season context. Direct editing is not available here.";

function toLineString(lines: string[]) {
  return lines.join("\n");
}

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

type AdminEditPanelProps = {
  editor: VisualEditor;
  selection: Selection | null;
  onClose: () => void;
};

export function AdminEditPanel({ editor, selection, onClose }: AdminEditPanelProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!selection) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, selection]);

  const setHero = <K extends keyof VisualEditor["content"]["hero"]>(key: K, value: VisualEditor["content"]["hero"][K]) => {
    editor.setContent((current) => ({ ...current, hero: { ...current.hero, [key]: value } }));
  };

  const setConcept = <K extends keyof VisualEditor["content"]["concept"]>(key: K, value: VisualEditor["content"]["concept"][K]) => {
    editor.setContent((current) => ({ ...current, concept: { ...current.concept, [key]: value } }));
  };

  const setReserve = <K extends keyof VisualEditor["content"]["reserve"]>(key: K, value: VisualEditor["content"]["reserve"][K]) => {
    editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, [key]: value } }));
  };

  const setFooter = <K extends keyof VisualEditor["content"]["footer"]>(key: K, value: VisualEditor["content"]["footer"][K]) => {
    editor.setContent((current) => ({ ...current, footer: { ...current.footer, [key]: value } }));
  };

  const setGreenStar = <K extends keyof VisualEditor["content"]["greenStar"]>(key: K, value: VisualEditor["content"]["greenStar"][K]) => {
    editor.setContent((current) => ({ ...current, greenStar: { ...current.greenStar, [key]: value } }));
  };

  const setGreenStarPillar = (
    index: number,
    key: keyof VisualEditor["content"]["greenStar"]["pillars"][number],
    value: string,
  ) => {
    editor.setContent((current) => ({
      ...current,
      greenStar: {
        ...current.greenStar,
        pillars: current.greenStar.pillars.map((pillar, pillarIndex) =>
          pillarIndex === index ? { ...pillar, [key]: value } : pillar,
        ),
      },
    }));
  };

  const setLivingMenuTransition = <K extends keyof VisualEditor["content"]["livingMenuTransition"]>(key: K, value: VisualEditor["content"]["livingMenuTransition"][K]) => {
    editor.setContent((current) => ({ ...current, livingMenuTransition: { ...current.livingMenuTransition, [key]: value } }));
  };

  const setCircleTransition = <K extends keyof VisualEditor["content"]["circleTransition"]>(key: K, value: VisualEditor["content"]["circleTransition"][K]) => {
    editor.setContent((current) => ({ ...current, circleTransition: { ...current.circleTransition, [key]: value } }));
  };

  const setGallery = <K extends keyof VisualEditor["content"]["gallery"]>(key: K, value: VisualEditor["content"]["gallery"][K]) => {
    editor.setContent((current) => ({ ...current, gallery: { ...current.gallery, [key]: value } }));
  };

  const applyGalleryItem = (index: number, updater: (item: TresGalleryItem) => TresGalleryItem) => {
    editor.setContent((current) => ({
      ...current,
      gallery: {
        ...current.gallery,
        items: current.gallery.items.map((item, itemIndex) => (itemIndex === index ? updater(item) : item)),
      },
    }));
  };

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    editor.setContent((current) => {
      const nextItems = [...current.gallery.items];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= nextItems.length) return current;
      [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
      return { ...current, gallery: { ...current.gallery, items: nextItems } };
    });
  };

  const uploadToField = async (file: File, tags: string[], apply: (filePath: string) => void) => {
    const result = await editor.uploadMedia(file, tags);
    if (result.error || !result.item?.file_path) {
      toast({ title: "Upload failed", description: result.error ?? "The file could not be stored.", variant: "destructive" });
      return;
    }
    apply(result.item.file_path);
  };

  const renderUnavailable = () => (
    <p style={{ margin: 0, fontFamily: '"Abel", sans-serif', fontSize: 14, lineHeight: 1.6, color: uiPalette.controlMuted }}>{unavailableMessage}</p>
  );

  const renderZoom = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <h2 style={sectionHeaderStyle}>Zoom images</h2>
      <div style={{ display: "grid", gap: 16 }}>
        {editor.content.zoom.images.map((image, index) => (
          <div key={`${image.src}-${index}`} style={{ display: "grid", gap: 12, padding: 12, border: `1px solid ${uiPalette.controlBorder}` }}>
            <AdminImagePicker
              title={`Zoom image ${index + 1}`}
              value={image.src}
              mediaLibrary={editor.mediaLibrary}
              uploadLabel="Change"
              uploadTags={["zoom"]}
              quickPickTags={["zoom"]}
              quickPickLimit={3}
              onApply={(filePath) => {
                editor.setContent((current) => ({
                  ...current,
                  zoom: {
                    ...current.zoom,
                    images: current.zoom.images.map((currentImage, imageIndex) =>
                      imageIndex === index ? { ...currentImage, src: filePath } : currentImage,
                    ),
                  },
                }));
              }}
              onUpload={(file, tags) =>
                uploadToField(file, tags, (filePath) => {
                  editor.setContent((current) => ({
                    ...current,
                    zoom: {
                      ...current.zoom,
                      images: current.zoom.images.map((currentImage, imageIndex) =>
                        imageIndex === index ? { ...currentImage, src: filePath } : currentImage,
                      ),
                    },
                  }));
                })
              }
            />
            <AdminFieldTextarea
              label="Alt"
              value={image.alt}
              minRows={1}
              onChange={(value) => {
                editor.setContent((current) => ({
                  ...current,
                  zoom: {
                    ...current.zoom,
                    images: current.zoom.images.map((currentImage, imageIndex) =>
                      imageIndex === index ? { ...currentImage, alt: value } : currentImage,
                    ),
                  },
                }));
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderGallery = () => (
    <div style={{ display: "grid", gap: 16 }}>
      <AdminFieldTextarea label="Eyebrow" value={editor.content.gallery.eyebrow} minRows={1} onChange={(value) => setGallery("eyebrow", value)} />
      <AdminFieldTextarea label="Subtitle" value={editor.content.gallery.subtitle} minRows={2} onChange={(value) => setGallery("subtitle", value)} />
      <div style={{ display: "grid", gap: 12, maxHeight: isMobile ? "none" : "58vh", overflowY: "auto", paddingRight: 4 }}>
        {editor.content.gallery.items.map((item, index) => {
          const imageUrl = resolveMediaUrl(item.mediaSrc, 240, 80) ?? item.mediaSrc;
          return (
            <div key={item.id} style={{ display: "grid", gap: 12, border: `1px solid ${uiPalette.controlBorder}`, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 60, height: 60, border: `1px solid ${uiPalette.controlBorder}`, overflow: "hidden", background: "hsl(24 18% 10%)" }}>
                    {imageUrl ? <img src={imageUrl} alt={item.alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} loading="lazy" /> : null}
                  </div>
                  <div style={{ display: "grid", gap: 4 }}>
                    <span style={{ fontFamily: '"Fraunces", serif', fontStyle: "italic", fontSize: 18, color: uiPalette.controlText }}>Gallery item {index + 1}</span>
                    <label
                      htmlFor={`gallery-upload-${index}`}
                      style={{
                        ...buttonBase,
                        display: "inline-flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "fit-content",
                        padding: "7px 10px",
                        color: uiPalette.controlText,
                        borderColor: uiPalette.controlBorder,
                        fontSize: 11,
                      }}
                    >
                      Change
                    </label>
                    <input
                      id={`gallery-upload-${index}`}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        void uploadToField(file, ["gallery"], (filePath) => applyGalleryItem(index, (current) => ({ ...current, mediaSrc: filePath })));
                        event.target.value = "";
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button type="button" onClick={() => moveGalleryItem(index, -1)} disabled={index === 0} style={{ ...buttonBase, padding: "6px 10px", opacity: index === 0 ? 0.4 : 1, color: uiPalette.controlText }}>
                    Move up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveGalleryItem(index, 1)}
                    disabled={index === editor.content.gallery.items.length - 1}
                    style={{ ...buttonBase, padding: "6px 10px", opacity: index === editor.content.gallery.items.length - 1 ? 0.4 : 1, color: uiPalette.controlText }}
                  >
                    Move down
                  </button>
                </div>
              </div>

              <AdminFieldTextarea label="Label" value={item.label ?? ""} minRows={1} onChange={(value) => applyGalleryItem(index, (current) => ({ ...current, label: value }))} />
              <AdminFieldTextarea label="Caption" value={item.caption ?? ""} minRows={3} onChange={(value) => applyGalleryItem(index, (current) => ({ ...current, caption: value }))} />
              <AdminFieldTextarea label="Alt" value={item.alt} minRows={2} onChange={(value) => applyGalleryItem(index, (current) => ({ ...current, alt: value }))} />

              <div style={{ display: "grid", gap: 8 }}>
                <span style={fieldLabelStyle}>Width</span>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(["narrow", "medium", "wide"] as TresGalleryWidth[]).map((width) => {
                    const isActive = item.width === width;
                    return (
                      <button
                        key={width}
                        type="button"
                        onClick={() => applyGalleryItem(index, (current) => ({ ...current, width }))}
                        style={{
                          ...buttonBase,
                          padding: "8px 12px",
                          background: isActive ? uiPalette.accent : "transparent",
                          borderColor: isActive ? uiPalette.accent : uiPalette.ghostBorder,
                          color: isActive ? uiPalette.accentText : uiPalette.controlText,
                        }}
                      >
                        {width}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFields = () => {
    switch (selection?.id) {
      case "history":
        return <AdminHistoryPanel editor={editor} />;
      case "hero":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AdminFieldTextarea label="Tagline" value={editor.content.hero.tagline} onChange={(value) => setHero("tagline", value)} />
            <AdminFieldTextarea label="Location" value={editor.content.hero.location} minRows={1} onChange={(value) => setHero("location", value)} />
            <AdminFieldTextarea label="Reserve button label" value={editor.content.hero.reserveLabel} minRows={1} onChange={(value) => setHero("reserveLabel", value)} />
          </div>
        );
      case "concept":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AdminFieldTextarea label="Eyebrow" value={editor.content.concept.eyebrow} minRows={1} onChange={(value) => setConcept("eyebrow", value)} />
            <AdminFieldTextarea label="Title" value={editor.content.concept.title} minRows={2} onChange={(value) => setConcept("title", value)} />
            <AdminFieldTextarea label="Body" value={editor.content.concept.body} minRows={5} onChange={(value) => setConcept("body", value)} />
            <AdminFieldTextarea label="The Hands title" value={editor.content.concept.handsTitle} minRows={1} onChange={(value) => setConcept("handsTitle", value)} />
            <AdminFieldTextarea label="The Hands body" value={editor.content.concept.handsBody} minRows={4} onChange={(value) => setConcept("handsBody", value)} />
            <AdminFieldTextarea label="The Place title" value={editor.content.concept.placeTitle} minRows={1} onChange={(value) => setConcept("placeTitle", value)} />
            <AdminFieldTextarea label="The Place body" value={editor.content.concept.placeBody} minRows={4} onChange={(value) => setConcept("placeBody", value)} />
            <AdminFieldTextarea label="Quote" value={editor.content.concept.quote} minRows={3} onChange={(value) => setConcept("quote", value)} />
            <AdminImagePicker
              title="Chef image"
              value={editor.content.concept.chefImage}
              mediaLibrary={editor.mediaLibrary}
              uploadTags={["concept", "chef"]}
              quickPickTags={["concept", "chef"]}
              quickPickLimit={4}
              onApply={(filePath) => setConcept("chefImage", filePath)}
              onUpload={(file, tags) => uploadToField(file, tags, (filePath) => setConcept("chefImage", filePath))}
            />
            <AdminImagePicker
              title="Founders image"
              value={editor.content.concept.foundersImage}
              mediaLibrary={editor.mediaLibrary}
              uploadTags={["concept", "founders"]}
              quickPickTags={["concept", "founders"]}
              quickPickLimit={4}
              onApply={(filePath) => setConcept("foundersImage", filePath)}
              onUpload={(file, tags) => uploadToField(file, tags, (filePath) => setConcept("foundersImage", filePath))}
            />
          </div>
        );
      case "gallery":
        return renderGallery();
      case "zoom":
        return renderZoom();
      case "reserve":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AdminFieldTextarea label="Eyebrow" value={editor.content.reserve.eyebrow} minRows={1} onChange={(value) => setReserve("eyebrow", value)} />
            <AdminFieldTextarea label="Title" value={editor.content.reserve.title} minRows={2} onChange={(value) => setReserve("title", value)} />
            <AdminFieldTextarea label="Hours title" value={editor.content.reserve.hoursTitle} minRows={1} onChange={(value) => setReserve("hoursTitle", value)} />
            <AdminFieldTextarea label="Hours lines" value={toLineString(editor.content.reserve.hoursLines)} minRows={4} onChange={(value) => setReserve("hoursLines", toLines(value))} />
            <AdminFieldTextarea label="Location title" value={editor.content.reserve.locationTitle} minRows={1} onChange={(value) => setReserve("locationTitle", value)} />
            <AdminFieldTextarea label="Location lines" value={toLineString(editor.content.reserve.locationLines)} minRows={3} onChange={(value) => setReserve("locationLines", toLines(value))} />
            <AdminFieldTextarea label="Travel title" value={editor.content.reserve.travelTitle} minRows={1} onChange={(value) => setReserve("travelTitle", value)} />
            <AdminFieldTextarea label="Travel lines" value={toLineString(editor.content.reserve.travelLines)} minRows={3} onChange={(value) => setReserve("travelLines", toLines(value))} />
            <AdminFieldInput label="Contact title" value={editor.content.reserve.contactTitle} onChange={(value) => setReserve("contactTitle", value)} />
            <AdminFieldInput label="Contact phone" value={editor.content.reserve.contactPhone} onChange={(value) => setReserve("contactPhone", value)} />
            <AdminFieldInput label="Alcoholic pairing price" value={editor.content.reserve.alcoholicPairingPrice} onChange={(value) => setReserve("alcoholicPairingPrice", value)} />
            <AdminFieldInput label="Non-alcoholic pairing price" value={editor.content.reserve.nonAlcoholicPairingPrice} onChange={(value) => setReserve("nonAlcoholicPairingPrice", value)} />
            <AdminFieldTextarea label="Price" value={editor.content.reserve.price} minRows={1} onChange={(value) => setReserve("price", value)} />
            <AdminFieldTextarea label="Reserve button label" value={editor.content.reserve.reserveButton} minRows={1} onChange={(value) => setReserve("reserveButton", value)} />
            <AdminFieldTextarea label="Note" value={editor.content.reserve.note} minRows={2} onChange={(value) => setReserve("note", value)} />
          </div>
        );
      case "footer":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AdminFieldTextarea label="Quote" value={editor.content.footer.quote} minRows={3} onChange={(value) => setFooter("quote", value)} />
            <AdminFieldInput label="Instagram URL" value={editor.content.footer.instagramUrl} onChange={(value) => setFooter("instagramUrl", value)} type="url" />
            <AdminFieldInput label="Facebook URL" value={editor.content.footer.facebookUrl} onChange={(value) => setFooter("facebookUrl", value)} type="url" />
          </div>
        );
      case "greenStar":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AdminFieldTextarea label="Eyebrow" value={editor.content.greenStar.eyebrow} minRows={1} onChange={(value) => setGreenStar("eyebrow", value)} />
            <AdminFieldTextarea label="Title" value={editor.content.greenStar.title} minRows={2} onChange={(value) => setGreenStar("title", value)} />
            <AdminFieldTextarea label="Award" value={editor.content.greenStar.award} minRows={1} onChange={(value) => setGreenStar("award", value)} />
            <AdminFieldTextarea label="First paragraph" value={editor.content.greenStar.body} minRows={5} onChange={(value) => setGreenStar("body", value)} />
            <AdminFieldTextarea label="Second paragraph" value={editor.content.greenStar.body2} minRows={3} onChange={(value) => setGreenStar("body2", value)} />
            {editor.content.greenStar.pillars.map((pillar, index) => (
              <div key={pillar.id} style={{ display: "grid", gap: 12, padding: 12, border: `1px solid ${uiPalette.panelBorder}` }}>
                <p style={{ margin: 0, fontFamily: '"Abel", sans-serif', fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: uiPalette.controlMuted }}>
                  Pillar {index + 1}
                </p>
                <AdminFieldInput label="Number" value={pillar.number} onChange={(value) => setGreenStarPillar(index, "number", value)} />
                <AdminFieldInput label="Label" value={pillar.label} onChange={(value) => setGreenStarPillar(index, "label", value)} />
                <AdminFieldInput label="Title" value={pillar.title} onChange={(value) => setGreenStarPillar(index, "title", value)} />
                <AdminFieldTextarea label="Body" value={pillar.body} minRows={3} onChange={(value) => setGreenStarPillar(index, "body", value)} />
              </div>
            ))}
            <AdminFieldTextarea label="CTA label" value={editor.content.greenStar.ctaLabel} minRows={1} onChange={(value) => setGreenStar("ctaLabel", value)} />
          </div>
        );
      case "livingMenuTransition":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AdminFieldTextarea label="Eyebrow" value={editor.content.livingMenuTransition.eyebrow} minRows={1} onChange={(value) => setLivingMenuTransition("eyebrow", value)} />
            <AdminFieldTextarea label="Title" value={editor.content.livingMenuTransition.title} minRows={2} onChange={(value) => setLivingMenuTransition("title", value)} />
            <AdminFieldTextarea label="Subtitle" value={editor.content.livingMenuTransition.subtitle} minRows={3} onChange={(value) => setLivingMenuTransition("subtitle", value)} />
          </div>
        );
      case "circleTransition":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AdminFieldTextarea label="Eyebrow" value={editor.content.circleTransition.eyebrow} minRows={1} onChange={(value) => setCircleTransition("eyebrow", value)} />
            <AdminFieldTextarea label="Title" value={editor.content.circleTransition.title} minRows={2} onChange={(value) => setCircleTransition("title", value)} />
            <AdminFieldTextarea label="Subtitle" value={editor.content.circleTransition.subtitle} minRows={3} onChange={(value) => setCircleTransition("subtitle", value)} />
          </div>
        );
      case "heroToZoomTransition":
      case "seasonsReadonly":
      case "menuReadonly":
      case "producersReadonly":
        return renderUnavailable();
      default:
        return null;
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          top: toolbarHeight,
          left: 0,
          right: 0,
          bottom: 0,
          background: uiPalette.panelOverlay,
          zIndex: 39,
          opacity: selection ? 1 : 0,
          pointerEvents: selection ? "auto" : "none",
          transition: "opacity 200ms ease",
        }}
      />
      <aside
        style={{
          position: "fixed",
          top: toolbarHeight,
          right: 0,
          bottom: 0,
          width: isMobile ? "100%" : 380,
          background: uiPalette.panel,
          borderLeft: `1px solid ${uiPalette.panelBorder}`,
          zIndex: 40,
          transform: selection ? "translateX(0)" : "translateX(100%)",
          transition: "transform 200ms ease",
          pointerEvents: selection ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          overflow: "visible",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "18px 20px", borderBottom: `1px solid ${uiPalette.panelBorder}` }}>
          <h2 style={sectionHeaderStyle}>{selection?.label ?? ""}</h2>
          <button type="button" onClick={onClose} style={{ ...buttonBase, padding: "8px 10px", color: uiPalette.controlText }}>
            Close
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>{renderFields()}</div>
      </aside>
    </>
  );
}
