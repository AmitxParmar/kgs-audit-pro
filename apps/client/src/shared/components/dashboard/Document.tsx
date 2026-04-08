import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

export type PanelTheme = "audit" | "iaf";

type DocRow = {
  id: string;
  created_at: string;

  audit_type: "audit" | "iaf";
  audit_id: string | null;

  file_name: string;
  content_type: string | null;
  size_bytes: number;

  bucket: string;
  storage_path: string;

  deleted: boolean;
};

async function raceTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: number | undefined;

  const timeout = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) window.clearTimeout(timeoutId);
  }
}

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

function formatBytes(bytes: number) {
  if (!bytes) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
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

function safeFileName(name: string) {
  return name.replace(/[^\w.\- ()]+/g, "_");
}

export default function Document({
  theme = "audit",
  auditType = "audit",
  auditId = null,
}: {
  theme?: PanelTheme;
  auditType?: "audit" | "iaf";
  auditId?: string | null;
}) {
  const t = themeTokens(theme);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [query, setQuery] = useState("");
  const [dragOver, setDragOver] = useState(false);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [docs, setDocs] = useState<DocRow[]>([]);

  const refresh = async () => {
    setErrorMsg("");
    setLoading(true);
    try {
      let q = supabase
        .from("audit_documents")
        .select("*")
        .eq("audit_type", auditType)
        .eq("deleted", false)
        .order("created_at", { ascending: false });

      q = auditId === null ? q.is("audit_id", null) : q.eq("audit_id", auditId);

      const { data, error } = await raceTimeout(q, 15000, "Document refresh");
      if (error) throw error;

      setDocs((data ?? []) as DocRow[]);
    } catch (e) {
      console.error("Document refresh error:", e);
      setErrorMsg(e instanceof Error ? e.message : "Failed to load documents");
      setDocs([]);
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
    if (!q) return docs;
    return docs.filter((d) => d.file_name.toLowerCase().includes(q));
  }, [docs, query]);

  const pickUpload = () => inputRef.current?.click();

  const uploadFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;

    setUploading(true);
    setErrorMsg("");

    try {
      for (const file of list) {
        const fileName = safeFileName(file.name);

        console.time(`upload:${fileName}:insert`);
        const { data: inserted, error: insertErr } = await raceTimeout(
          supabase
            .from("audit_documents")
            .insert({
              audit_type: auditType,
              audit_id: auditId,
              file_name: fileName,
              content_type: file.type || null,
              size_bytes: file.size,
              bucket: "audit-documents",
              storage_path: "pending",
              deleted: false,
            })
            .select("*")
            .single(),
          15000,
          "DB insert"
        );
        console.timeEnd(`upload:${fileName}:insert`);

        if (insertErr || !inserted) throw new Error(insertErr?.message ?? "Failed to insert document row");

        const storagePath = `public/${auditType}/${auditId ?? "global"}/${inserted.id}/${fileName}`;

        console.time(`upload:${fileName}:storage`);
        const uploadRes = await raceTimeout(
          supabase.storage.from("audit-documents").upload(storagePath, file, {
            contentType: file.type || undefined,
            upsert: true,
          }),
          60000,
          "Storage upload"
        );
        console.timeEnd(`upload:${fileName}:storage`);

        if (uploadRes.error) throw new Error(uploadRes.error.message);

        console.time(`upload:${fileName}:update`);
        const { error: updErr } = await raceTimeout(
          supabase.from("audit_documents").update({ storage_path: storagePath }).eq("id", inserted.id),
          15000,
          "DB update"
        );
        console.timeEnd(`upload:${fileName}:update`);

        if (updErr) throw new Error(updErr.message);
      }

      await refresh();
    } catch (e) {
      console.error("uploadFiles error:", e);
      setErrorMsg(e instanceof Error ? e.message : "Upload failed");
      await refresh();
    } finally {
      setUploading(false);
    }
  };

  const openPublicUrl = (doc: DocRow, download: boolean) => {
    setErrorMsg("");

    if (!doc.storage_path || doc.storage_path === "pending") {
      setErrorMsg("File not ready yet.");
      return;
    }

    const { data } = supabase.storage.from(doc.bucket).getPublicUrl(doc.storage_path);
    const url = data.publicUrl;

    if (!url) {
      setErrorMsg("Could not resolve public URL.");
      return;
    }

    if (download) {
      const a = document.createElement("a");
      a.href = url;
      a.download = doc.file_name;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } else {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        onChange={(e) => {
          if (e.target.files) void uploadFiles(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.03] p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-slate-300/90">Documents</div>
          <div className="text-sm font-extrabold text-slate-100">{docs.length} items</div>
        </div>
        <div className="mt-3 h-2 rounded-full bg-black/30 border border-white/10 overflow-hidden">
          <div className={`h-full ${t.accentBar}`} style={{ width: "100%" }} />
        </div>
      </div>

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
          className={`h-10 px-4 rounded-xl border transition font-extrabold ${t.accentBtn} disabled:opacity-50`}
          type="button"
          onClick={pickUpload}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "⤴ Upload"}
        </button>
      </div>

      {errorMsg && (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">
          {errorMsg}
        </div>
      )}

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
          if (e.dataTransfer.files) void uploadFiles(e.dataTransfer.files);
        }}
        onClick={pickUpload}
        role="button"
        tabIndex={0}
      >
        <div className="text-3xl text-slate-400">📎</div>
        <div className="mt-3 font-semibold text-slate-300/90">Drop files here or click to browse</div>
        <div className="mt-1 text-xs text-slate-500">Supabase Storage bucket must exist: audit-documents</div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-extrabold tracking-widest text-slate-500">FILES</div>
          <div className="text-xs text-slate-500">
            <span className="inline-flex items-center h-6 px-2 rounded-full border border-white/10 bg-white/5">
              {loading ? "Loading..." : `Showing ${filtered.length} of ${docs.length}`}
            </span>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {!loading &&
            filtered.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] px-4 py-3 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`h-11 w-11 rounded-xl grid place-items-center border ${t.tileBg}`}>📄</div>
                  <div className="min-w-0">
                    <div className="font-bold text-slate-100 truncate">{d.file_name}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {formatDateTime(d.created_at)} · {formatBytes(d.size_bytes)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    className="h-8 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-xs font-bold text-slate-200"
                    type="button"
                    onClick={() => openPublicUrl(d, false)}
                  >
                    View
                  </button>
                  <button
                    className="h-8 w-8 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grid place-items-center text-slate-300"
                    type="button"
                    onClick={() => openPublicUrl(d, true)}
                    aria-label="Download"
                    title="Download"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}

          {!loading && filtered.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-slate-400">
              No documents found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}