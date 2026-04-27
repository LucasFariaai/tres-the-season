import { useIsMobile } from "@/hooks/use-mobile";
import logoTres from "@/assets/logo-tres-nav.svg";
import { buttonBase, navPillStyle, toolbarHeight, uiPalette } from "@/components/admin/adminStyles";
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

export function AdminToolbar({
  editor,
  onPublish,
  onReset,
  onHistory,
  onSubscribers,
  onWines,
  onMenus,
  onProducers,
  onSignOut,
}: AdminToolbarProps) {
  const isMobile = useIsMobile();

  const navItems: { label: string; onClick: () => void }[] = [
    { label: "Menus", onClick: onMenus },
    { label: "Producers", onClick: onProducers },
    { label: "Wines", onClick: onWines },
    { label: "History", onClick: onHistory },
    { label: "Subscribers", onClick: onSubscribers },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 50,
        width: isMobile ? "calc(100% - 24px)" : "auto",
        maxWidth: "calc(100% - 24px)",
        pointerEvents: "auto",
      }}
    >
      <nav
        style={{
          borderRadius: 999,
          border: "1px solid rgba(26,20,16,0.08)",
          boxShadow: "0 8px 32px rgba(26,20,16,0.10)",
          padding: isMobile ? "8px 10px" : "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: isMobile ? 6 : 4,
          background: "rgba(245,239,230,0.92)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          flexWrap: "nowrap",
          overflowX: isMobile ? "auto" : "visible",
        }}
      >
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            paddingLeft: 8,
            paddingRight: 8,
            flexShrink: 0,
          }}
          aria-label="Open the live site"
        >
          <img src={logoTres} alt="Tres" style={{ height: 18, width: "auto" }} />
        </a>

        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "4px 10px",
            borderRadius: 999,
            background: editor.saving ? "rgba(26,20,16,0.06)" : "transparent",
            fontFamily: "'Source Sans 3', sans-serif",
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: uiPalette.toolbarBadge,
            animation: editor.saving ? "adminPulse 1.6s ease-in-out infinite" : "none",
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {editor.saving ? "Saving" : "Draft"}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
          {navItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.onClick}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,20,16,0.06)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              style={{ ...navPillStyle, color: uiPalette.controlText, whiteSpace: "nowrap" }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0, marginLeft: 4 }}>
          <button
            type="button"
            onClick={() => void onReset()}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,20,16,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            style={{ ...navPillStyle, color: uiPalette.controlMuted, whiteSpace: "nowrap" }}
          >
            Reset
          </button>
          <button
            type="button"
            onClick={() => void onSignOut()}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(26,20,16,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            style={{ ...navPillStyle, color: uiPalette.controlMuted, whiteSpace: "nowrap" }}
          >
            Sign out
          </button>
          <button
            type="button"
            onClick={() => void onPublish()}
            disabled={editor.publishing}
            style={{
              ...buttonBase,
              background: uiPalette.accent,
              color: uiPalette.accentText,
              borderColor: uiPalette.accent,
              padding: "8px 18px",
              fontWeight: 500,
              opacity: editor.publishing ? 0.7 : 1,
              whiteSpace: "nowrap",
            }}
          >
            {editor.publishing ? "Publishing…" : "Publish"}
          </button>
        </div>
      </nav>
    </div>
  );
}

// Reserved for layout offset alignment with floating toolbar.
export const ADMIN_TOOLBAR_OFFSET = toolbarHeight + 16;
