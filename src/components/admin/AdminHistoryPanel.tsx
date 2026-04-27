import { useEffect, useMemo, useState } from "react";
import { buttonBase, fieldLabelStyle, sectionHeaderStyle, uiPalette } from "@/components/admin/adminStyles";
import type { VisualEditor } from "@/components/admin/types";
import { toast } from "@/components/ui/use-toast";

function formatRelativeTime(timestamp: string) {
  const now = Date.now();
  const value = new Date(timestamp).getTime();
  const diffSeconds = Math.round((value - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const intervals: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["week", 60 * 60 * 24 * 7],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
  ];

  for (const [unit, seconds] of intervals) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit);
    }
  }

  return rtf.format(diffSeconds, "second");
}

type AdminHistoryPanelProps = {
  editor: VisualEditor;
};

export function AdminHistoryPanel({ editor }: AdminHistoryPanelProps) {
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    if (!confirmReset) return;
    const timeout = window.setTimeout(() => setConfirmReset(false), 3000);
    return () => window.clearTimeout(timeout);
  }, [confirmReset]);

  const historyEntries = useMemo(() => editor.history, [editor.history]);
  const recentActions = useMemo(() => editor.changeLog.slice(0, 10), [editor.changeLog]);

  const handleResetBaseline = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }

    try {
      await editor.resetToBaseline();
      await editor.saveNow();
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Unable to reset baseline.",
        variant: "destructive",
      });
      return;
    }

    setConfirmReset(false);
    toast({ title: "Baseline restored" });
  };

  const handleSetBaseline = async () => {
    try {
      await editor.defineCurrentAsBaseline();
    } catch (error) {
      toast({
        title: "Baseline update failed",
        description: error instanceof Error ? error.message : "Unable to update baseline.",
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Baseline updated" });
  };

  const handleRestore = async (snapshotId: string) => {
    try {
      await editor.restoreToDraft(snapshotId);
      await editor.saveNow();
    } catch (error) {
      toast({
        title: "Restore failed",
        description: error instanceof Error ? error.message : "Unable to restore draft.",
        variant: "destructive",
      });
      return;
    }

    toast({ title: "Draft restored" });
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <h2 style={sectionHeaderStyle}>Version history</h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={() => void handleResetBaseline()} style={{ ...buttonBase, color: uiPalette.ghostText, borderColor: uiPalette.ghostBorder, padding: "8px 12px", fontSize: 12 }}>
          {confirmReset ? "Are you sure?" : "Reset to baseline"}
        </button>
        <button type="button" onClick={() => void handleSetBaseline()} style={{ ...buttonBase, color: uiPalette.ghostText, borderColor: uiPalette.ghostBorder, padding: "8px 12px", fontSize: 12 }}>
          Set current as baseline
        </button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <span style={fieldLabelStyle}>History</span>
        <div style={{ maxHeight: 320, overflowY: "auto", border: `1px solid ${uiPalette.controlBorder}` }}>
          {historyEntries.length ? (
            historyEntries.map((entry) => (
              <div key={entry.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 14px", borderBottom: `1px solid ${uiPalette.controlBorder}` }}>
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: 13, color: uiPalette.controlText }}>{entry.name || entry.kind}</span>
                  <span style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: 11, color: uiPalette.controlSoft }}>{formatRelativeTime(entry.created_at)}</span>
                </div>
                <button type="button" onClick={() => void handleRestore(entry.id)} style={{ ...buttonBase, padding: "6px 10px", color: uiPalette.controlText, borderColor: uiPalette.controlBorder }}>
                  Restore
                </button>
              </div>
            ))
          ) : (
            <div style={{ padding: 14, fontFamily: '"Source Sans 3", sans-serif', fontSize: 13, color: uiPalette.controlMuted }}>No history yet.</div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <span style={fieldLabelStyle}>Recent actions</span>
        <div style={{ display: "grid", border: `1px solid ${uiPalette.controlBorder}` }}>
          {recentActions.length ? (
            recentActions.map((entry) => (
              <div key={entry.id} style={{ display: "grid", gap: 4, padding: "12px 14px", borderBottom: `1px solid ${uiPalette.controlBorder}` }}>
                <span style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: 13, color: uiPalette.controlText }}>{entry.action}</span>
                <span style={{ fontFamily: '"Source Sans 3", sans-serif', fontSize: 11, color: uiPalette.controlSoft }}>{formatRelativeTime(entry.created_at)}</span>
              </div>
            ))
          ) : (
            <div style={{ padding: 14, fontFamily: '"Source Sans 3", sans-serif', fontSize: 13, color: uiPalette.controlMuted }}>No recent actions.</div>
          )}
        </div>
      </div>
    </div>
  );
}
