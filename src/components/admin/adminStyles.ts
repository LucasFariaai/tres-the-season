import type { CSSProperties } from "react";

export const uiPalette = {
  panel: "hsl(24 24% 8%)",
  panelOverlay: "hsl(0 0% 0% / 0.3)",
  panelBorder: "hsl(35 43% 93% / 0.08)",
  controlBorder: "hsl(35 43% 93% / 0.1)",
  controlMuted: "hsl(37 29% 69% / 0.4)",
  controlSoft: "hsl(37 29% 69% / 0.3)",
  controlText: "hsl(35 43% 93%)",
  accent: "hsl(28 52% 50%)",
  accentText: "hsl(24 24% 8%)",
  accentOutline: "hsl(28 52% 50% / 0.3)",
  outlineLabel: "hsl(28 52% 50% / 0.9)",
  ghostBorder: "hsl(35 43% 93% / 0.15)",
  ghostText: "hsl(37 29% 69% / 0.5)",
  toolbarBadge: "hsl(37 29% 69% / 0.35)",
  inputBg: "transparent",
};

export const toolbarHeight = 56;

export const buttonBase: CSSProperties = {
  appearance: "none",
  borderRadius: 0,
  border: `1px solid ${uiPalette.ghostBorder}`,
  background: "transparent",
  color: uiPalette.ghostText,
  padding: "8px 16px",
  fontFamily: '"Abel", sans-serif',
  fontSize: 12,
  lineHeight: 1,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "all 200ms ease",
};

export const fieldLabelStyle: CSSProperties = {
  fontFamily: '"Abel", sans-serif',
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
  fontFamily: '"Abel", sans-serif',
  fontSize: 14,
  lineHeight: 1.55,
  outline: "none",
  pointerEvents: "auto",
};

export const sectionHeaderStyle: CSSProperties = {
  margin: 0,
  fontFamily: '"Fraunces", serif',
  fontStyle: "italic",
  fontSize: 20,
  lineHeight: 1.1,
  color: uiPalette.controlText,
  fontWeight: 400,
};
