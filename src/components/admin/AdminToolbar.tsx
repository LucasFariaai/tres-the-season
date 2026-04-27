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

const pillContainerStyle = {
  borderRadius: 999,
  border: "1px solid rgba(26,20,16,0.06)",
  boxShadow: "0 8px 24px rgba(26,20,16,0.08)",
  padding: "6px 8px",
  display: "flex",
  alignItems: "center",
  gap: 2,
  background: "rgba(245,239,230,0.92)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  pointerEvents: "auto" as const,
};

const hoverIn = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.background = "rgba(26,20,16,0.06)";
};
const hoverOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.background = "transparent";
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
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 12,
        padding: "0 16px",
        flexWrap: "wrap",
        pointerEvents: "none",
      }}
    >
      {/* Left pill: logo + nav chips */}
      <nav
        style={{
          ...pillContainerStyle,
          maxWidth: "100%",
          overflowX: isMobile ? "auto" : "visible",
          flexWrap: "nowrap",
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
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
              style={{ ...navPillStyle, color: uiPalette.controlText, whiteSpace: "nowrap" }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Right pill: actions + Publish (always visible) */}
      <div style={pillContainerStyle}>
        <button
          type="button"
          onClick={() => void onReset()}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
          style={{ ...navPillStyle, color: uiPalette.controlMuted, whiteSpace: "nowrap" }}
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => void onSignOut()}
          onMouseEnter={hoverIn}
          onMouseLeave={hoverOut}
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
    </div>
  );
}

// Reserved for layout offset alignment with floating toolbar.
export const ADMIN_TOOLBAR_OFFSET = toolbarHeight + 16;
