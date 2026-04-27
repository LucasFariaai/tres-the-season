import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoTres from "@/assets/logo-tres-nav.svg";
import { useIsMobile } from "@/hooks/use-mobile";
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

export function AdminPageShell({ editor, title, subtitle, onPublish, children }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  return (
    <div style={{ minHeight: "100vh", background: uiPalette.panel, color: uiPalette.controlText }}>
      <style>{`
        @keyframes adminPulse {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 1; }
        }
      `}</style>

      {isMobile ? (
        <div
          style={{
            position: "fixed",
            top: 12,
            left: 0,
            right: 0,
            zIndex: 50,
            display: "flex",
            justifyContent: "center",
            padding: "0 12px",
            pointerEvents: "none",
          }}
        >
          <nav ref={menuRef} style={{ ...pillContainerStyle, width: "100%", justifyContent: "space-between", position: "relative" }}>
            <Link
              to="/admin"
              aria-label="Back to admin"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 8px", textDecoration: "none", color: uiPalette.controlText }}
            >
              <img src={logoTres} alt="Tres" style={{ height: 16, width: "auto" }} />
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: uiPalette.controlMuted }}>←</span>
            </Link>

            <span
              style={{
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: uiPalette.toolbarBadge,
                animation: editor.saving ? "adminPulse 1.6s ease-in-out infinite" : "none",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              {editor.saving ? "Saving" : "Draft"}
            </span>

            <div style={{ display: "flex", gap: 4, alignItems: "center", flexShrink: 0 }}>
              <button
                type="button"
                onClick={() => void onPublish()}
                disabled={editor.publishing}
                style={{
                  ...buttonBase,
                  background: uiPalette.accent,
                  color: uiPalette.accentText,
                  borderColor: uiPalette.accent,
                  padding: "7px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  opacity: editor.publishing ? 0.7 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {editor.publishing ? "…" : "Publish"}
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open admin menu"
                aria-expanded={menuOpen}
                style={{
                  ...navPillStyle,
                  padding: 8,
                  width: 36,
                  height: 36,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: menuOpen ? "rgba(26,20,16,0.08)" : "transparent",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>

            {menuOpen ? (
              <div
                data-lenis-prevent
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  minWidth: 220,
                  background: "rgba(245,239,230,0.98)",
                  backdropFilter: "blur(14px)",
                  WebkitBackdropFilter: "blur(14px)",
                  border: "1px solid rgba(26,20,16,0.06)",
                  borderRadius: 16,
                  boxShadow: "0 12px 32px rgba(26,20,16,0.14)",
                  padding: 6,
                  display: "grid",
                  gap: 2,
                }}
              >
                {NAV_LINKS.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <button
                      key={link.to}
                      type="button"
                      onClick={() => {
                        navigate(link.to);
                        setMenuOpen(false);
                      }}
                      style={{
                        ...navPillStyle,
                        width: "100%",
                        justifyContent: "flex-start",
                        textAlign: "left",
                        padding: "10px 14px",
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
            ) : null}
          </nav>
        </div>
      ) : (
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
              <span style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: 12, color: uiPalette.controlMuted }}>←</span>
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
      )}

      {/* Page header */}
      <div style={{ paddingTop: toolbarHeight + 24 }}>
        <header style={{ padding: "24px clamp(16px, 5vw, 32px) 16px", borderBottom: `1px solid ${uiPalette.panelBorder}` }}>
          <h1
            style={{
              margin: 0,
              fontFamily: "'Playfair Display', serif",
              fontStyle: "italic",
              fontSize: "clamp(28px, 5vw, 36px)",
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

        <main style={{ padding: "24px clamp(16px, 5vw, 32px)", maxWidth: 1480, margin: "0 auto" }}>{children}</main>
      </div>
    </div>
  );
}
