import { useVisualSiteEditor } from "@/hooks/useVisualSiteEditor";
import type { HomeSectionId } from "@/lib/site-editor/types";

export type EditableSectionKey =
  | HomeSectionId
  | "history"
  | "heroToZoomTransition"
  | "livingMenuTransition"
  | "circleTransition"
  | "greenStar"
  | "seasonsReadonly"
  | "menuReadonly"
  | "producersReadonly";

export type VisualEditor = ReturnType<typeof useVisualSiteEditor>;

export type Selection = {
  id: EditableSectionKey;
  label: string;
};
