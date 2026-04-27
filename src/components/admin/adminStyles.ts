import type { CSSProperties } from "react";

// Cream / dark-text palette — matches the home page (Concept / Reserve / Producers
// sections) instead of the dark Wine list aesthetic. Edit tokens here to
// retune the whole admin UI.
export const uiPalette = {
  panel: "#F5EFE6", // cream — same as home page background
  panelOverlay: "rgba(26,20,16,0.18)",
  panelBorder: "rgba(26,20,16,0.10)",
  controlBorder: "rgba(26,20,16,0.18)",
  controlMuted: "rgba(26,20,16,0.45)",
  controlSoft: "rgba(26,20,16,0.55)",
  controlText: "#1A1410",
  accent: "#1A1410", // primary action — solid dark
  accentText: "#F5EFE6",
  accentOutline: "rgba(26,20,16,0.45)",
  outlineLabel: "rgba(26,20,16,0.85)",
  ghostBorder: "rgba(26,20,16,0.22)",
  ghostText: "rgba(26,20,16,0.7)",
  toolbarBadge: "rgba(26,20,16,0.5)",
  inputBg: "rgba(255,255,255,0.55)",
};

export const toolbarHeight = 56;

export const buttonBase: CSSProperties = {
  appearance: "none",
  borderRadius: 0,
  border: `1px solid ${uiPalette.ghostBorder}`,
  background: "transparent",
  color: uiPalette.ghostText,
  padding: "8px 16px",
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 12,
  lineHeight: 1,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "all 200ms ease",
};

export const fieldLabelStyle: CSSProperties = {
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: uiPalette.controlSoft,
};

export const fieldStyle: CSSProperties = {
  width: "100%",
  borderRadius: 0,
  border: `1px solid ${uiPalette.controlBorder}`,
  background: uiPalette.inputBg,
  color: uiPalette.controlText,
  padding: "10px 14px",
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 14,
  lineHeight: 1.55,
  outline: "none",
  pointerEvents: "auto",
};

export const sectionHeaderStyle: CSSProperties = {
  margin: 0,
  fontFamily: "'Playfair Display', serif",
  fontStyle: "italic",
  fontSize: 22,
  lineHeight: 1.1,
  color: uiPalette.controlText,
  fontWeight: 400,
};
