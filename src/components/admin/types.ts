import { useVisualSiteEditor } from "@/hooks/useVisualSiteEditor";
import type { HomeSectionId } from "@/lib/site-editor/types";

export type EditableSectionKey =
  | HomeSectionId
  | "history"
  | "heroBand"
  | "zoomBand"
  | "darkTransition"
  | "seasonsReadonly"
  | "menuReadonly"
  | "producersReadonly";

export type VisualEditor = ReturnType<typeof useVisualSiteEditor>;

export type Selection = {
  id: EditableSectionKey;
  label: string;
};
