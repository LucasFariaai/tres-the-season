import { FormEvent, useMemo, useState } from "react";
import {
  History,
  ImagePlus,
  Loader2,
  LogOut,
  Palette,
  RefreshCw,
  RotateCcw,
  Save,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useVisualSiteEditor } from "@/hooks/useVisualSiteEditor";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
import type { GalleryItemInput, SiteMediaItem } from "@/lib/site-editor/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import HeroSection from "@/components/HeroSection";
import ZoomParallaxSection from "@/components/ZoomParallaxSection";
import ConceptSection from "@/components/ConceptSection";
import TresGallerySection from "@/components/TresGallerySection";
import ProducersSection from "@/components/ProducersSection";
import ReserveSection from "@/components/ReserveSection";
import FooterSection from "@/components/FooterSection";

function AdminSignIn({ onSignedIn }: { onSignedIn: (session: Session) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      return;
    }
    if (data.session) onSignedIn(data.session);
  };

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 border border-border bg-card p-8 shadow-sm">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Visual admin</p>
          <h1 className="text-3xl font-semibold text-foreground">Sign in</h1>
          <p className="text-sm leading-6 text-muted-foreground">Use your admin account to edit the published home visually.</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
          <Button className="w-full" type="submit" disabled={submitting}>{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}{submitting ? "Signing in" : "Open editor"}</Button>
        </form>
      </div>
    </main>
  );
}

const toLineString = (lines: string[]) => lines.join("\n");
const toLines = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);
const tokenSwatchStyle = (value: string) => ({ background: value.includes("gradient") ? value : value, backgroundColor: value.includes("gradient") ? undefined : value });

type MediaTarget =
  | { type: "conceptChef" }
  | { type: "conceptFounders" }
  | { type: "zoom"; index: number }
  | { type: "gallery"; index: number };

export default function Admin() {
  const editor = useVisualSiteEditor();
  const [tab, setTab] = useState("content");
  const [mediaTarget, setMediaTarget] = useState<MediaTarget>({ type: "conceptChef" });
  const [mediaSearch, setMediaSearch] = useState("");
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [editingMediaTitle, setEditingMediaTitle] = useState("");
  const [editingMediaAlt, setEditingMediaAlt] = useState("");
  const [editingMediaTags, setEditingMediaTags] = useState("");

  const mediaOptions = useMemo(
    () => editor.mediaLibrary.map((item) => ({ ...item, url: resolveMediaUrl(item.file_path, 800, 80) ?? item.file_path })),
    [editor.mediaLibrary],
  );

  const filteredMedia = useMemo(() => {
    const query = mediaSearch.trim().toLowerCase();
    if (!query) return mediaOptions;
    return mediaOptions.filter((item) =>
      [item.title, item.alt_text, item.file_path, item.tags.join(" ")].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [mediaOptions, mediaSearch]);

  const currentTargetLabel = useMemo(() => {
    switch (mediaTarget.type) {
      case "conceptChef":
        return "Concept · chef";
      case "conceptFounders":
        return "Concept · founders";
      case "zoom":
        return `Zoom image ${mediaTarget.index + 1}`;
      case "gallery":
        return `Gallery item ${mediaTarget.index + 1}`;
    }
  }, [mediaTarget]);

  const openMediaEditor = (item: SiteMediaItem) => {
    setEditingMediaId(item.id ?? null);
    setEditingMediaTitle(item.title ?? "");
    setEditingMediaAlt(item.alt_text ?? "");
    setEditingMediaTags(item.tags.join(", "));
  };

  const applyMediaToTarget = (item: SiteMediaItem) => {
    switch (mediaTarget.type) {
      case "conceptChef":
        editor.setContent((c) => ({ ...c, concept: { ...c.concept, chefImage: item.file_path, chefAlt: item.alt_text ?? c.concept.chefAlt } }));
        break;
      case "conceptFounders":
        editor.setContent((c) => ({ ...c, concept: { ...c.concept, foundersImage: item.file_path, foundersAlt: item.alt_text ?? c.concept.foundersAlt } }));
        break;
      case "zoom":
        editor.setContent((c) => ({
          ...c,
          zoom: {
            ...c.zoom,
            images: c.zoom.images.map((image, index) => index === mediaTarget.index ? { ...image, src: item.file_path, alt: item.alt_text ?? image.alt } : image),
          },
        }));
        break;
      case "gallery":
        editor.setContent((c) => ({
          ...c,
          gallery: {
            ...c.gallery,
            items: c.gallery.items.map((galleryItem, index) => index === mediaTarget.index ? { ...galleryItem, mediaSrc: item.file_path, alt: item.alt_text ?? galleryItem.alt } : galleryItem),
          },
        }));
        break;
    }
    toast({ title: "Image applied", description: `${currentTargetLabel} updated.` });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
  };

  const handlePublish = async () => {
    const result = await editor.publish();
    if (result.error) return toast({ title: "Could not publish", description: result.error, variant: "destructive" });
    toast({ title: "Published", description: "The public home is now updated." });
  };

  const handleReset = async () => {
    const result = await editor.resetToBaseline();
    if (result.error) return toast({ title: "Reset failed", description: result.error, variant: "destructive" });
    await editor.saveNow();
    toast({ title: "Draft reset", description: "The draft was restored to the baseline." });
  };

  const handleSetBaseline = async () => {
    const result = await editor.defineCurrentAsBaseline();
    if (result.error) return toast({ title: "Could not define baseline", description: result.error, variant: "destructive" });
    toast({ title: "Baseline updated", description: "Current draft is now the reset point." });
  };

  const handleUpload = async (file: File | null, tags: string[]) => {
    if (!file) return;
    const result = await editor.uploadMedia(file, tags);
    if (result.error) return toast({ title: "Upload failed", description: result.error, variant: "destructive" });
    if (result.item) applyMediaToTarget(result.item);
    toast({ title: "Media added", description: "Image added to your library." });
  };

  const handleSaveMediaMeta = async () => {
    if (!editingMediaId) return;
    const result = await editor.updateMediaItem(editingMediaId, {
      title: editingMediaTitle || null,
      alt_text: editingMediaAlt || null,
      tags: editingMediaTags.split(",").map((tag) => tag.trim()).filter(Boolean),
    });
    if (result.error) return toast({ title: "Could not update media", description: result.error, variant: "destructive" });
    toast({ title: "Media updated" });
  };

  const updateGalleryItem = (index: number, updater: (item: GalleryItemInput) => GalleryItemInput) => {
    editor.setContent((c) => ({
      ...c,
      gallery: {
        ...c.gallery,
        items: c.gallery.items.map((item, itemIndex) => itemIndex === index ? updater(item) : item),
      },
    }));
  };

  const moveGalleryItem = (index: number, direction: -1 | 1) => {
    editor.setContent((c) => {
      const next = [...c.gallery.items];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= next.length) return c;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return { ...c, gallery: { ...c.gallery, items: next } };
    });
  };

  if (!editor.session && !editor.loading) return <AdminSignIn onSignedIn={() => void editor.reload()} />;
  if (editor.loading) return <main className="flex min-h-screen items-center justify-center"><div className="flex items-center gap-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading visual editor</div></main>;
  if (!editor.isAdmin) return <main className="flex min-h-screen items-center justify-center px-6"><Card className="max-w-xl"><CardHeader><CardTitle>Admin access required</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">This route is protected by your Supabase admin role.</p><div className="flex gap-3"><Button onClick={() => void editor.reload()} variant="outline"><RefreshCw className="h-4 w-4" />Refresh</Button><Button onClick={handleSignOut} variant="outline"><LogOut className="h-4 w-4" />Sign out</Button></div></CardContent></Card></main>;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[420px_minmax(0,1fr)]">
        <aside className="border-r border-border bg-card">
          <ScrollArea className="h-screen">
            <div className="space-y-6 p-5">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Site editor</p>
                    <h1 className="text-2xl font-semibold">Home visual editor</h1>
                    <p className="text-sm text-muted-foreground">Signed in as {editor.session?.user.email}</p>
                  </div>
                  <Badge variant="outline">{editor.saving ? "Saving" : "Draft"}</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={handlePublish} disabled={editor.publishing}><Sparkles className="h-4 w-4" />{editor.publishing ? "Publishing" : "Publish"}</Button>
                  <Button size="sm" variant="outline" onClick={handleReset}><RotateCcw className="h-4 w-4" />Reset</Button>
                  <Button size="sm" variant="outline" onClick={handleSetBaseline}><Save className="h-4 w-4" />Set baseline</Button>
                  <Button size="sm" variant="outline" onClick={() => void editor.reload()}><RefreshCw className="h-4 w-4" />Reload</Button>
                  <Button size="sm" variant="outline" onClick={handleSignOut}><LogOut className="h-4 w-4" />Exit</Button>
                </div>
              </div>

              <Tabs value={tab} onValueChange={setTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="media">Media</TabsTrigger>
                  <TabsTrigger value="colors">Colors</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle>Hero + bands</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><Label>Tagline</Label><Textarea value={editor.content.hero.tagline} onChange={(e) => editor.setContent((c) => ({ ...c, hero: { ...c.hero, tagline: e.target.value } }))} /></div>
                      <div><Label>Location</Label><Input value={editor.content.hero.location} onChange={(e) => editor.setContent((c) => ({ ...c, hero: { ...c.hero, location: e.target.value } }))} /></div>
                      <div><Label>Reserve label</Label><Input value={editor.content.hero.reserveLabel} onChange={(e) => editor.setContent((c) => ({ ...c, hero: { ...c.hero, reserveLabel: e.target.value } }))} /></div>
                      <div><Label>Band · hero to zoom</Label><Textarea value={editor.content.bands.heroToZoom} onChange={(e) => editor.setContent((c) => ({ ...c, bands: { ...c.bands, heroToZoom: e.target.value } }))} /></div>
                      <div><Label>Band · zoom to producers</Label><Textarea value={editor.content.bands.zoomToProducers} onChange={(e) => editor.setContent((c) => ({ ...c, bands: { ...c.bands, zoomToProducers: e.target.value } }))} /></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Concept</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><Label>Eyebrow</Label><Input value={editor.content.concept.eyebrow} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, eyebrow: e.target.value } }))} /></div>
                      <div><Label>Title</Label><Textarea value={editor.content.concept.title} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, title: e.target.value } }))} /></div>
                      <div><Label>Body</Label><Textarea value={editor.content.concept.body} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, body: e.target.value } }))} /></div>
                      <div><Label>Hands title</Label><Input value={editor.content.concept.handsTitle} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, handsTitle: e.target.value } }))} /></div>
                      <div><Label>Hands body</Label><Textarea value={editor.content.concept.handsBody} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, handsBody: e.target.value } }))} /></div>
                      <div><Label>Place title</Label><Input value={editor.content.concept.placeTitle} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, placeTitle: e.target.value } }))} /></div>
                      <div><Label>Place body</Label><Textarea value={editor.content.concept.placeBody} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, placeBody: e.target.value } }))} /></div>
                      <div><Label>Quote</Label><Textarea value={editor.content.concept.quote} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, quote: e.target.value } }))} /></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Gallery</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div><Label>Eyebrow</Label><Input value={editor.content.gallery.eyebrow} onChange={(e) => editor.setContent((c) => ({ ...c, gallery: { ...c.gallery, eyebrow: e.target.value } }))} /></div>
                      <div><Label>Subtitle</Label><Input value={editor.content.gallery.subtitle} onChange={(e) => editor.setContent((c) => ({ ...c, gallery: { ...c.gallery, subtitle: e.target.value } }))} /></div>
                      <div className="space-y-4">
                        {editor.content.gallery.items.map((item, index) => (
                          <div key={item.id} className="rounded-md border border-border p-3">
                            <div className="mb-3 flex items-center justify-between gap-2">
                              <p className="text-sm font-medium">Item {index + 1}</p>
                              <div className="flex gap-2">
                                <Button type="button" size="sm" variant="outline" onClick={() => moveGalleryItem(index, -1)} disabled={index === 0}>↑</Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => moveGalleryItem(index, 1)} disabled={index === editor.content.gallery.items.length - 1}>↓</Button>
                                <Button type="button" size="sm" variant="outline" onClick={() => setMediaTarget({ type: "gallery", index })}>Target</Button>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div><Label>Label</Label><Input value={item.label ?? ""} onChange={(e) => updateGalleryItem(index, (current) => ({ ...current, label: e.target.value }))} /></div>
                              <div><Label>Caption</Label><Textarea value={item.caption ?? ""} onChange={(e) => updateGalleryItem(index, (current) => ({ ...current, caption: e.target.value }))} /></div>
                              <div><Label>Alt</Label><Input value={item.alt} onChange={(e) => updateGalleryItem(index, (current) => ({ ...current, alt: e.target.value }))} /></div>
                              <div><Label>Width</Label><Input value={item.width} onChange={(e) => updateGalleryItem(index, (current) => ({ ...current, width: e.target.value as GalleryItemInput["width"] }))} /></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Reserve + footer</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><Label>Reserve eyebrow</Label><Input value={editor.content.reserve.eyebrow} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, eyebrow: e.target.value } }))} /></div>
                      <div><Label>Reserve title</Label><Input value={editor.content.reserve.title} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, title: e.target.value } }))} /></div>
                      <div><Label>Hours title</Label><Input value={editor.content.reserve.hoursTitle} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, hoursTitle: e.target.value } }))} /></div>
                      <div><Label>Hours lines</Label><Textarea value={toLineString(editor.content.reserve.hoursLines)} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, hoursLines: toLines(e.target.value) } }))} /></div>
                      <div><Label>Location title</Label><Input value={editor.content.reserve.locationTitle} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, locationTitle: e.target.value } }))} /></div>
                      <div><Label>Location lines</Label><Textarea value={toLineString(editor.content.reserve.locationLines)} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, locationLines: toLines(e.target.value) } }))} /></div>
                      <div><Label>Travel title</Label><Input value={editor.content.reserve.travelTitle} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, travelTitle: e.target.value } }))} /></div>
                      <div><Label>Travel lines</Label><Textarea value={toLineString(editor.content.reserve.travelLines)} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, travelLines: toLines(e.target.value) } }))} /></div>
                      <div><Label>Price</Label><Input value={editor.content.reserve.price} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, price: e.target.value } }))} /></div>
                      <div><Label>Reserve button</Label><Input value={editor.content.reserve.reserveButton} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, reserveButton: e.target.value } }))} /></div>
                      <div><Label>Reserve note</Label><Textarea value={editor.content.reserve.note} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, note: e.target.value } }))} /></div>
                      <Separator />
                      <div><Label>Footer quote</Label><Textarea value={editor.content.footer.quote} onChange={(e) => editor.setContent((c) => ({ ...c, footer: { ...c.footer, quote: e.target.value } }))} /></div>
                      <div><Label>Instagram URL</Label><Input value={editor.content.footer.instagramUrl} onChange={(e) => editor.setContent((c) => ({ ...c, footer: { ...c.footer, instagramUrl: e.target.value } }))} /></div>
                      <div><Label>Facebook URL</Label><Input value={editor.content.footer.facebookUrl} onChange={(e) => editor.setContent((c) => ({ ...c, footer: { ...c.footer, facebookUrl: e.target.value } }))} /></div>
                      <div><Label>Logo alt</Label><Input value={editor.content.footer.logoAlt} onChange={(e) => editor.setContent((c) => ({ ...c, footer: { ...c.footer, logoAlt: e.target.value } }))} /></div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle>Upload + target</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-md border border-border p-3 text-sm text-muted-foreground">Current target: <span className="text-foreground">{currentTargetLabel}</span></div>
                      <Input type="file" accept="image/*" onChange={(e) => void handleUpload(e.target.files?.[0] ?? null, [tab, mediaTarget.type])} />
                      <div className="grid grid-cols-2 gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => setMediaTarget({ type: "conceptChef" })}>Chef</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setMediaTarget({ type: "conceptFounders" })}>Founders</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setMediaTarget({ type: "zoom", index: 0 })}>Zoom #1</Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setMediaTarget({ type: "gallery", index: 0 })}>Gallery #1</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Library</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <Input placeholder="Search by title, alt, path or tag" value={mediaSearch} onChange={(e) => setMediaSearch(e.target.value)} />
                      <div className="grid grid-cols-2 gap-3">
                        {filteredMedia.slice(0, 24).map((item) => (
                          <div key={item.id ?? item.file_path} className="overflow-hidden rounded-md border border-border text-left">
                            <button type="button" className="w-full text-left" onClick={() => applyMediaToTarget(item)}>
                              <img src={item.url} alt={item.alt_text ?? item.title ?? "Media item"} className="aspect-square w-full object-cover" />
                              <div className="space-y-1 p-2 text-xs text-muted-foreground">
                                <p className="truncate text-foreground">{item.title ?? item.file_path}</p>
                                <p className="truncate">{item.tags.join(", ")}</p>
                              </div>
                            </button>
                            <div className="border-t border-border p-2">
                              <Button type="button" variant="ghost" size="sm" className="w-full" onClick={() => openMediaEditor(item)}>Edit meta</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Metadata</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><Label>Title</Label><Input value={editingMediaTitle} onChange={(e) => setEditingMediaTitle(e.target.value)} /></div>
                      <div><Label>Alt text</Label><Input value={editingMediaAlt} onChange={(e) => setEditingMediaAlt(e.target.value)} /></div>
                      <div><Label>Tags</Label><Input value={editingMediaTags} onChange={(e) => setEditingMediaTags(e.target.value)} placeholder="gallery, hero, concept" /></div>
                      <Button type="button" onClick={handleSaveMediaMeta} disabled={!editingMediaId}>Save metadata</Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle>Theme tokens</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      {[
                        ["Hero overlay", "heroOverlay"],
                        ["Concept background", "conceptBackground"],
                        ["Zoom background", "zoomBackground"],
                        ["Producers background", "producersBackground"],
                        ["Reserve background", "reserveBackground"],
                        ["Footer background", "footerBackground"],
                        ["Band hero to zoom", "bandHeroToZoom"],
                        ["Band zoom to producers", "bandZoomToProducers"],
                      ].map(([label, key]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <Label>{label}</Label>
                            <span className="h-6 w-12 rounded border border-border" style={tokenSwatchStyle(editor.theme[key as keyof typeof editor.theme] as string)} />
                          </div>
                          <Textarea value={editor.theme[key as keyof typeof editor.theme] as string} onChange={(e) => editor.setTheme((t) => ({ ...t, [key]: e.target.value }))} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle>Snapshot history</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {editor.history.slice(0, 12).map((entry) => (
                        <div key={entry.id} className="rounded-md border border-border p-3">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium">{entry.name ?? entry.kind}</p>
                                <Badge variant="outline">{entry.kind}</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</p>
                            </div>
                            <Button size="sm" variant="outline" onClick={async () => {
                              const result = await editor.restoreToDraft(entry.id);
                              if (result.error) return toast({ title: "Restore failed", description: result.error, variant: "destructive" });
                              await editor.saveNow();
                              toast({ title: "Draft restored" });
                            }}><RotateCcw className="h-4 w-4" />Restore</Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Recent actions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {editor.changeLog.slice(0, 12).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between gap-3 text-sm">
                          <span>{entry.action}</span>
                          <span className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        </aside>

        <section className="bg-background">
          <div className="sticky top-0 z-20 border-b border-border bg-background/95 px-6 py-4 backdrop-blur">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2"><Palette className="h-4 w-4" />Colors</span>
              <span className="inline-flex items-center gap-2"><ImagePlus className="h-4 w-4" />{currentTargetLabel}</span>
              <span className="inline-flex items-center gap-2"><History className="h-4 w-4" />History</span>
              <span className="inline-flex items-center gap-2"><UploadCloud className="h-4 w-4" />Autosave #{editor.saveTick}</span>
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-65px)]">
            <div className="min-h-screen">
              <HeroSection shouldPlay={false} content={editor.content.hero} theme={editor.theme} />
              <div aria-hidden="true" className="w-full" style={{ height: "120px", background: editor.content.bands.heroToZoom || editor.theme.bandHeroToZoom }} />
              <ZoomParallaxSection content={editor.content.zoom} theme={editor.theme} />
              <ConceptSection content={editor.content.concept} theme={editor.theme} />
              <TresGallerySection content={editor.content.gallery} theme={editor.theme} />
              <div aria-hidden="true" className="w-full" style={{ height: "220px", background: editor.content.bands.zoomToProducers || editor.theme.bandZoomToProducers }} />
              <ProducersSection content={editor.content.producers} theme={editor.theme} />
              <ReserveSection content={editor.content.reserve} theme={editor.theme} />
              <FooterSection content={editor.content.footer} theme={editor.theme} />
            </div>
          </ScrollArea>
        </section>
      </div>
    </main>
  );
}
