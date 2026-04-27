import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { buttonBase, toolbarHeight, uiPalette } from "@/components/admin/adminStyles";
import { toast } from "@/components/ui/use-toast";

type Subscriber = {
  id: string;
  email: string;
  source: string | null;
  created_at: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export function AdminSubscribersPanel({ open, onClose }: Props) {
  const [subs, setSubs] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, source, created_at")
      .order("created_at", { ascending: false })
      .limit(1000);
    setLoading(false);
    if (error) {
      toast({ title: "Could not load subscribers", description: error.message, variant: "destructive" });
      return;
    }
    setSubs(data ?? []);
  };

  useEffect(() => {
    if (open) void load();
  }, [open]);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) {
      toast({ title: "Delete failed", description: error.message, variant: "destructive" });
      return;
    }
    setSubs((prev) => prev.filter((s) => s.id !== id));
  };

  const handleExport = () => {
    const header = "email,source,created_at\n";
    const rows = subs.map((s) => `${s.email},${s.source ?? ""},${s.created_at}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!open) return null;

  return (
    <div
      data-lenis-prevent
      style={{
        position: "fixed",
        top: toolbarHeight + 24,
        right: 16,
        bottom: 16,
        width: 480,
        maxWidth: "calc(100vw - 32px)",
        maxHeight: "calc(100vh - 96px)",
        background: "rgba(245,239,230,0.96)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid rgba(26,20,16,0.06)",
        borderRadius: 18,
        boxShadow: "0 12px 40px rgba(26,20,16,0.10)",
        zIndex: 49,
        display: "flex",
        flexDirection: "column",
        color: uiPalette.controlText,
        fontFamily: '"Source Sans 3", sans-serif',
        overflow: "hidden",
      }}
    >
      <div style={{ padding: 20, borderBottom: `1px solid ${uiPalette.panelBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: uiPalette.controlMuted }}>Newsletter</p>
          <h2 style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 400 }}>Subscribers ({subs.length})</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button type="button" onClick={handleExport} disabled={subs.length === 0} style={buttonBase}>Export CSV</button>
          <button type="button" onClick={onClose} style={buttonBase}>Close</button>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", padding: 12 }}>
        {loading ? (
          <p style={{ padding: 12, color: uiPalette.controlMuted }}>Loading…</p>
        ) : subs.length === 0 ? (
          <p style={{ padding: 12, color: uiPalette.controlMuted }}>No subscribers yet.</p>
        ) : (
          subs.map((s) => (
            <div
              key={s.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderBottom: `1px solid ${uiPalette.panelBorder}`,
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.email}</div>
                <div style={{ fontSize: 11, color: uiPalette.controlMuted, marginTop: 2 }}>
                  {new Date(s.created_at).toLocaleString()} {s.source ? `· ${s.source}` : ""}
                </div>
              </div>
              <button
                type="button"
                onClick={() => void handleDelete(s.id)}
                style={{ ...buttonBase, padding: "6px 10px", fontSize: 11 }}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
