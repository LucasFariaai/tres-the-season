import { type ChangeEvent, type CSSProperties, type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import logoTres from "@/assets/logo-tres-nav.svg";
import ConceptSection from "@/components/ConceptSection";
import DarkToCreamTransition from "@/components/DarkToCreamTransition";
import FooterSection from "@/components/FooterSection";
import HeroSection from "@/components/HeroSection";
import MenuPoemSection from "@/components/MenuPoemSection";
import ProducersSection from "@/components/ProducersSection";
import ReserveSection from "@/components/ReserveSection";
import SeasonsArchiveSection from "@/components/SeasonsArchiveSection";
import TresGallerySection from "@/components/TresGallerySection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVisualSiteEditor } from "@/hooks/useVisualSiteEditor";
import { supabase } from "@/integrations/supabase/client";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import type { HomeSectionId, SiteMediaItem } from "@/lib/site-editor/types";
import type { TresGalleryItem, TresGalleryWidth } from "@/data/tresGalleryItems";

type EditableSectionKey = HomeSectionId | "heroBand" | "zoomBand" | "darkTransition" | "zoomReadonly" | "seasonsReadonly" | "menuReadonly" | "producersReadonly";

type VisualEditor = ReturnType<typeof useVisualSiteEditor>;

type Selection = {
  id: EditableSectionKey;
  label: string;
};

type ImageFieldProps = {
  label: string;
  sectionTag: string;
  value: string;
  mediaLibrary: SiteMediaItem[];
  onApply: (filePath: string) => void;
  onUpload: (file: File) => Promise<void>;
};

const uiPalette = {
  panel: "hsl(24 24% 8%)",
  panelOverlay: "hsl(0 0% 0% / 0.3)",
  panelBorder: "hsl(36 38% 93% / 0.08)",
  controlBorder: "hsl(36 38% 93% / 0.1)",
  controlMuted: "hsl(38 28% 69% / 0.4)",
  controlSoft: "hsl(38 28% 69% / 0.3)",
  controlText: "hsl(36 38% 93%)",
  accent: "hsl(30 52% 50%)",
  accentText: "hsl(24 24% 8%)",
  accentOutline: "hsl(30 52% 50% / 0.3)",
  outlineLabel: "hsl(30 52% 50% / 0.9)",
  ghostBorder: "hsl(36 38% 93% / 0.15)",
  ghostText: "hsl(38 28% 69% / 0.5)",
  toolbarBadge: "hsl(38 28% 69% / 0.35)",
  inputBg: "transparent",
};

const toolbarHeight = 56;
const unavailableMessage = "This section is configured through its data files or the season context. Direct editing is not available here.";
const buttonBase: CSSProperties = {
  appearance: "none",
  borderRadius: 0,
  border: `1px solid ${uiPalette.ghostBorder}`,
  background: "transparent",
  color: uiPalette.ghostText,
  padding: "8px 16px",
  fontFamily: '"Abel", sans-serif',
  fontSize: 12,
  lineHeight: 1,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "all 200ms ease",
};

function toLineString(lines: string[]) {
  return lines.join("\n");
}

function toLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function AutoTextarea({ label, value, onChange, minRows = 2 }: { label: string; value: string; onChange: (value: string) => void; minRows?: number }) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${Math.max(element.scrollHeight, minRows * 24 + 20)}px`;
  }, [minRows, value]);

  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          fontFamily: '"Abel", sans-serif',
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: uiPalette.controlSoft,
        }}
      >
        {label}
      </span>
      <textarea
        ref={ref}
        value={value}
        rows={minRows}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          resize: "vertical",
          borderRadius: 0,
          border: `1px solid ${uiPalette.controlBorder}`,
          background: uiPalette.inputBg,
          color: uiPalette.controlText,
          padding: "10px 14px",
          fontFamily: '"Abel", sans-serif',
          fontSize: 14,
          lineHeight: 1.55,
          outline: "none",
          minHeight: minRows * 24 + 20,
          transition: "border-color 200ms ease",
        }}
      />
    </label>
  );
}

function SimpleField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span
        style={{
          fontFamily: '"Abel", sans-serif',
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: uiPalette.controlSoft,
        }}
      >
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={{
          width: "100%",
          borderRadius: 0,
          border: `1px solid ${uiPalette.controlBorder}`,
          background: uiPalette.inputBg,
          color: uiPalette.controlText,
          padding: "10px 14px",
          fontFamily: '"Abel", sans-serif',
          fontSize: 14,
          lineHeight: 1.4,
          outline: "none",
          transition: "border-color 200ms ease",
        }}
      />
    </label>
  );
}

function ImageField({ label, sectionTag, value, mediaLibrary, onApply, onUpload }: ImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const inputId = `${sectionTag}-${label}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const recentMedia = mediaLibrary.slice(0, 6);
  const previewUrl = resolveMediaUrl(value, 1200, 82) ?? value;

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    await onUpload(file);
    setUploading(false);
    event.target.value = "";
  };

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <span
        style={{
          fontFamily: '"Abel", sans-serif',
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: uiPalette.controlSoft,
        }}
      >
        {label}
      </span>
      <div
        style={{
          width: "100%",
          height: 140,
          border: `1px solid ${uiPalette.controlBorder}`,
          overflow: "hidden",
          background: "hsl(24 18% 10%)",
        }}
      >
        {previewUrl ? (
          <img src={previewUrl} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              fontFamily: '"Abel", sans-serif',
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: uiPalette.controlMuted,
            }}
          >
            No image
          </div>
        )}
      </div>
      <label
        htmlFor={inputId}
        style={{
          ...buttonBase,
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          width: "fit-content",
          color: uiPalette.controlText,
          borderColor: uiPalette.controlBorder,
        }}
      >
        {uploading ? "Uploading..." : "Upload new image"}
      </label>
      <input id={inputId} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
        {recentMedia.map((item, index) => {
          const thumbUrl = resolveMediaUrl(item.file_path, 240, 76) ?? item.file_path;
          return (
            <button
              key={item.id ?? `${item.file_path}-${index}`}
              type="button"
              onClick={() => onApply(item.file_path)}
              style={{
                borderRadius: 0,
                border: `1px solid ${uiPalette.controlBorder}`,
                background: "transparent",
                padding: 0,
                cursor: "pointer",
                overflow: "hidden",
                aspectRatio: "1 / 1",
              }}
            >
              <img src={thumbUrl} alt={item.alt_text ?? item.title ?? "Library image"} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EditableSection({ label, isSelected, onSelect, children }: { label: string; isSelected: boolean; onSelect: () => void; children: React.ReactNode }) {
  return (
    <div
      onClick={onSelect}
      style={{
        position: "relative",
        outline: isSelected ? `1px dashed ${uiPalette.accentOutline}` : "1px dashed transparent",
        outlineOffset: -1,
        transition: "outline-color 200ms ease",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 12,
          top: 12,
          zIndex: 3,
          padding: "2px 8px",
          background: isSelected ? uiPalette.outlineLabel : "transparent",
          color: isSelected ? uiPalette.accentText : "transparent",
          fontFamily: '"Abel", sans-serif',
          fontSize: 10,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          pointerEvents: "none",
          transition: "all 200ms ease",
        }}
      >
        {label}
      </div>
      <div
        style={{ position: "absolute", inset: 0, zIndex: 2 }}
        onMouseEnter={(event) => {
          const wrapper = event.currentTarget.parentElement;
          const badge = wrapper?.firstElementChild as HTMLElement | null;
          if (wrapper) wrapper.style.outline = `1px dashed ${uiPalette.accentOutline}`;
          if (badge) {
            badge.style.background = uiPalette.outlineLabel;
            badge.style.color = uiPalette.accentText;
          }
        }}
        onMouseLeave={(event) => {
          const wrapper = event.currentTarget.parentElement;
          const badge = wrapper?.firstElementChild as HTMLElement | null;
          if (wrapper && !isSelected) wrapper.style.outline = "1px dashed transparent";
          if (badge && !isSelected) {
            badge.style.background = "transparent";
            badge.style.color = "transparent";
          }
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

function AdminToolbar({ editor, onPublish, onReset, onSignOut }: { editor: VisualEditor; onPublish: () => Promise<void>; onReset: () => Promise<void>; onSignOut: () => Promise<void> }) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: toolbarHeight,
        zIndex: 50,
        background: "hsl(24 24% 8% / 0.95)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${uiPalette.panelBorder}`,
      }}
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          padding: isMobile ? "8px 12px" : "8px 20px",
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        <a href="/" target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", minWidth: 88 }}>
          <img src={logoTres} alt="Tres" style={{ height: 20, width: "auto", filter: "brightness(0) invert(1)" }} />
        </a>
        <div
          style={{
            flex: 1,
            minWidth: 120,
            textAlign: "center",
            fontFamily: '"Abel", sans-serif',
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: uiPalette.toolbarBadge,
            animation: editor.saving ? "adminPulse 1.6s ease-in-out infinite" : "none",
          }}
        >
          {editor.saving ? "Saving..." : "Editing draft"}
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={() => void onPublish()}
            disabled={editor.publishing}
            style={{
              ...buttonBase,
              background: uiPalette.accent,
              color: uiPalette.accentText,
              borderColor: uiPalette.accent,
              padding: "8px 20px",
              opacity: editor.publishing ? 0.7 : 1,
            }}
          >
            {editor.publishing ? "Publishing..." : "Publish"}
          </button>
          <button type="button" onClick={() => void onReset()} style={buttonBase}>
            Reset
          </button>
          <button type="button" onClick={() => void onSignOut()} style={buttonBase}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminSignIn({ onSignedIn }: { onSignedIn: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);

    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }

    if (data.session) onSignedIn(data.session);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: uiPalette.panel,
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          border: `1px solid ${uiPalette.panelBorder}`,
          padding: 28,
          display: "grid",
          gap: 20,
          background: "hsl(24 24% 8%)",
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <p
            style={{
              margin: 0,
              fontFamily: '"Abel", sans-serif',
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: uiPalette.controlMuted,
            }}
          >
            Visual admin
          </p>
          <h1
            style={{
              margin: 0,
              fontFamily: '"Abel", sans-serif',
              fontSize: 28,
              lineHeight: 1.1,
              color: uiPalette.controlText,
              fontWeight: 400,
            }}
          >
            Open editor
          </h1>
        </div>
        <SimpleField label="Email" value={email} onChange={setEmail} type="email" />
        <SimpleField label="Password" value={password} onChange={setPassword} type="password" />
        <button
          type="submit"
          disabled={submitting}
          style={{
            ...buttonBase,
            background: uiPalette.accent,
            color: uiPalette.accentText,
            borderColor: uiPalette.accent,
            width: "100%",
            padding: "12px 16px",
            opacity: submitting ? 0.7 : 1,
          }}
        >
          {submitting ? "Signing in..." : "Open editor"}
        </button>
      </form>
    </main>
  );
}

function AdminEditPanel({
  editor,
  selection,
  onClose,
}: {
  editor: VisualEditor;
  selection: Selection | null;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!selection) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, selection]);

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

  const uploadAndApply = async (file: File, tag: string, onApply: (path: string) => void) => {
    const result = await editor.uploadMedia(file, [tag]);
    if (result.error || !result.item?.file_path) {
      toast({ title: "Upload failed", description: result.error ?? "The file could not be stored.", variant: "destructive" });
      return;
    }
    onApply(result.item.file_path);
  };

  const renderUnavailable = () => (
    <p style={{ margin: 0, fontFamily: '"Abel", sans-serif', fontSize: 14, lineHeight: 1.6, color: uiPalette.controlMuted }}>
      {unavailableMessage}
    </p>
  );

  const renderFields = () => {
    switch (selection?.id) {
      case "hero":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AutoTextarea label="Tagline" value={editor.content.hero.tagline} onChange={(value) => editor.setContent((current) => ({ ...current, hero: { ...current.hero, tagline: value } }))} />
            <AutoTextarea label="Location" value={editor.content.hero.location} onChange={(value) => editor.setContent((current) => ({ ...current, hero: { ...current.hero, location: value } }))} minRows={1} />
            <AutoTextarea label="Reserve button label" value={editor.content.hero.reserveLabel} onChange={(value) => editor.setContent((current) => ({ ...current, hero: { ...current.hero, reserveLabel: value } }))} minRows={1} />
          </div>
        );
      case "concept":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AutoTextarea label="Eyebrow" value={editor.content.concept.eyebrow} onChange={(value) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, eyebrow: value } }))} minRows={1} />
            <AutoTextarea label="Title" value={editor.content.concept.title} onChange={(value) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, title: value } }))} minRows={2} />
            <AutoTextarea label="Body" value={editor.content.concept.body} onChange={(value) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, body: value } }))} minRows={5} />
            <AutoTextarea label="The Hands title" value={editor.content.concept.handsTitle} onChange={(value) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, handsTitle: value } }))} minRows={1} />
            <AutoTextarea label="The Hands body" value={editor.content.concept.handsBody} onChange={(value) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, handsBody: value } }))} minRows={4} />
            <AutoTextarea label="The Place title" value={editor.content.concept.placeTitle} onChange={(value) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, placeTitle: value } }))} minRows={1} />
            <AutoTextarea label="The Place body" value={editor.content.concept.placeBody} onChange={(value) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, placeBody: value } }))} minRows={4} />
            <AutoTextarea label="Quote" value={editor.content.concept.quote} onChange={(value) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, quote: value } }))} minRows={3} />
            <ImageField
              label="Chef image"
              sectionTag="concept-chef"
              value={editor.content.concept.chefImage}
              mediaLibrary={editor.mediaLibrary}
              onApply={(filePath) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, chefImage: filePath } }))}
              onUpload={(file) => uploadAndApply(file, "concept", (filePath) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, chefImage: filePath } })))}
            />
            <ImageField
              label="Founders image"
              sectionTag="concept-founders"
              value={editor.content.concept.foundersImage}
              mediaLibrary={editor.mediaLibrary}
              onApply={(filePath) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, foundersImage: filePath } }))}
              onUpload={(file) => uploadAndApply(file, "concept", (filePath) => editor.setContent((current) => ({ ...current, concept: { ...current.concept, foundersImage: filePath } })))}
            />
          </div>
        );
      case "gallery":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AutoTextarea label="Eyebrow" value={editor.content.gallery.eyebrow} onChange={(value) => editor.setContent((current) => ({ ...current, gallery: { ...current.gallery, eyebrow: value } }))} minRows={1} />
            <AutoTextarea label="Subtitle" value={editor.content.gallery.subtitle} onChange={(value) => editor.setContent((current) => ({ ...current, gallery: { ...current.gallery, subtitle: value } }))} minRows={2} />
            <div style={{ display: "grid", gap: 12, maxHeight: isMobile ? "none" : "58vh", overflowY: "auto", paddingRight: 4 }}>
              {editor.content.gallery.items.map((item, index) => {
                const imageUrl = resolveMediaUrl(item.mediaSrc, 400, 80) ?? item.mediaSrc;
                return (
                  <div key={item.id} style={{ display: "grid", gap: 12, border: `1px solid ${uiPalette.controlBorder}`, padding: 12 }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <img src={imageUrl} alt={item.alt} style={{ width: 80, height: 80, objectFit: "cover", flexShrink: 0, border: `1px solid ${uiPalette.controlBorder}` }} />
                      <div style={{ display: "grid", gap: 8, flex: 1 }}>
                        <p style={{ margin: 0, fontFamily: '"Fraunces", serif', fontStyle: "italic", fontSize: 18, color: uiPalette.controlText }}>
                          Gallery item {index + 1}
                        </p>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button type="button" onClick={() => moveGalleryItem(index, -1)} disabled={index === 0} style={{ ...buttonBase, padding: "6px 10px", opacity: index === 0 ? 0.4 : 1 }}>
                            Move up
                          </button>
                          <button
                            type="button"
                            onClick={() => moveGalleryItem(index, 1)}
                            disabled={index === editor.content.gallery.items.length - 1}
                            style={{ ...buttonBase, padding: "6px 10px", opacity: index === editor.content.gallery.items.length - 1 ? 0.4 : 1 }}
                          >
                            Move down
                          </button>
                        </div>
                      </div>
                    </div>
                    <AutoTextarea label="Label" value={item.label ?? ""} onChange={(value) => applyGalleryItem(index, (current) => ({ ...current, label: value }))} minRows={1} />
                    <AutoTextarea label="Caption" value={item.caption ?? ""} onChange={(value) => applyGalleryItem(index, (current) => ({ ...current, caption: value }))} minRows={3} />
                    <AutoTextarea label="Alt" value={item.alt} onChange={(value) => applyGalleryItem(index, (current) => ({ ...current, alt: value }))} minRows={2} />
                    <div style={{ display: "grid", gap: 8 }}>
                      <span style={{ fontFamily: '"Abel", sans-serif', fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: uiPalette.controlSoft }}>Width</span>
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
                    <ImageField
                      label="Gallery image"
                      sectionTag={`gallery-${index}`}
                      value={item.mediaSrc}
                      mediaLibrary={editor.mediaLibrary}
                      onApply={(filePath) => applyGalleryItem(index, (current) => ({ ...current, mediaSrc: filePath }))}
                      onUpload={(file) => uploadAndApply(file, "gallery", (filePath) => applyGalleryItem(index, (current) => ({ ...current, mediaSrc: filePath })))}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      case "reserve":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AutoTextarea label="Eyebrow" value={editor.content.reserve.eyebrow} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, eyebrow: value } }))} minRows={1} />
            <AutoTextarea label="Title" value={editor.content.reserve.title} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, title: value } }))} minRows={2} />
            <AutoTextarea label="Hours title" value={editor.content.reserve.hoursTitle} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, hoursTitle: value } }))} minRows={1} />
            <AutoTextarea label="Hours lines" value={toLineString(editor.content.reserve.hoursLines)} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, hoursLines: toLines(value) } }))} minRows={4} />
            <AutoTextarea label="Location title" value={editor.content.reserve.locationTitle} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, locationTitle: value } }))} minRows={1} />
            <AutoTextarea label="Location lines" value={toLineString(editor.content.reserve.locationLines)} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, locationLines: toLines(value) } }))} minRows={3} />
            <AutoTextarea label="Travel title" value={editor.content.reserve.travelTitle} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, travelTitle: value } }))} minRows={1} />
            <AutoTextarea label="Travel lines" value={toLineString(editor.content.reserve.travelLines)} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, travelLines: toLines(value) } }))} minRows={3} />
            <AutoTextarea label="Price" value={editor.content.reserve.price} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, price: value } }))} minRows={1} />
            <AutoTextarea label="Reserve button label" value={editor.content.reserve.reserveButton} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, reserveButton: value } }))} minRows={1} />
            <AutoTextarea label="Note" value={editor.content.reserve.note} onChange={(value) => editor.setContent((current) => ({ ...current, reserve: { ...current.reserve, note: value } }))} minRows={2} />
          </div>
        );
      case "footer":
        return (
          <div style={{ display: "grid", gap: 16 }}>
            <AutoTextarea label="Quote" value={editor.content.footer.quote} onChange={(value) => editor.setContent((current) => ({ ...current, footer: { ...current.footer, quote: value } }))} minRows={3} />
            <AutoTextarea label="Instagram URL" value={editor.content.footer.instagramUrl} onChange={(value) => editor.setContent((current) => ({ ...current, footer: { ...current.footer, instagramUrl: value } }))} minRows={1} />
            <AutoTextarea label="Facebook URL" value={editor.content.footer.facebookUrl} onChange={(value) => editor.setContent((current) => ({ ...current, footer: { ...current.footer, facebookUrl: value } }))} minRows={1} />
          </div>
        );
      case "zoomReadonly":
      case "seasonsReadonly":
      case "menuReadonly":
      case "producersReadonly":
      case "heroBand":
      case "zoomBand":
      case "darkTransition":
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
        ref={panelRef}
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
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "18px 20px", borderBottom: `1px solid ${uiPalette.panelBorder}` }}>
          <h2 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontStyle: "italic", fontSize: 20, lineHeight: 1.1, color: uiPalette.controlText }}>
            {selection?.label ?? ""}
          </h2>
          <button type="button" onClick={onClose} style={{ ...buttonBase, padding: "8px 10px", color: uiPalette.controlText }}>
            ✕
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>{renderFields()}</div>
      </aside>
    </>
  );
}

export default function Admin() {
  const editor = useVisualSiteEditor();
  const [selection, setSelection] = useState<Selection | null>(null);
  const isMobile = useIsMobile();

  const sections = useMemo(
    () => [
      { id: "hero" as const, label: "Hero" },
      { id: "heroBand" as const, label: "Hero to zoom" },
      { id: "zoomReadonly" as const, label: "Zoom" },
      { id: "seasonsReadonly" as const, label: "Seasons archive" },
      { id: "menuReadonly" as const, label: "Menu Poem" },
      { id: "concept" as const, label: "Concept" },
      { id: "zoomBand" as const, label: "Zoom to producers" },
      { id: "producersReadonly" as const, label: "Producers" },
      { id: "reserve" as const, label: "Reserve" },
      { id: "darkTransition" as const, label: "Dark to cream transition" },
      { id: "gallery" as const, label: "Gallery" },
      { id: "footer" as const, label: "Footer" },
    ],
    [],
  );

  useEffect(() => {
    if (!selection) return;
    const nextSelection = sections.find((section) => section.id === selection.id);
    if (!nextSelection) setSelection(null);
  }, [sections, selection]);

  const handlePublish = async () => {
    const result = await editor.publish();
    if (result.error) {
      toast({ title: "Could not publish", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Published", description: "The homepage draft is now live." });
  };

  const handleReset = async () => {
    const result = await editor.resetToBaseline();
    if (result.error) {
      toast({ title: "Reset failed", description: result.error, variant: "destructive" });
      return;
    }
    await editor.saveNow();
    toast({ title: "Draft reset", description: "The draft was restored to the baseline." });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
  };

  if (!editor.session && !editor.loading) {
    return <AdminSignIn onSignedIn={() => void editor.reload()} />;
  }

  if (editor.loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: uiPalette.panel, color: uiPalette.controlText, fontFamily: '"Abel", sans-serif' }}>
        Loading editor...
      </main>
    );
  }

  if (!editor.isAdmin) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: uiPalette.panel, padding: 24 }}>
        <div style={{ maxWidth: 420, border: `1px solid ${uiPalette.panelBorder}`, padding: 24, color: uiPalette.controlText, fontFamily: '"Abel", sans-serif', display: "grid", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: uiPalette.controlMuted }}>Access</p>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6 }}>This route requires an admin role in Supabase.</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => void editor.reload()} style={buttonBase}>
              Refresh
            </button>
            <button type="button" onClick={() => void handleSignOut()} style={buttonBase}>
              Sign out
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "hsl(0 0% 100%)" }}>
      <style>{`
        @keyframes adminPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
      `}</style>
      <AdminToolbar editor={editor} onPublish={handlePublish} onReset={handleReset} onSignOut={handleSignOut} />
      <AdminEditPanel editor={editor} selection={selection} onClose={() => setSelection(null)} />
      <div style={{ paddingTop: toolbarHeight, marginRight: selection && !isMobile ? 380 : 0, transition: "margin-right 200ms ease" }}>
        <EditableSection label="Hero" isSelected={selection?.id === "hero"} onSelect={() => setSelection({ id: "hero", label: "Hero" })}>
          <HeroSection shouldPlay={false} content={editor.content.hero} theme={editor.theme} />
        </EditableSection>

        <EditableSection label="Hero to zoom" isSelected={selection?.id === "heroBand"} onSelect={() => setSelection({ id: "heroBand", label: "Hero to zoom" })}>
          <div
            aria-hidden="true"
            style={{
              height: isMobile ? 340 : 500,
              background:
                "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 0%, hsl(24 24% 8% / 0.95) 100%), linear-gradient(to bottom, hsl(24 24% 8%) 0%, hsl(24 24% 8%) 8%, hsl(20 37% 12%) 18%, hsl(20 29% 18%) 30%, hsl(24 21% 29%) 44%, hsl(39 13% 48%) 58%, hsl(40 21% 67%) 72%, hsl(40 24% 80%) 84%, hsl(43 31% 88%) 93%, hsl(36 38% 93%) 100%)",
            }}
          />
        </EditableSection>

        <EditableSection label="Zoom" isSelected={selection?.id === "zoomReadonly"} onSelect={() => setSelection({ id: "zoomReadonly", label: "Zoom" })}>
          <ZoomParallaxSection content={editor.content.zoom} theme={editor.theme} />
        </EditableSection>

        <EditableSection
          label="Seasons archive"
          isSelected={selection?.id === "seasonsReadonly"}
          onSelect={() => setSelection({ id: "seasonsReadonly", label: "Seasons archive" })}
        >
          <SeasonsArchiveSection />
        </EditableSection>

        <EditableSection label="Menu Poem" isSelected={selection?.id === "menuReadonly"} onSelect={() => setSelection({ id: "menuReadonly", label: "Menu Poem" })}>
          <MenuPoemSection showCta={false} />
        </EditableSection>

        <EditableSection label="Concept" isSelected={selection?.id === "concept"} onSelect={() => setSelection({ id: "concept", label: "Concept" })}>
          <ConceptSection content={editor.content.concept} theme={editor.theme} />
        </EditableSection>

        <EditableSection label="Zoom to producers" isSelected={selection?.id === "zoomBand"} onSelect={() => setSelection({ id: "zoomBand", label: "Zoom to producers" })}>
          <div
            aria-hidden="true"
            style={{
              width: "100%",
              height: 400,
              background: editor.content.bands.zoomToProducers || editor.theme.bandZoomToProducers,
            }}
          />
        </EditableSection>

        <EditableSection label="Producers" isSelected={selection?.id === "producersReadonly"} onSelect={() => setSelection({ id: "producersReadonly", label: "Producers" })}>
          <ProducersSection content={editor.content.producers} theme={editor.theme} />
        </EditableSection>

        <EditableSection label="Reserve" isSelected={selection?.id === "reserve"} onSelect={() => setSelection({ id: "reserve", label: "Reserve" })}>
          <ReserveSection content={editor.content.reserve} theme={editor.theme} />
        </EditableSection>

        <EditableSection
          label="Dark to cream transition"
          isSelected={selection?.id === "darkTransition"}
          onSelect={() => setSelection({ id: "darkTransition", label: "Dark to cream transition" })}
        >
          <DarkToCreamTransition />
        </EditableSection>

        <EditableSection label="Gallery" isSelected={selection?.id === "gallery"} onSelect={() => setSelection({ id: "gallery", label: "Gallery" })}>
          <TresGallerySection content={editor.content.gallery} theme={editor.theme} />
        </EditableSection>

        <EditableSection label="Footer" isSelected={selection?.id === "footer"} onSelect={() => setSelection({ id: "footer", label: "Footer" })}>
          <FooterSection content={editor.content.footer} theme={editor.theme} />
        </EditableSection>
      </div>
    </main>
  );
}
