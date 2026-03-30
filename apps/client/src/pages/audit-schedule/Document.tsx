import React, { useEffect, useMemo, useRef, useState } from "react";

export type PanelTheme = "audit" | "iaf";

type DocStatus = "Uploaded" | "Missing";

type StoredDocMeta = {
  id: string;
  name: string;
  size: number;
  uploadedAt: string; // ISO
  status: DocStatus;
};

type RuntimeDoc = StoredDocMeta & {
  file?: File; // only during this session
};

function themeTokens(theme: PanelTheme) {
  if (theme === "audit") {
    return {
      accentBar: "bg-blue-500",
      accentBtn: "border-blue-500/30 bg-blue-500/15 hover:bg-blue-500/20 text-blue-100",
      tileBg: "bg-[#0F1B2E] border-white/10",
      focusRing: "focus:border-blue-500/30 focus:ring-blue-500/10",
    };
  }
  return {
    accentBar: "bg-[#F3A300]",
    accentBtn: "border-amber-500/30 bg-amber-500/20 hover:bg-amber-500/25 text-amber-100",
    tileBg: "bg-[#2A1C14] border-white/10",
    focusRing: "focus:border-amber-500/30 focus:ring-amber-500/10",
  };
}

const LS_KEY = "kgs.documents.v1";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function Document({ theme = "iaf" }: { theme?: PanelTheme }) {
  const t = themeTokens(theme);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [docs, setDocs] = useState<RuntimeDoc[]>(() => {
    // seed with 1 uploaded + 2 missing like your UI
    const seed: RuntimeDoc[] = [
      {
        id: "seed-1",
        name: "Audit Notification Letter.pdf",
        size: 128 * 1024,
        uploadedAt: new Date("2026-04-02T10:00:00Z").toISOString(),
        status: "Uploaded",
      },
      {
        id: "seed-2",
        name: "IAF MD4 §5 documented procedures.pdf",
        size: 0,
        uploadedAt: new Date().toISOString(),
        status: "Missing",
      },
      {
        id: "seed-3",
        name: "CAB competence records.xlsx",
        size: 0,
        uploadedAt: new Date().toISOString(),
        status: "Missing",
      },
    ];

    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return seed;
      const stored = JSON.parse(raw) as StoredDocMeta[];
      // merge: stored first, then any seed missing not present
      const storedIds = new Set(stored.map((s) => s.id));
      const merged: RuntimeDoc[] = [...stored.map((s) => ({ ...s })), ...seed.filter((s) => !storedIds.has(s.id))];
      return merged;
    } catch {
      return seed;
    }
  });

  // Persist metadata only
  useEffect(() => {
    const toStore: StoredDocMeta[] = docs.map(({ file, ...meta }) => meta);
    localStorage.setItem(LS_KEY, JSON.stringify(toStore));
  }, [docs]);

  const uploadedCount = useMemo(() => docs.filter((d) => d.status === "Uploaded").length, [docs]);
  const totalCount = useMemo(() => docs.length, [docs]);
  const pct = totalCount === 0 ? 0 : Math.round((uploadedCount / totalCount) * 100);

  const filteredDocs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter((d) => d.name.toLowerCase().includes(q));
  }, [docs, query]);

  const handleFiles = (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setDocs((prev) => {
      const next = [...prev];

      for (const f of list) {
        next.unshift({
          id: uid(),
          name: f.name,
          size: f.size,
          uploadedAt: new Date().toISOString(),
          status: "Uploaded",
          file: f,
        });
      }

      return next;
    });
  };

  const onPickUpload = () => inputRef.current?.click();

  const onView = (doc: RuntimeDoc) => {
    if (!doc.file) {
      alert("This file is from a previous session. Re-upload to view again (or use IndexedDB/back-end storage).");
      return;
    }
    const url = URL.createObjectURL(doc.file);
    window.open(url, "_blank", "noopener,noreferrer");
    // do not revoke immediately; the new tab might need it
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const onDownload = (doc: RuntimeDoc) => {
    if (!doc.file) {
      alert("This file is from a previous session. Re-upload to download again (or use IndexedDB/back-end storage).");
      return;
    }
    const url = URL.createObjectURL(doc.file);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30_000);
  };

  return (
    <div className="space-y-4">
      {/* hidden file input */}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files);
          e.currentTarget.value = ""; // allow re-upload same file
        }}
      />

      {/* readiness */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-300/90">Document Readiness</div>
          <div className="text-sm font-extrabold text-slate-100">
            {uploadedCount} <span className="text-slate-400 font-bold">/ {totalCount} uploaded</span>
          </div>
        </div>

        <div className="mt-3 h-2 rounded-full bg-black/30 border border-white/10 overflow-hidden">
          <div className={`h-full ${t.accentBar}`} style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* search + upload */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔎</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={[
              "h-10 w-full rounded-xl border border-white/10 bg-black/20 pl-10 pr-3 text-slate-100 placeholder:text-slate-600 outline-none",
              "focus:ring-2",
              t.focusRing,
            ].join(" ")}
            placeholder="Search documents..."
          />
        </div>

        <button
          className={`h-10 px-4 rounded-xl border transition font-extrabold ${t.accentBtn}`}
          type="button"
          onClick={onPickUpload}
        >
          ⤴ Upload
        </button>
      </div>

      {/* drop */}
      <div
        className={[
          "rounded-2xl border border-dashed bg-black/10 px-6 py-10 text-center transition",
          dragOver ? "border-white/30 bg-white/5" : "border-white/15",
        ].join(" ")}
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragOver(false);
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        onClick={onPickUpload}
        role="button"
        tabIndex={0}
      >
        <div className="text-3xl text-slate-400">📎</div>
        <div className="mt-3 font-semibold text-slate-300/90">Drop files here or click to browse</div>
        <div className="mt-1 text-xs text-slate-500">PDF, DOCX, XLSX, PNG · Max 25 MB each</div>
      </div>

      {/* list */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-extrabold tracking-widest text-slate-500">DOCUMENTS</div>
          <div className="text-xs text-slate-500">
            <span className="inline-flex items-center h-6 px-2 rounded-full border border-white/10 bg-white/5">
              Showing {filteredDocs.length} of {docs.length}
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {filteredDocs.map((d) => (
            <div
              key={d.id}
              className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-4 py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={`h-11 w-11 rounded-xl grid place-items-center border ${t.tileBg}`}>📄</div>

                <div className="min-w-0">
                  <div className="font-bold text-slate-100 truncate">{d.name}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {d.status === "Uploaded"
                      ? `Uploaded · ${formatDateTime(d.uploadedAt)} · ${formatBytes(d.size)}`
                      : "Not uploaded yet"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={[
                    "inline-flex items-center h-6 px-2 rounded-full border text-xs font-extrabold",
                    d.status === "Uploaded"
                      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                      : "border-slate-400/20 bg-white/5 text-slate-300/80",
                  ].join(" ")}
                >
                  {d.status}
                </span>

                <button
                  className="h-8 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-xs font-bold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed"
                  type="button"
                  onClick={() => onView(d)}
                  disabled={d.status !== "Uploaded"}
                >
                  View
                </button>

                <button
                  className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grid place-items-center text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  type="button"
                  aria-label="Download"
                  title="Download"
                  onClick={() => onDownload(d)}
                  disabled={d.status !== "Uploaded"}
                >
                  ↓
                </button>
              </div>
            </div>
          ))}

          {filteredDocs.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-slate-400">
              No documents match your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}