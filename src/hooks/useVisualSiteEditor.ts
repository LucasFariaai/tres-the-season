import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import { uploadSiteImage } from "@/lib/imageUpload";
import { defaultHomeCmsContent, defaultMediaLibrary, defaultSiteTheme } from "@/lib/site-editor/defaults";
import {
  normalizeMediaLibrary,
  normalizeSnapshot,
  normalizeTheme,
  snapshotToSiteContentRows,
  themeToTokenRows,
  tokenRowsToTheme,
} from "@/lib/site-editor/mapper";
import type {
  EditorChangeLogEntry,
  EditorHistoryEntry,
  EditorSnapshotPayload,
  HomeCmsContent,
  SiteMediaItem,
  SiteThemeTokens,
} from "@/lib/site-editor/types";

interface SiteEditorState {
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  saving: boolean;
  publishing: boolean;
  content: HomeCmsContent;
  theme: SiteThemeTokens;
  mediaLibrary: SiteMediaItem[];
  history: EditorHistoryEntry[];
  changeLog: EditorChangeLogEntry[];
  baseline: EditorSnapshotPayload;
  published: EditorSnapshotPayload;
}

const initialSnapshot: EditorSnapshotPayload = {
  content: defaultHomeCmsContent,
  theme: defaultSiteTheme,
  media: defaultMediaLibrary,
};

const sanitizeFileName = (name: string) =>
  name
    .toLowerCase()
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "") || "image";

const toJson = (value: unknown) => value as Json;
type SiteSnapshotInsert = Database["public"]["Tables"]["site_snapshots"]["Insert"];
type SiteSnapshotUpdate = Database["public"]["Tables"]["site_snapshots"]["Update"];

export function useVisualSiteEditor() {
  const [state, setState] = useState<SiteEditorState>({
    session: null,
    isAdmin: false,
    loading: true,
    saving: false,
    publishing: false,
    content: defaultHomeCmsContent,
    theme: defaultSiteTheme,
    mediaLibrary: defaultMediaLibrary,
    history: [],
    changeLog: [],
    baseline: initialSnapshot,
    published: initialSnapshot,
  });
  const [error, setError] = useState<string | null>(null);
  const [saveTick, setSaveTick] = useState(0);
  const idsRef = useRef<{ draft: string | null; published: string | null; baseline: string | null }>({
    draft: null,
    published: null,
    baseline: null,
  });
  const lastSavedRef = useRef<string>(JSON.stringify(initialSnapshot));
  const skipAutosaveRef = useRef(true);

  const draftSnapshot = useMemo<EditorSnapshotPayload>(
    () => ({ content: state.content, theme: state.theme, media: state.mediaLibrary }),
    [state.content, state.theme, state.mediaLibrary],
  );

  const persistDraft = useCallback(async () => {
    if (!state.session || !state.isAdmin) return;

    const serialized = JSON.stringify(draftSnapshot);
    if (serialized === lastSavedRef.current) return;

    setState((current) => ({ ...current, saving: true }));

    const draftId = idsRef.current.draft;
    const payload = {
      name: "Draft workspace",
      kind: "draft" as const,
      content: toJson(draftSnapshot.content),
      theme: toJson(draftSnapshot.theme),
      media: toJson(draftSnapshot.media),
      created_by: state.session.user.id,
    };

    const { data, error: saveError } = draftId
      ? await supabase.from("site_snapshots").update(payload).eq("id", draftId).select("id").single()
      : await supabase.from("site_snapshots").insert(payload).select("id").single();

    if (saveError) {
      setError(saveError.message);
      setState((current) => ({ ...current, saving: false }));
      return;
    }

    const nextDraftId = data?.id ?? draftId;
    if (nextDraftId && nextDraftId !== draftId) {
      idsRef.current.draft = nextDraftId;
      await supabase.from("site_editor_state").upsert({ id: true, draft_snapshot_id: nextDraftId, updated_by: state.session.user.id });
    }

    await supabase.from("site_change_log").insert({
      action: "draft_saved",
      entity_type: "snapshot",
      entity_id: nextDraftId,
      snapshot_id: nextDraftId,
      actor_user_id: state.session.user.id,
      details: { kind: "draft", auto: true },
    });

    lastSavedRef.current = serialized;
    setState((current) => ({ ...current, saving: false }));
    setSaveTick((value) => value + 1);
  }, [draftSnapshot, state.isAdmin, state.session]);

  const reload = useCallback(async (session?: Session | null) => {
    const activeSession = session ?? state.session;

    if (!activeSession) {
      setState((current) => ({ ...current, session: null, isAdmin: false, loading: false }));
      return;
    }

    setState((current) => ({ ...current, loading: true }));

    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", activeSession.user.id);
    const isAdmin = (roles ?? []).some((entry) => entry.role === "admin");

    if (!isAdmin) {
      setState((current) => ({ ...current, session: activeSession, isAdmin: false, loading: false }));
      return;
    }

    const [editorStateResult, mediaResult, historyResult, changeLogResult, publishedThemeResult] = await Promise.all([
      supabase.from("site_editor_state").select("draft_snapshot_id,published_snapshot_id,baseline_snapshot_id").eq("id", true).maybeSingle(),
      supabase.from("site_media_library").select("id,file_path,title,alt_text,tags,metadata").order("created_at", { ascending: false }),
      supabase.from("site_snapshots").select("id,name,kind,created_at,restored_from").in("kind", ["history", "baseline", "published", "draft"]).order("created_at", { ascending: false }),
      supabase.from("site_change_log").select("id,action,entity_type,entity_id,created_at,details").order("created_at", { ascending: false }).limit(30),
      supabase.from("site_theme_tokens").select("section,token,value").eq("environment", "published"),
    ]);

    const ids = editorStateResult.data ?? null;
    idsRef.current = {
      draft: ids?.draft_snapshot_id ?? null,
      published: ids?.published_snapshot_id ?? null,
      baseline: ids?.baseline_snapshot_id ?? null,
    };

    const snapshotIds = [idsRef.current.draft, idsRef.current.published, idsRef.current.baseline].filter(Boolean) as string[];
    const { data: snapshots } = snapshotIds.length
      ? await supabase.from("site_snapshots").select("id,content,theme,media").in("id", snapshotIds)
      : { data: [] as Array<{ id: string; content: unknown; theme: unknown; media: unknown }> };

    const byId = new Map((snapshots ?? []).map((entry) => [entry.id, entry]));
    const draft = normalizeSnapshot(byId.get(idsRef.current.draft ?? "") as Partial<EditorSnapshotPayload> | undefined);
    const baseline = normalizeSnapshot(byId.get(idsRef.current.baseline ?? "") as Partial<EditorSnapshotPayload> | undefined);
    const publishedFromSnapshot = normalizeSnapshot(byId.get(idsRef.current.published ?? "") as Partial<EditorSnapshotPayload> | undefined);

    const mediaLibrary = mediaResult.data?.length ? normalizeMediaLibrary(mediaResult.data) : defaultMediaLibrary;
    const publishedTheme = publishedThemeResult.data?.length ? tokenRowsToTheme(publishedThemeResult.data) : publishedFromSnapshot.theme;

    const nextDraft = draft.content ? draft : { ...initialSnapshot, media: mediaLibrary };

    setState({
      session: activeSession,
      isAdmin,
      loading: false,
      saving: false,
      publishing: false,
      content: nextDraft.content,
      theme: normalizeTheme(nextDraft.theme),
      mediaLibrary,
      history: (historyResult.data ?? []) as EditorHistoryEntry[],
      changeLog: (changeLogResult.data ?? []).map((entry) => ({ ...entry, details: (entry.details ?? {}) as Record<string, unknown> })),
      baseline,
      published: { ...publishedFromSnapshot, theme: publishedTheme },
    });

    lastSavedRef.current = JSON.stringify({ content: nextDraft.content, theme: nextDraft.theme, media: mediaLibrary });
    skipAutosaveRef.current = true;
    setSaveTick((value) => value + 1);
  }, [state.session]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      await reload(data.session);
    };

    void bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      void reload(session);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [reload]);

  useEffect(() => {
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }

    if (!state.isAdmin || !state.session) return;

    const timeout = window.setTimeout(() => {
      void persistDraft();
    }, 800);

    return () => window.clearTimeout(timeout);
  }, [draftSnapshot, persistDraft, state.isAdmin, state.session]);

  const setContent = useCallback((updater: HomeCmsContent | ((current: HomeCmsContent) => HomeCmsContent)) => {
    setState((current) => ({
      ...current,
      content: typeof updater === "function" ? (updater as (current: HomeCmsContent) => HomeCmsContent)(current.content) : updater,
    }));
  }, []);

  const setTheme = useCallback((updater: SiteThemeTokens | ((current: SiteThemeTokens) => SiteThemeTokens)) => {
    setState((current) => ({
      ...current,
      theme: typeof updater === "function" ? (updater as (current: SiteThemeTokens) => SiteThemeTokens)(current.theme) : updater,
    }));
  }, []);

  const setMediaLibrary = useCallback((updater: SiteMediaItem[] | ((current: SiteMediaItem[]) => SiteMediaItem[])) => {
    setState((current) => ({
      ...current,
      mediaLibrary: typeof updater === "function" ? (updater as (current: SiteMediaItem[]) => SiteMediaItem[])(current.mediaLibrary) : updater,
    }));
  }, []);

  const publish = useCallback(async () => {
    if (!state.session || !state.isAdmin) return { error: "Unauthorized" };

    setState((current) => ({ ...current, publishing: true }));
    const snapshot = { content: state.content, theme: state.theme, media: state.mediaLibrary };

    const historyPayload: SiteSnapshotInsert = {
      name: `Published ${new Date().toLocaleString()}`,
      kind: "history",
      content: toJson(snapshot.content),
      theme: toJson(snapshot.theme),
      media: toJson(snapshot.media),
      restored_from: idsRef.current.published,
      created_by: state.session.user.id,
    };

    const { data: historySnapshot, error: historyError } = await supabase
      .from("site_snapshots")
      .insert(historyPayload)
      .select("id")
      .single();

    if (historyError) {
      setState((current) => ({ ...current, publishing: false }));
      return { error: historyError.message };
    }

    const publishedPayload: SiteSnapshotUpdate = {
      name: "Published site",
      kind: "published" as const,
      content: toJson(snapshot.content),
      theme: toJson(snapshot.theme),
      media: toJson(snapshot.media),
      created_by: state.session.user.id,
      restored_from: historySnapshot.id,
    };
    const publishedInsertPayload: SiteSnapshotInsert = {
      name: "Published site",
      kind: "published",
      content: toJson(snapshot.content),
      theme: toJson(snapshot.theme),
      media: toJson(snapshot.media),
      created_by: state.session.user.id,
      restored_from: historySnapshot.id,
    };

    const publishedResult = idsRef.current.published
      ? await supabase.from("site_snapshots").update(publishedPayload).eq("id", idsRef.current.published).select("id").single()
      : await supabase.from("site_snapshots").insert(publishedInsertPayload).select("id").single();

    if (publishedResult.error) {
      setState((current) => ({ ...current, publishing: false }));
      return { error: publishedResult.error.message };
    }

    const publishedId = publishedResult.data.id;
    idsRef.current.published = publishedId;

    const siteContentRows = snapshotToSiteContentRows(snapshot.content);
    const themeRows = themeToTokenRows(snapshot.theme, "published");

    const publishOps = await Promise.all([
      supabase.from("site_editor_state").upsert({ id: true, published_snapshot_id: publishedId, draft_snapshot_id: idsRef.current.draft, updated_by: state.session.user.id }),
      supabase.from("site_content").upsert(siteContentRows, { onConflict: "section,key" }),
      supabase.from("site_theme_tokens").upsert(themeRows, { onConflict: "environment,section,token" }),
      supabase.from("site_change_log").insert({
        action: "published",
        entity_type: "snapshot",
        entity_id: publishedId,
        snapshot_id: historySnapshot.id,
        actor_user_id: state.session.user.id,
        details: { source: "draft" },
      }),
    ]);

    const failed = publishOps.find((result) => result.error);
    if (failed?.error) {
      setState((current) => ({ ...current, publishing: false }));
      return { error: failed.error.message };
    }

    await reload(state.session);
    setState((current) => ({ ...current, publishing: false }));
    return { error: null };
  }, [reload, state.content, state.isAdmin, state.mediaLibrary, state.session, state.theme]);

  const restoreToDraft = useCallback(
    async (snapshotId: string) => {
      if (!state.session || !state.isAdmin) return { error: "Unauthorized" };

      const { data, error: readError } = await supabase
        .from("site_snapshots")
        .select("id,content,theme,media")
        .eq("id", snapshotId)
        .single();

      if (readError) return { error: readError.message };

      const next = normalizeSnapshot(data as unknown as Partial<EditorSnapshotPayload>);
      setState((current) => ({ ...current, content: next.content, theme: next.theme, mediaLibrary: next.media }));

      await supabase.from("site_change_log").insert({
        action: "restored_to_draft",
        entity_type: "snapshot",
        entity_id: snapshotId,
        snapshot_id: snapshotId,
        actor_user_id: state.session.user.id,
        details: { target: "draft" },
      });

      return { error: null };
    },
    [state.isAdmin, state.session],
  );

  const resetToBaseline = useCallback(async () => {
    if (!state.baseline) return { error: "Baseline not found" };
    setState((current) => ({
      ...current,
      content: state.baseline.content,
      theme: state.baseline.theme,
      mediaLibrary: state.baseline.media,
    }));
    if (state.session) {
      await supabase.from("site_change_log").insert({
        action: "baseline_reset",
        entity_type: "snapshot",
        entity_id: idsRef.current.baseline,
        snapshot_id: idsRef.current.baseline,
        actor_user_id: state.session.user.id,
        details: { target: "draft" },
      });
    }
    return { error: null };
  }, [state.baseline, state.session]);

  const defineCurrentAsBaseline = useCallback(async () => {
    if (!state.session || !state.isAdmin) return { error: "Unauthorized" };

    const payload: SiteSnapshotUpdate = {
      name: "Baseline",
      kind: "baseline" as const,
      content: toJson(state.content),
      theme: toJson(state.theme),
      media: toJson(state.mediaLibrary),
      created_by: state.session.user.id,
    };
    const insertPayload: SiteSnapshotInsert = {
      name: "Baseline",
      kind: "baseline",
      content: toJson(state.content),
      theme: toJson(state.theme),
      media: toJson(state.mediaLibrary),
      created_by: state.session.user.id,
    };

    const result = idsRef.current.baseline
      ? await supabase.from("site_snapshots").update(payload).eq("id", idsRef.current.baseline).select("id").single()
      : await supabase.from("site_snapshots").insert(insertPayload).select("id").single();

    if (result.error) return { error: result.error.message };

    idsRef.current.baseline = result.data.id;
    await supabase.from("site_editor_state").upsert({ id: true, baseline_snapshot_id: result.data.id, updated_by: state.session.user.id });
    await supabase.from("site_change_log").insert({
      action: "baseline_defined",
      entity_type: "snapshot",
      entity_id: result.data.id,
      snapshot_id: result.data.id,
      actor_user_id: state.session.user.id,
      details: { source: "draft" },
    });
    await reload(state.session);
    return { error: null };
  }, [reload, state.content, state.isAdmin, state.mediaLibrary, state.session, state.theme]);

  const uploadMedia = useCallback(
    async (file: File, tags: string[] = []) => {
      if (!state.session || !state.isAdmin) return { error: "Unauthorized", item: null };

      const path = `library/${Date.now()}-${sanitizeFileName(file.name)}.jpg`;
      const filePath = await uploadSiteImage(file, path);
      const payload = {
        file_path: filePath,
        title: file.name.replace(/\.[^/.]+$/, ""),
        alt_text: file.name.replace(/\.[^/.]+$/, ""),
        tags,
        metadata: { uploadedAt: new Date().toISOString() },
        created_by: state.session.user.id,
      };

      const { data, error: insertError } = await supabase.from("site_media_library").insert(payload).select("id,file_path,title,alt_text,tags,metadata").single();
      if (insertError) return { error: insertError.message, item: null };

      const item = data as SiteMediaItem;
      setState((current) => ({ ...current, mediaLibrary: [item, ...current.mediaLibrary] }));
      return { error: null, item };
    },
    [state.isAdmin, state.session],
  );

  const updateMediaItem = useCallback(
    async (itemId: string, updates: Partial<Pick<SiteMediaItem, "title" | "alt_text" | "tags">>) => {
      if (!state.session || !state.isAdmin) return { error: "Unauthorized" };

      const payload = {
        ...(updates.title !== undefined ? { title: updates.title } : {}),
        ...(updates.alt_text !== undefined ? { alt_text: updates.alt_text } : {}),
        ...(updates.tags !== undefined ? { tags: updates.tags } : {}),
      };

      const { data, error: updateError } = await supabase
        .from("site_media_library")
        .update(payload)
        .eq("id", itemId)
        .select("id,file_path,title,alt_text,tags,metadata")
        .single();

      if (updateError) return { error: updateError.message };

      setState((current) => ({
        ...current,
        mediaLibrary: current.mediaLibrary.map((item) => (item.id === itemId ? (data as SiteMediaItem) : item)),
      }));

      return { error: null };
    },
    [state.isAdmin, state.session],
  );

  return {
    ...state,
    error,
    saveTick,
    setContent,
    setTheme,
    setMediaLibrary,
    publish,
    restoreToDraft,
    resetToBaseline,
    defineCurrentAsBaseline,
    uploadMedia,
    updateMediaItem,
    saveNow: persistDraft,
    reload: () => reload(state.session),
  };
}
