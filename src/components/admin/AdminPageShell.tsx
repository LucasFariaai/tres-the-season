import { Link, useLocation, useNavigate } from "react-router-dom";
import logoTres from "@/assets/logo-tres-nav.svg";
import { buttonBase, navPillStyle, toolbarHeight, uiPalette } from "@/components/admin/adminStyles";
import type { VisualEditor } from "@/components/admin/types";

type Props = {
  editor: VisualEditor;
  title: string;
  subtitle?: string;
  onPublish: () => Promise<void>;
  children: React.ReactNode;
};

const NAV_LINKS: { to: string; label: string }[] = [
  { to: "/admin/menus", label: "Menus" },
  { to: "/admin/producers", label: "Producers" },
  { to: "/admin/wines", label: "Wines" },
];

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

export function AdminPageShell({ editor, title, subtitle, onPublish, children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ minHeight: "100vh", background: uiPalette.panel, color: uiPalette.controlText }}>
      <style>{`
        @keyframes adminPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
      `}</style>

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
        {/* Left pill: back link + nav */}
        <nav style={pillContainerStyle}>
          <Link
            to="/admin"
            aria-label="Back to admin"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 10px",
              borderRadius: 999,
              textDecoration: "none",
              color: uiPalette.controlText,
              flexShrink: 0,
            }}
          >
            <img src={logoTres} alt="Tres" style={{ height: 16, width: "auto" }} />
            <span
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 12,
                color: uiPalette.controlMuted,
              }}
            >
              ←
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 2, flexShrink: 0 }}>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <button
                  key={link.to}
                  type="button"
                  onClick={() => navigate(link.to)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.background = "rgba(26,20,16,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.background = "transparent";
                  }}
                  style={{
                    ...navPillStyle,
                    background: isActive ? uiPalette.accent : "transparent",
                    color: isActive ? uiPalette.accentText : uiPalette.controlText,
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Right pill: status + Publish */}
        <div style={pillContainerStyle}>
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
              flexShrink: 0,
              whiteSpace: "nowrap",
            }}
          >
            {editor.publishing ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {/* Page header */}
      <div style={{ paddingTop: toolbarHeight + 24 }}>
        <header style={{ padding: "24px 32px 16px", borderBottom: `1px solid ${uiPalette.panelBorder}` }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: 36,
              fontWeight: 400,
              color: uiPalette.controlText,
            }}
          >
            {title}
          </h1>
          {subtitle ? (
            <p
              style={{
                margin: "8px 0 0",
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 13,
                color: uiPalette.controlMuted,
              }}
            >
              {subtitle}
            </p>
          ) : null}
        </header>

        <main style={{ padding: 32, maxWidth: 1480, margin: "0 auto" }}>{children}</main>
      </div>
    </div>
  );
}

// Used by hovering hooks elsewhere if needed.
const _unusedHover = { hoverIn, hoverOut };
void _unusedHover;
