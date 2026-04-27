import { useIsMobile } from "@/hooks/use-mobile";
import logoTres from "@/assets/logo-tres-nav.svg";
import { buttonBase, toolbarHeight, uiPalette } from "@/components/admin/adminStyles";
import type { VisualEditor } from "@/components/admin/types";

type AdminToolbarProps = {
  editor: VisualEditor;
  onPublish: () => Promise<void>;
  onReset: () => Promise<void>;
  onHistory: () => void;
  onSubscribers: () => void;
  onWines: () => void;
  onMenus: () => void;
  onProducers: () => void;
  onSignOut: () => Promise<void>;
};

export function AdminToolbar({ editor, onPublish, onReset, onHistory, onSubscribers, onWines, onMenus, onProducers, onSignOut }: AdminToolbarProps) {
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
        background: "rgba(245,239,230,0.95)",
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
          <img src={logoTres} alt="Tres" style={{ height: 20, width: "auto" }} />
        </a>

        <div
          style={{
            flex: 1,
            minWidth: 120,
            textAlign: "center",
            fontFamily: "'Source Sans 3', sans-serif",
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
          <button type="button" onClick={() => void onReset()} style={{ ...buttonBase, color: uiPalette.controlText }}>
            Reset
          </button>
          <button type="button" onClick={onMenus} style={{ ...buttonBase, color: uiPalette.controlText }}>
            Menus
          </button>
          <button type="button" onClick={onProducers} style={{ ...buttonBase, color: uiPalette.controlText }}>
            Producers
          </button>
          <button type="button" onClick={onWines} style={{ ...buttonBase, color: uiPalette.controlText }}>
            Wines
          </button>
          <button type="button" onClick={onHistory} style={{ ...buttonBase, color: uiPalette.controlText }}>
            History
          </button>
          <button type="button" onClick={onSubscribers} style={{ ...buttonBase, color: uiPalette.controlText }}>
            Subscribers
          </button>
          <button type="button" onClick={() => void onSignOut()} style={{ ...buttonBase, color: uiPalette.controlText }}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
