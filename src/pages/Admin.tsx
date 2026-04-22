import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { Loader2, LogOut, RefreshCw, Save, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { uploadSiteImage, getImageUrl } from "@/lib/imageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";

type SiteContentRow = Tables<"site_content">;

const SECTION_ORDER = ["hero", "about", "menu", "hours", "location", "contact", "cancellation", "reservation", "footer", "nav", "photo_grid", "chapter_01"];

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  about: "About",
  menu: "Menu",
  hours: "Hours",
  location: "Location",
  contact: "Contact",
  cancellation: "Cancellation",
  reservation: "Reservation",
  footer: "Footer",
  nav: "Navigation",
  photo_grid: "Photo grid",
  chapter_01: "Chapter 01",
};

const IMAGE_PATHS: Record<string, string> = {
  "hero.background_image": "hero/background.jpg",
  "photo_grid.slot_01": "photo_grid/slot_01.jpg",
  "photo_grid.slot_02": "photo_grid/slot_02.jpg",
  "photo_grid.slot_03": "photo_grid/slot_03.jpg",
  "photo_grid.slot_04": "photo_grid/slot_04.jpg",
  "photo_grid.slot_05": "photo_grid/slot_05.jpg",
  "photo_grid.slot_06": "photo_grid/slot_06.jpg",
  "about.image_01": "about/image_01.jpg",
  "about.image_02": "about/image_02.jpg",
  "menu.image_01": "menu/image_01.jpg",
};

const isLongText = (value: string | null) => (value?.length ?? 0) > 120;

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [rows, setRows] = useState<SiteContentRow[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setSession(data.session);
        setLoadingAuth(false);
      }
    };

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) {
        setSession(nextSession);
        setLoadingAuth(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadContent = async () => {
    setLoadingContent(true);

    const { data, error } = await supabase
      .from("site_content")
      .select("id, section, key, content_type, value, updated_at")
      .order("section")
      .order("key");

    setLoadingContent(false);

    if (error) {
      toast({
        title: "Could not load content",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setRows(data ?? []);
    setDrafts(
      Object.fromEntries(
        (data ?? []).map((row) => [`${row.section}.${row.key}`, row.value ?? ""]),
      ),
    );
  };

  useEffect(() => {
    if (!session) {
      setRows([]);
      setDrafts({});
      return;
    }

    loadContent();
  }, [session]);

  const groupedRows = useMemo(() => {
    const groups = new Map<string, SiteContentRow[]>();

    rows.forEach((row) => {
      if (!groups.has(row.section)) groups.set(row.section, []);
      groups.get(row.section)?.push(row);
    });

    return Array.from(groups.entries()).sort(([a], [b]) => {
      const aIndex = SECTION_ORDER.indexOf(a);
      const bIndex = SECTION_ORDER.indexOf(b);

      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [rows]);

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSigningIn(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setSigningIn(false);

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    setPassword("");
    toast({ title: "Signed in", description: "Admin access is now available." });
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({ title: "Could not sign out", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: "Signed out" });
  };

  const handleSave = async (row: SiteContentRow) => {
    const identity = `${row.section}.${row.key}`;
    setSavingKey(identity);

    const { error } = await supabase.from("site_content").upsert(
      {
        id: row.id,
        section: row.section,
        key: row.key,
        content_type: row.content_type,
        value: drafts[identity] ?? "",
      },
      { onConflict: "section,key" },
    );

    setSavingKey(null);

    if (error) {
      toast({ title: "Could not save field", description: error.message, variant: "destructive" });
      return;
    }

    setRows((current) =>
      current.map((entry) =>
        entry.id === row.id ? { ...entry, value: drafts[identity] ?? "", updated_at: new Date().toISOString() } : entry,
      ),
    );

    toast({ title: "Saved", description: `${row.section} / ${row.key} updated.` });
  };

  const handleImageUpload = async (row: SiteContentRow, file: File | null) => {
    if (!file) return;

    const identity = `${row.section}.${row.key}`;
    const uploadPath = IMAGE_PATHS[identity];

    if (!uploadPath) {
      toast({
        title: "Upload path missing",
        description: `This image field is not mapped yet: ${identity}.`,
        variant: "destructive",
      });
      return;
    }

    setUploadingKey(identity);

    try {
      const path = await uploadSiteImage(file, uploadPath);
      setDrafts((current) => ({ ...current, [identity]: path }));

      const { error } = await supabase.from("site_content").upsert(
        {
          id: row.id,
          section: row.section,
          key: row.key,
          content_type: row.content_type,
          value: path,
        },
        { onConflict: "section,key" },
      );

      if (error) throw error;

      setRows((current) =>
        current.map((entry) => (entry.id === row.id ? { ...entry, value: path, updated_at: new Date().toISOString() } : entry)),
      );

      toast({ title: "Image uploaded", description: `${row.section} / ${row.key} updated.` });
    } catch (error) {
      toast({
        title: "Could not upload image",
        description: error instanceof Error ? error.message : "Unknown upload error.",
        variant: "destructive",
      });
    } finally {
      setUploadingKey(null);
    }
  };

  if (loadingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading admin
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-background px-6 py-10 text-foreground">
        <div className="mx-auto flex w-full max-w-md flex-col gap-8 border border-border bg-card p-8 shadow-sm">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Content admin</p>
            <h1 className="text-3xl font-semibold text-foreground">Sign in</h1>
            <p className="text-sm leading-6 text-muted-foreground">Use an authenticated Supabase account to manage the site content.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            </div>

            <Button className="w-full" type="submit" disabled={signingIn}>
              {signingIn ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {signingIn ? "Signing in" : "Open admin"}
            </Button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Content admin</p>
            <h1 className="text-3xl font-semibold text-foreground">Site content management</h1>
            <p className="text-sm leading-6 text-muted-foreground">Signed in as {session.user.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" variant="outline" onClick={loadContent} disabled={loadingContent}>
              {loadingContent ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
            <Button type="button" variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </header>

        <div className="grid gap-6">
          {groupedRows.map(([section, sectionRows]) => (
            <section key={section} className="border border-border bg-card p-6 shadow-sm">
              <div className="mb-5 space-y-1 border-b border-border pb-4">
                <h2 className="text-xl font-semibold text-foreground">{SECTION_LABELS[section] ?? section}</h2>
                <p className="text-sm text-muted-foreground">{sectionRows.length} fields</p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {sectionRows.map((row) => {
                  const identity = `${row.section}.${row.key}`;
                  const value = drafts[identity] ?? "";
                  const imageUrl = row.content_type === "image" ? getImageUrl(value || null, 1200, 82) : null;
                  const isSaving = savingKey === identity;
                  const isUploading = uploadingKey === identity;

                  return (
                    <article key={row.id} className="flex flex-col gap-3 border border-border p-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-medium text-foreground">{row.key}</h3>
                          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{row.content_type}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Updated {new Date(row.updated_at).toLocaleString()}</p>
                      </div>

                      {row.content_type === "image" ? (
                        <>
                          <div className="overflow-hidden border border-border bg-muted">
                            {imageUrl ? (
                              <img src={imageUrl} alt={`${row.section} ${row.key}`} className="h-56 w-full object-cover" loading="lazy" />
                            ) : (
                              <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">No image uploaded</div>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`upload-${identity}`}>Upload image</Label>
                            <Input
                              id={`upload-${identity}`}
                              type="file"
                              accept="image/*"
                              onChange={(event) => void handleImageUpload(row, event.target.files?.[0] ?? null)}
                              disabled={isUploading}
                            />
                            <p className="text-xs text-muted-foreground">Storage path: {IMAGE_PATHS[identity] ?? "Not configured"}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                            {isUploading ? "Uploading image" : "Selecting a file uploads it immediately"}
                          </div>
                        </>
                      ) : isLongText(value) ? (
                        <Textarea value={value} onChange={(event) => setDrafts((current) => ({ ...current, [identity]: event.target.value }))} />
                      ) : (
                        <Input value={value} onChange={(event) => setDrafts((current) => ({ ...current, [identity]: event.target.value }))} />
                      )}

                      {row.content_type !== "image" ? (
                        <Button type="button" onClick={() => void handleSave(row)} disabled={isSaving}>
                          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          {isSaving ? "Saving" : "Save field"}
                        </Button>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}