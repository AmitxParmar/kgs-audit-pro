import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { PanelTheme } from "./Document";

type Tone = "danger" | "warning" | "info";

type AuditNotificationRow = {
  id: string;
  created_at: string;

  audit_type: "audit" | "iaf";
  audit_id: string | null;

  created_by: string | null;

  tone: Tone;
  title: string;
  description: string;

  time_label: string | null;

  unread: boolean;
  action_needed: boolean;
  dismissed: boolean;

  workspace_id: string;
};

function themeTokens(theme: PanelTheme) {
  if (theme === "audit") {
    return {
      accentBar: "bg-blue-500",
      tileBg: "bg-[#0F1B2E] border-white/10",
      focusRing: "focus:border-blue-500/30 focus:ring-blue-500/10",
    };
  }
  return {
    accentBar: "bg-[#F3A300]",
    tileBg: "bg-[#2A1C14] border-white/10",
    focusRing: "focus:border-amber-500/30 focus:ring-amber-500/10",
  };
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function tonePill(tone: Tone) {
  const cls =
    tone === "danger"
      ? "border-rose-400/25 bg-rose-400/10 text-rose-200"
      : tone === "warning"
        ? "border-amber-400/25 bg-amber-400/10 text-amber-200"
        : "border-slate-400/20 bg-white/5 text-slate-200/80";

  const label = tone === "danger" ? "Danger" : tone === "warning" ? "Warning" : "Info";

  return <span className={`inline-flex items-center h-6 px-2 rounded-full border text-xs font-bold ${cls}`}>{label}</span>;
}

export default function Notification({
  theme = "audit",
  auditType = "audit",
  auditId = null,
  onUnreadCountChange,
}: {
  theme?: PanelTheme;
  auditType?: "audit" | "iaf";
  auditId?: string | null;
  onUnreadCountChange?: (n: number) => void;
}) {
  const t = themeTokens(theme);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [items, setItems] = useState<AuditNotificationRow[]>([]);

  const refresh = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      let q = supabase
        .from("audit_notifications")
        .select("*")
        .eq("audit_type", auditType)
        .eq("dismissed", false)
        .order("created_at", { ascending: false });

      q = auditId === null ? q.is("audit_id", null) : q.eq("audit_id", auditId);

      const { data, error } = await q;
      if (error) throw error;

      const rows = (data ?? []) as AuditNotificationRow[];
      setItems(rows);

      const unreadCount = rows.reduce((acc, r) => acc + (r.unread ? 1 : 0), 0);
      onUnreadCountChange?.(unreadCount);
    } catch (e) {
      console.error("Notification refresh error:", e);
      setErrorMsg(e instanceof Error ? e.message : "Failed to load notifications");
      setItems([]);
      onUnreadCountChange?.(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auditType, auditId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((n) => `${n.title} ${n.description} ${n.time_label ?? ""}`.toLowerCase().includes(q));
  }, [items, query]);

  return (
    <div className="min-w-0 w-full space-y-4">
      <div className="min-w-0 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-slate-300/90 truncate">Notifications</div>
          <div className="text-sm font-extrabold text-slate-100 shrink-0">{items.length} items</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-black/30 border border-white/10 overflow-hidden">
          <div className={`h-full ${t.accentBar}`} style={{ width: "100%" }} />
        </div>
      </div>

      {/* Search + Refresh: wrap-safe */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 min-w-0">
        <div className="flex-1 relative min-w-0">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔎</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={[
              "h-10 w-full min-w-0 rounded-xl border border-white/10 bg-black/20 pl-10 pr-3 text-slate-100 placeholder:text-slate-600 outline-none",
              "focus:ring-2",
              t.focusRing,
            ].join(" ")}
            placeholder="Search notifications..."
          />
        </div>

        <button
          className="h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-extrabold text-slate-200 shrink-0"
          type="button"
          onClick={() => void refresh()}
        >
          ↻ Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2 min-w-0">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-slate-400">Loading...</div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-slate-400">
            No notifications found.
          </div>
        )}

        {!loading &&
          filtered.map((n) => (
            <div
              key={n.id}
              className="min-w-0 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3 min-w-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="font-extrabold text-slate-100 truncate">{n.title}</div>

                    {n.unread && (
                      <span className="inline-flex items-center h-6 px-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-200 text-xs font-black shrink-0">
                        New
                      </span>
                    )}

                    {n.action_needed && (
                      <span className="inline-flex items-center h-6 px-2 rounded-full border border-rose-400/25 bg-rose-400/10 text-rose-200 text-xs font-black shrink-0">
                        Action
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-slate-300/80 mt-1 break-words">{n.description}</div>

                  <div className="text-xs text-slate-500 mt-2">{n.time_label ?? formatDateTime(n.created_at)}</div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  {tonePill(n.tone)}
                  <div className={`h-10 w-10 rounded-xl grid place-items-center border ${t.tileBg}`}>🔔</div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}