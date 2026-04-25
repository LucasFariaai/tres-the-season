import { Link } from "react-router-dom";
import logoTres from "@/assets/logo-tres-nav.svg";
import { buttonBase, toolbarHeight, uiPalette } from "@/components/admin/adminStyles";
import type { VisualEditor } from "@/components/admin/types";

type Props = {
  editor: VisualEditor;
  title: string;
  subtitle?: string;
  onPublish: () => Promise<void>;
  children: React.ReactNode;
};

export function AdminPageShell({ editor, title, subtitle, onPublish, children }: Props) {
  return (
    <div style={{ minHeight: "100vh", background: uiPalette.panel, color: uiPalette.controlText }}>
      <style>{`
        @keyframes adminPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Toolbar */}
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
        <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "8px 20px" }}>
          <Link to="/admin" style={{ display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", color: uiPalette.controlText }}>
            <img src={logoTres} alt="Tres" style={{ height: 18, width: "auto", filter: "brightness(0) invert(1)" }} />
            <span style={{ fontFamily: '"Abel", sans-serif', fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: uiPalette.controlMuted }}>
              ← Admin
            </span>
          </Link>

          <div
            style={{
              flex: 1,
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
        </div>
      </div>

      {/* Page header */}
      <div style={{ paddingTop: toolbarHeight }}>
        <header style={{ padding: "32px 32px 12px", borderBottom: `1px solid ${uiPalette.panelBorder}` }}>
          <h1 style={{ margin: 0, fontFamily: '"Fraunces", serif', fontStyle: "italic", fontSize: 36, fontWeight: 400, color: uiPalette.controlText }}>
            {title}
          </h1>
          {subtitle ? (
            <p style={{ margin: "8px 0 0", fontFamily: '"Abel", sans-serif', fontSize: 13, color: uiPalette.controlMuted }}>
              {subtitle}
            </p>
          ) : null}
        </header>

        <main style={{ padding: 32, maxWidth: 1480, margin: "0 auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
