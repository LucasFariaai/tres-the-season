import { Navigate } from "react-router-dom";
import { AdminPageShell } from "@/components/admin/AdminPageShell";
import { AdminMenusPanel } from "@/components/admin/AdminMenusPanel";
import { uiPalette } from "@/components/admin/adminStyles";
import { toast } from "@/components/ui/use-toast";
import { useVisualSiteEditor } from "@/hooks/useVisualSiteEditor";

export default function AdminMenus() {
  const editor = useVisualSiteEditor();

  if (editor.loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: uiPalette.panel, color: uiPalette.controlText, fontFamily: '"Abel", sans-serif' }}>
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
    toast({ title: "Published", description: "The tasting menus draft is now live." });
  };

  return (
    <AdminPageShell
      editor={editor}
      title="Tasting menus"
      subtitle="Edit each season's tasting menu — add, reorder, remove or rewrite dishes."
      onPublish={handlePublish}
    >
      <AdminMenusPanel editor={editor} />
    </AdminPageShell>
  );
}
