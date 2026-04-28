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

// Pill-shaped buttons + softer field corners — matches the SeasonBar's
// rounded-full chips and the home page's general radius vocabulary.
export const buttonBase: CSSProperties = {
  appearance: "none",
  borderRadius: 999,
  border: `1px solid ${uiPalette.ghostBorder}`,
  background: "transparent",
  color: uiPalette.controlText,
  padding: "8px 14px",
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 13,
  lineHeight: 1,
  letterSpacing: "0.02em",
  textTransform: "none",
  cursor: "pointer",
  transition: "all 200ms ease",
};

// Subtle in-toolbar nav chip (no border, hover bg only).
export const navPillStyle: CSSProperties = {
  appearance: "none",
  borderRadius: 999,
  border: "1px solid transparent",
  background: "transparent",
  color: uiPalette.controlText,
  padding: "6px 12px",
  fontFamily: "'Source Sans 3', sans-serif",
  fontSize: 13,
  lineHeight: 1,
  letterSpacing: "0.02em",
  textTransform: "none",
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
  borderRadius: 10,
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

// Soft card surface used for the editable cards in panels (dishes,
// producers, wines, gallery items, etc.). Subtle border + light shadow
// instead of the previous hard edge.
export const cardStyle: CSSProperties = {
  border: "1px solid rgba(26,20,16,0.06)",
  borderRadius: 14,
  background: "rgba(255,255,255,0.45)",
  boxShadow: "0 1px 3px rgba(26,20,16,0.04)",
};
