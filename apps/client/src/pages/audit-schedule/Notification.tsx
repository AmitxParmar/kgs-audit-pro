import React, { useMemo, useState } from "react";
import type { PanelTheme } from "./Document";

type NoticeTone = "danger" | "warning" | "info";

type Notice = {
  id: string;
  tone: NoticeTone;
  title: string;
  description: string;
  timeLabel: string;
  unread: boolean;
  actionNeeded: boolean;
};

type FilterKey = "all" | "unread" | "action";

function themeTokens(theme: PanelTheme) {
  if (theme === "audit") {
    return {
      accent: "text-blue-300",
      underline: "bg-blue-500",
      primaryBtn: "border-blue-400/25 bg-blue-400/10 text-blue-200 hover:bg-blue-400/15",
    };
  }
  return {
    accent: "text-amber-300",
    underline: "bg-[#F3A300]",
    primaryBtn: "border-sky-400/25 bg-sky-400/10 text-sky-200 hover:bg-sky-400/15",
  };
}

function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-9 px-4 rounded-full border text-sm font-semibold transition",
        active ? "border-white/15 bg-white/10 text-slate-100" : "border-white/10 bg-transparent text-slate-400 hover:bg-white/5",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ToneDot({ tone }: { tone: NoticeTone }) {
  const cls = tone === "danger" ? "bg-rose-400" : tone === "warning" ? "bg-amber-400" : "bg-sky-400";
  return <span className={`h-2.5 w-2.5 rounded-full ${cls}`} />;
}

function ToneIconTile({ tone }: { tone: NoticeTone }) {
  const tile =
    tone === "danger"
      ? "bg-[#2A161A] border-rose-400/15"
      : tone === "warning"
        ? "bg-[#2A1C14] border-amber-400/15"
        : "bg-[#141F2A] border-sky-400/15";
  const icon = tone === "danger" ? "⚠" : tone === "warning" ? "📄" : "ℹ";
  return (
    <div className={`h-12 w-12 rounded-2xl border grid place-items-center ${tile}`}>
      <span className="text-slate-100/90">{icon}</span>
    </div>
  );
}

export default function Notification({ theme = "iaf" }: { theme?: PanelTheme }) {
  const t = themeTokens(theme);

  const [filter, setFilter] = useState<FilterKey>("all");

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "n1",
      tone: "danger",
      title: "Audit Plan not sent — 30-day deadline in 2 days",
      description:
        "The audit plan for Acme Motors Q2 must be sent to the auditee by Apr 8. Pre-audit checklist item still open.",
      timeLabel: "Today, 9:14 AM",
      unread: true,
      actionNeeded: true,
    },
    {
      id: "n2",
      tone: "warning",
      title: "QMS Manual not received from auditee",
      description:
        "Acme Motors has not submitted the QMS manual. Reminder was due 3 days ago (documentation request).",
      timeLabel: "Today, 8:02 AM",
      unread: true,
      actionNeeded: true,
    },
    {
      id: "n3",
      tone: "info",
      title: "Desk review scheduled",
      description: "Desk review has been scheduled for Apr 10. Assign reviewers and confirm time slots.",
      timeLabel: "Yesterday, 4:22 PM",
      unread: false,
      actionNeeded: false,
    },
  ]);

  const unreadCount = useMemo(() => notices.filter((n) => n.unread).length, [notices]);

  const filtered = useMemo(() => {
    if (filter === "unread") return notices.filter((n) => n.unread);
    if (filter === "action") return notices.filter((n) => n.actionNeeded);
    return notices;
  }, [filter, notices]);

  const markAllRead = () => {
    setNotices((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const markSent = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false, actionNeeded: false, tone: "info" } : n))
    );
  };

  const dismiss = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Filters row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            All
          </Chip>
          <Chip active={filter === "unread"} onClick={() => setFilter("unread")}>
            Unread
          </Chip>
          <Chip active={filter === "action"} onClick={() => setFilter("action")}>
            Action needed
          </Chip>
        </div>

        <button
          type="button"
          onClick={markAllRead}
          className="h-10 px-4 rounded-xl border border-white/15 bg-white/10 text-slate-100 font-semibold hover:bg-white/15 transition"
        >
          Mark all read {unreadCount > 0 ? `(${unreadCount})` : ""}
        </button>
      </div>

      <div className="pt-1 text-xs font-extrabold tracking-widest text-slate-500">TODAY</div>

      <div className="space-y-3">
        {filtered.map((n) => (
          <div
            key={n.id}
            className={[
              "rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] p-4",
              n.unread ? "ring-1 ring-white/10" : "",
            ].join(" ")}
          >
            <div className="flex items-start gap-4">
              <div className="pt-2">
                <ToneDot tone={n.tone} />
              </div>

              <ToneIconTile tone={n.tone} />

              <div className="min-w-0 flex-1">
                <div className="text-[15px] font-extrabold text-slate-100 leading-snug">
                  {n.title}{" "}
                  {n.unread && <span className={`ml-2 text-xs font-extrabold ${t.accent}`}>NEW</span>}
                </div>

                <div className="mt-2 text-sm text-slate-400 leading-relaxed">{n.description}</div>

                <div className="mt-3 text-xs text-slate-500">{n.timeLabel}</div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => markSent(n.id)}
                    className={`h-9 px-4 rounded-xl border font-semibold transition ${t.primaryBtn}`}
                  >
                    Mark sent
                  </button>
                  <button
                    type="button"
                    onClick={() => dismiss(n.id)}
                    className="h-9 px-4 rounded-xl border border-white/10 bg-transparent text-slate-400 font-semibold hover:bg-white/5 transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 h-px w-full bg-white/5">
              <div className={`h-px w-24 ${t.underline}`} />
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-slate-400">
            No notifications in this filter.
          </div>
        )}
      </div>
    </div>
  );
}