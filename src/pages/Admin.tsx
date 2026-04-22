import { FormEvent, useMemo, useState } from "react";
import { History, ImagePlus, Loader2, LogOut, Palette, RefreshCw, RotateCcw, Save, Sparkles, UploadCloud } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useVisualSiteEditor } from "@/hooks/useVisualSiteEditor";
import { resolveMediaUrl } from "@/lib/site-editor/mapper";
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

export default function Admin() {
  const editor = useVisualSiteEditor();
  const [tab, setTab] = useState("content");

  const mediaOptions = useMemo(() => editor.mediaLibrary.map((item) => ({ ...item, url: resolveMediaUrl(item.file_path, 800, 80) ?? item.file_path })), [editor.mediaLibrary]);

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
    toast({ title: "Media added", description: "Image added to your library." });
  };

  if (!editor.session && !editor.loading) return <AdminSignIn onSignedIn={() => void editor.reload()} />;
  if (editor.loading) return <main className="flex min-h-screen items-center justify-center"><div className="flex items-center gap-3 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Loading visual editor</div></main>;
  if (!editor.isAdmin) return <main className="flex min-h-screen items-center justify-center px-6"><Card className="max-w-xl"><CardHeader><CardTitle>Admin access required</CardTitle></CardHeader><CardContent className="space-y-4"><p className="text-sm text-muted-foreground">This route is protected by your Supabase admin role.</p><div className="flex gap-3"><Button onClick={() => void editor.reload()} variant="outline"><RefreshCw className="h-4 w-4" />Refresh</Button><Button onClick={handleSignOut} variant="outline"><LogOut className="h-4 w-4" />Sign out</Button></div></CardContent></Card></main>;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[380px_minmax(0,1fr)]">
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
                    <CardHeader><CardTitle>Hero</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><Label>Tagline</Label><Textarea value={editor.content.hero.tagline} onChange={(e) => editor.setContent((c) => ({ ...c, hero: { ...c.hero, tagline: e.target.value } }))} /></div>
                      <div><Label>Location</Label><Input value={editor.content.hero.location} onChange={(e) => editor.setContent((c) => ({ ...c, hero: { ...c.hero, location: e.target.value } }))} /></div>
                      <div><Label>Reserve label</Label><Input value={editor.content.hero.reserveLabel} onChange={(e) => editor.setContent((c) => ({ ...c, hero: { ...c.hero, reserveLabel: e.target.value } }))} /></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Concept</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><Label>Eyebrow</Label><Input value={editor.content.concept.eyebrow} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, eyebrow: e.target.value } }))} /></div>
                      <div><Label>Title</Label><Textarea value={editor.content.concept.title} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, title: e.target.value } }))} /></div>
                      <div><Label>Body</Label><Textarea value={editor.content.concept.body} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, body: e.target.value } }))} /></div>
                      <div><Label>Quote</Label><Textarea value={editor.content.concept.quote} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, quote: e.target.value } }))} /></div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Reserve</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><Label>Section title</Label><Input value={editor.content.reserve.title} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, title: e.target.value } }))} /></div>
                      <div><Label>Price</Label><Input value={editor.content.reserve.price} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, price: e.target.value } }))} /></div>
                      <div><Label>Button</Label><Input value={editor.content.reserve.reserveButton} onChange={(e) => editor.setContent((c) => ({ ...c, reserve: { ...c.reserve, reserveButton: e.target.value } }))} /></div>
                      <div><Label>Footer quote</Label><Textarea value={editor.content.footer.quote} onChange={(e) => editor.setContent((c) => ({ ...c, footer: { ...c.footer, quote: e.target.value } }))} /></div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="media" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle>Upload to library</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <Input type="file" accept="image/*" onChange={(e) => void handleUpload(e.target.files?.[0] ?? null, ["library"])} />
                      <Separator />
                      <div className="grid grid-cols-2 gap-3">
                        {mediaOptions.slice(0, 12).map((item) => (
                          <button key={item.id ?? item.file_path} type="button" className="overflow-hidden rounded-md border border-border text-left" onClick={() => editor.setContent((c) => ({ ...c, concept: { ...c.concept, chefImage: item.file_path, chefAlt: item.alt_text ?? c.concept.chefAlt } }))}>
                            <img src={item.url} alt={item.alt_text ?? item.title ?? "Media item"} className="aspect-square w-full object-cover" />
                            <div className="p-2 text-xs text-muted-foreground">{item.title ?? item.file_path}</div>
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">Click any image to use it as the concept chef image for now.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader><CardTitle>Quick image targets</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Concept chef image</Label>
                        <Input value={editor.content.concept.chefImage} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, chefImage: e.target.value } }))} />
                      </div>
                      <div>
                        <Label>Concept founders image</Label>
                        <Input value={editor.content.concept.foundersImage} onChange={(e) => editor.setContent((c) => ({ ...c, concept: { ...c.concept, foundersImage: e.target.value } }))} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="colors" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle>Background tokens</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div><Label>Concept background</Label><Input value={editor.theme.conceptBackground} onChange={(e) => editor.setTheme((t) => ({ ...t, conceptBackground: e.target.value }))} /></div>
                      <div><Label>Zoom background</Label><Input value={editor.theme.zoomBackground} onChange={(e) => editor.setTheme((t) => ({ ...t, zoomBackground: e.target.value }))} /></div>
                      <div><Label>Producers background</Label><Input value={editor.theme.producersBackground} onChange={(e) => editor.setTheme((t) => ({ ...t, producersBackground: e.target.value }))} /></div>
                      <div><Label>Reserve background</Label><Input value={editor.theme.reserveBackground} onChange={(e) => editor.setTheme((t) => ({ ...t, reserveBackground: e.target.value }))} /></div>
                      <div><Label>Footer background</Label><Input value={editor.theme.footerBackground} onChange={(e) => editor.setTheme((t) => ({ ...t, footerBackground: e.target.value }))} /></div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader><CardTitle>Snapshot history</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {editor.history.slice(0, 12).map((entry) => (
                        <div key={entry.id} className="rounded-md border border-border p-3">
                          <div className="flex items-center justify-between gap-2"><div><p className="text-sm font-medium">{entry.name ?? entry.kind}</p><p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</p></div><Button size="sm" variant="outline" onClick={() => void editor.restoreToDraft(entry.id)}><RotateCcw className="h-4 w-4" />Restore</Button></div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Recent actions</CardTitle></CardHeader>
                    <CardContent className="space-y-2">
                      {editor.changeLog.slice(0, 10).map((entry) => <div key={entry.id} className="flex items-center justify-between gap-3 text-sm"><span>{entry.action}</span><span className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</span></div>)}
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
              <span className="inline-flex items-center gap-2"><ImagePlus className="h-4 w-4" />Media library</span>
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
