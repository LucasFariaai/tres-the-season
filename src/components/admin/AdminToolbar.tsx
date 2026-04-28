import { useEffect, useRef, useState } from "react";
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

  const navItems: { label: string; onClick: () => void }[] = [
    { label: "Menus", onClick: onMenus },
    { label: "Producers", onClick: onProducers },
    { label: "Wines", onClick: onWines },
    { label: "History", onClick: onHistory },
    { label: "Subscribers", onClick: onSubscribers },
    { label: "Reset draft", onClick: () => void onReset() },
    { label: "Sign out", onClick: () => void onSignOut() },
  ];

  if (isMobile) {
    return (
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
        <nav
          ref={menuRef}
          style={{
            ...pillContainerStyle,
            width: "100%",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", padding: "0 8px", flexShrink: 0 }}
            aria-label="Open the live site"
          >
            <img src={logoTres} alt="Tres" style={{ height: 16, width: "auto" }} />
          </a>

          <span
            style={{
              fontFamily: "'Source Sans 3', sans-serif",
              fontSize: 10,
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
              {navItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.onClick();
                    setMenuOpen(false);
                  }}
                  onMouseEnter={hoverIn}
                  onMouseLeave={hoverOut}
                  style={{
                    ...navPillStyle,
                    width: "100%",
                    justifyContent: "flex-start",
                    textAlign: "left",
                    padding: "10px 14px",
                    color: uiPalette.controlText,
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </nav>
      </div>
    );
  }

  // Desktop layout — two floating pills.
  const primaryNav = navItems.slice(0, 5); // Menus, Producers, Wines, History, Subscribers
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
      <nav style={pillContainerStyle}>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          style={{ display: "inline-flex", alignItems: "center", paddingLeft: 8, paddingRight: 8, flexShrink: 0 }}
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
          {primaryNav.map((item) => (
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
