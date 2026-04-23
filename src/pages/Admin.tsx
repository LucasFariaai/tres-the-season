import { type FormEvent, useState } from "react";
import type { Session } from "@supabase/supabase-js";
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
import { AdminEditPanel } from "@/components/admin/AdminEditPanel";
import { AdminFieldInput } from "@/components/admin/AdminFieldInput";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { buttonBase, toolbarHeight, uiPalette } from "@/components/admin/adminStyles";
import type { Selection } from "@/components/admin/types";
import { toast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { useVisualSiteEditor } from "@/hooks/useVisualSiteEditor";
import { supabase } from "@/integrations/supabase/client";

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
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: uiPalette.panel, padding: 24 }}>
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 420,
          border: `1px solid ${uiPalette.panelBorder}`,
          padding: 28,
          display: "grid",
          gap: 20,
          background: uiPalette.panel,
        }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0, fontFamily: '"Abel", sans-serif', fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: uiPalette.controlMuted }}>
            Visual admin
          </p>
          <h1 style={{ margin: 0, fontFamily: '"Abel", sans-serif', fontSize: 28, lineHeight: 1.1, color: uiPalette.controlText, fontWeight: 400 }}>Open editor</h1>
        </div>
        <AdminFieldInput label="Email" value={email} onChange={setEmail} type="email" />
        <AdminFieldInput label="Password" value={password} onChange={setPassword} type="password" />
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

export default function Admin() {
  const editor = useVisualSiteEditor();
  const [selection, setSelection] = useState<Selection | null>(null);
  const isMobile = useIsMobile();

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

  if (editor.loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: uiPalette.panel, color: uiPalette.controlText, fontFamily: '"Abel", sans-serif' }}>
        Loading editor...
      </main>
    );
  }

  if (!editor.session) {
    return <AdminSignIn onSignedIn={() => void editor.reload()} />;
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
      <AdminToolbar
        editor={editor}
        onPublish={handlePublish}
        onReset={handleReset}
        onHistory={() => setSelection({ id: "history", label: "Version history" })}
        onSignOut={handleSignOut}
      />
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

        <EditableSection label="Zoom" isSelected={selection?.id === "zoom"} onSelect={() => setSelection({ id: "zoom", label: "Zoom" })}>
          <ZoomParallaxSection content={editor.content.zoom} theme={editor.theme} />
        </EditableSection>

        <EditableSection label="Seasons archive" isSelected={selection?.id === "seasonsReadonly"} onSelect={() => setSelection({ id: "seasonsReadonly", label: "Seasons archive" })}>
          <SeasonsArchiveSection />
        </EditableSection>

        <EditableSection label="Menu Poem" isSelected={selection?.id === "menuReadonly"} onSelect={() => setSelection({ id: "menuReadonly", label: "Menu Poem" })}>
          <MenuPoemSection showCta={false} />
        </EditableSection>

        <EditableSection label="Concept" isSelected={selection?.id === "concept"} onSelect={() => setSelection({ id: "concept", label: "Concept" })}>
          <ConceptSection content={editor.content.concept} theme={editor.theme} />
        </EditableSection>

        <EditableSection label="Zoom to producers" isSelected={selection?.id === "zoomBand"} onSelect={() => setSelection({ id: "zoomBand", label: "Zoom to producers" })}>
          <div aria-hidden="true" style={{ width: "100%", height: 400, background: editor.content.bands.zoomToProducers || editor.theme.bandZoomToProducers }} />
        </EditableSection>

        <EditableSection label="Producers" isSelected={selection?.id === "producersReadonly"} onSelect={() => setSelection({ id: "producersReadonly", label: "Producers" })}>
          <ProducersSection content={editor.content.producers} theme={editor.theme} />
        </EditableSection>

        <EditableSection label="Reserve" isSelected={selection?.id === "reserve"} onSelect={() => setSelection({ id: "reserve", label: "Reserve" })}>
          <ReserveSection content={editor.content.reserve} theme={editor.theme} />
        </EditableSection>

        <EditableSection label="Dark to cream transition" isSelected={selection?.id === "darkTransition"} onSelect={() => setSelection({ id: "darkTransition", label: "Dark to cream transition" })}>
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
