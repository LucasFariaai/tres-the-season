import { Navigate } from "react-router-dom";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminWinesPanel } from "@/components/admin/AdminWinesPanel";
import { uiPalette } from "@/components/admin/adminStyles";
import { toast } from "@/components/ui/use-toast";
import { useVisualSiteEditor } from "@/hooks/useVisualSiteEditor";

export default function AdminWines() {
  const editor = useVisualSiteEditor();

  if (editor.loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: uiPalette.panel, color: uiPalette.controlText, fontFamily: '"Source Sans 3", sans-serif' }}>
        Loading editor...
      </main>
    );
  }

  if (!editor.session || !editor.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  const handlePublish = async () => {
    const result = await editor.publish();
    if (result.error) {
      toast({ title: "Could not publish", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: "Published", description: "The wine list draft is now live." });
  };

  return (
    <AdminPageShell
      editor={editor}
      title="Wine list"
      subtitle="Search, filter, edit, add or remove wines from the published list."
      onPublish={handlePublish}
    >
      <AdminWinesPanel editor={editor} />
    </AdminPageShell>
  );
}
