import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Document from "@/shared/components/dashboard/Document";
import Notification from "@/shared/components/dashboard/Notification";

import { useGroupedAudits, useAuditStats } from "./api/audit-reports-queries";
import { useUpdateAuditReportStatus } from "./api/audit-reports-mutation";
import { AUDIT_REPORT_STATUS_MAP } from "./components/StatusBubble";
import {
  NewAuditReportDialog,
  SearchBar,
  ReportStatusRow,
  StatCard,
  StageFilterCard,
} from "./components";
import {
  IconCalendar,
  IconWarning,
  IconClock,
  IconUsers,
  IconTrending,
  IconDoc,
  IconCheck,
  IconX,
} from "./components/AuditIcons";
import {
  AuditReport,
  AuditReportStatusEnum,
  countByStage,
  STAGE_LABELS,
  STAGE_ORDER,
  transformAudit,
  type RightPanelTab,
  type StageKey,
} from "./utils";

/* ── Page ─────────────────────────────────────────────────────────────── */
export default function AuditReports() {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQ = searchParams.get("q") || "";
  const stageFilter = searchParams.get("stage") || "all"; // maps to audit_report_status enum or "all"
  const activeStage = (searchParams.get("activeStage") as StageKey) || "all"; // card filter

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "all") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const [searchInput, setSearchInput] = useState(searchQ);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchInput === searchQ) return;
      updateParam("q", searchInput);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>("documents");
  const [notificationsCount, setNotificationsCount] = useState(3);

  const {
    data: groupedData,
    isLoading,
    isError,
  } = useGroupedAudits({
    search: searchQ,
    audit_report_status: stageFilter === "all" ? undefined : stageFilter,
  });
  const { data: stats } = useAuditStats();
  const updateStatus = useUpdateAuditReportStatus();

  /* Process Data */
  const allReports = useMemo(() => {
    if (!groupedData) return [];
    return Object.values(groupedData).flat().map(transformAudit);
  }, [groupedData]);

  /* Derived stat counts from audit_report_status */
  const totalCases = allReports.length;
  const openNCs = stats?.nc_update || 0;
  const slaAtRisk = (stats?.draft_report || 0) + (stats?.technical_review || 0);
  const pendingCert = stats?.iatf_update || 0;

  /* Client-side filter by active stage card */
  const filteredReports = allReports.filter((r) => {
    const q = searchQ.trim().toLowerCase();
    const matchesSearch =
      !q ||
      r.companyName.toLowerCase().includes(q) ||
      r.auditor.toLowerCase().includes(q);

    const matchesStage =
      activeStage === "all" || r.auditReportStatus === activeStage;

    return matchesSearch && matchesStage;
  });

  /* Group filtered reports by audit_report_status for section headers */
  const grouped = useMemo(() => {
    const map: Record<string, AuditReport[]> = {};
    for (const r of filteredReports) {
      const key = r.auditReportStatus ?? "unset";
      (map[key] ??= []).push(r);
    }
    // Sort by STAGE_ORDER so sections render in workflow sequence
    return STAGE_ORDER
      .map((stageEnum) => ({ key: stageEnum, reports: map[stageEnum] ?? [] }))
      .filter(({ reports }) => reports.length > 0);
  }, [filteredReports]);

  const headerTab = (t: RightPanelTab, label: string, icon: string, badge?: number) => {
    const isActive = rightPanelTab === t;
    return (
      <button
        type="button"
        onClick={() => setRightPanelTab(t)}
        className={[
          "h-12 px-5 rounded-2xl transition text-sm font-extrabold flex items-center gap-2",
          isActive ? "text-blue-300" : "text-slate-500 hover:text-slate-300",
        ].join(" ")}
      >
        <span className={isActive ? "opacity-100" : "opacity-80"}>{icon}</span>
        <span>{label}</span>
        {typeof badge === "number" && badge > 0 && (
          <span className="ml-1 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-black">
            {badge}
          </span>
        )}
      </button>
    );
  };

  const RightPanelContent = () => (
    <div className="flex-1 min-w-0 flex flex-col">
      <div className="px-6 pt-5 pb-2 border-b border-white/10 bg-black/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {headerTab("documents", "Documents", "▦")}
            {headerTab("alerts", "Alerts", "🔔", notificationsCount)}
          </div>
          <button
            className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grid place-items-center text-slate-300"
            onClick={() => setRightPanelOpen(false)}
            aria-label="Close panel"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="mt-3 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
          <div
            className={[
              "h-full w-1/2 bg-blue-500 transition-transform duration-300",
              rightPanelTab === "documents" ? "translate-x-0" : "translate-x-full",
            ].join(" ")}
          />
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto px-6 py-5">
        {rightPanelTab === "documents" ? (
          <Document theme="audit" auditType="audit" auditId={null} />
        ) : (
          <Notification
            theme="audit"
            auditType="audit"
            auditId={null}
            onUnreadCountChange={setNotificationsCount}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#0B1220] text-slate-200">
      <div className="flex overflow-hidden">
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-5 border-b border-white/10 bg-[#0B1220]/80 backdrop-blur-md shrink-0">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="text-sm text-slate-400">Audit Reports</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="h-9 px-3 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-semibold"
                type="button"
                onClick={() => {
                  setRightPanelTab("documents");
                  setRightPanelOpen((v) => (rightPanelTab === "documents" ? !v : true));
                }}
              >
                <span className="mr-1.5">📄</span>Documents
              </button>
              <button
                className="h-9 px-3 rounded-full border border-blue-500/30 bg-blue-500/15 hover:bg-blue-500/20 transition text-sm font-extrabold text-blue-100 relative"
                type="button"
                onClick={() => {
                  setRightPanelTab("alerts");
                  setRightPanelOpen((v) => (rightPanelTab === "alerts" ? !v : true));
                }}
              >
                <span className="mr-1.5">🔔</span>Alerts
                {notificationsCount > 0 && (
                  <span className="ml-1.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {notificationsCount}
                  </span>
                )}
              </button>
              <NewAuditReportDialog />
            </div>
          </header>

          {/* Page content */}
          <section className="px-5 py-5 space-y-5">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100">
                Audit Workflow Dashboard
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Track audit cases through{" "}
                <span className="text-slate-300">Reporting</span>,{" "}
                <span className="text-slate-300">NC Management</span>, and{" "}
                <span className="text-teal-400">Certification</span> stages
              </p>
            </div>

            {/* ── Row 1: Top stat cards ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Active Cases"
                value={totalCases}
                icon={<IconCalendar />}
                tone="default"
              />
              <StatCard
                label="Open NCs"
                value={openNCs}
                icon={<IconWarning />}
                tone="warning"
              />
              <StatCard
                label="SLA At Risk"
                value={slaAtRisk}
                icon={<IconClock />}
                tone="danger"
              />
              <StatCard
                label="Pending Certification"
                value={pendingCert}
                icon={<IconUsers />}
                tone="info"
              />
            </div>

            {/* ── Row 2: Stage filter cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StageFilterCard
                label="All Cases"
                count={countByStage(allReports, "all")}
                icon={<IconTrending />}
                active={activeStage === "all"}
                onClick={() => updateParam("activeStage", "all")}
              />
              <StageFilterCard
                label="Draft Report"
                count={countByStage(allReports, "draft_report")}
                icon={<IconDoc />}
                active={activeStage === "draft_report"}
                onClick={() => updateParam("activeStage", "draft_report")}
              />
              <StageFilterCard
                label="Tech Review"
                count={countByStage(allReports, "technical_review")}
                icon={<IconCheck />}
                active={activeStage === "technical_review"}
                onClick={() => updateParam("activeStage", "technical_review")}
              />
              <StageFilterCard
                label="IATF Update"
                count={countByStage(allReports, "iatf_update")}
                icon={<IconDoc />}
                active={activeStage === "iatf_update"}
                onClick={() => updateParam("activeStage", "iatf_update")}
              />
              <StageFilterCard
                label="NC Management"
                count={countByStage(allReports, "nc_update")}
                icon={<IconClock />}
                active={activeStage === "nc_update"}
                onClick={() => updateParam("activeStage", "nc_update")}
              />
              <StageFilterCard
                label="Certification"
                count={countByStage(allReports, "certification_update")}
                icon={<IconUsers />}
                active={activeStage === "certification_update"}
                onClick={() => updateParam("activeStage", "certification_update")}
              />
            </div>

            {/* ── Search bar ── */}
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              status={stageFilter}
              onStatusChange={(v) => updateParam("stage", v)}
              onReset={() => {
                setSearchInput("");
                setSearchParams(new URLSearchParams());
              }}
            />

            {/* ── Grouped report list ── */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-10 w-10 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium animate-pulse">
                  Loading audit data...
                </p>
              </div>
            ) : isError ? (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-8 text-center">
                <p className="text-rose-300 text-sm">
                  Failed to load audit reports. Please try again later.
                </p>
              </div>
            ) : grouped.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-8 text-center text-slate-500">
                <p className="text-sm">No audit reports match your filters.</p>
              </div>
            ) : (
              grouped.map(({ key, reports }) => {
                const statusMeta = AUDIT_REPORT_STATUS_MAP[key as AuditReportStatusEnum];
                return (
                  <div key={key} className="space-y-3">
                    {/* Section header badge */}
                    <div
                      className={`rounded-xl border px-4 py-2.5 text-sm font-bold text-center ${
                        statusMeta?.className ?? "bg-white/5 border-white/10 text-slate-400"
                      }`}
                    >
                      {statusMeta?.label ?? key}
                    </div>
                    {reports.map((report) => (
                      <ReportStatusRow
                        key={report.id}
                        companyName={report.companyName}
                        auditSubType={report.auditSubType}
                        auditor={report.auditor}
                        date={report.date}
                        workflowSteps={report.workflowSteps}
                        auditReportStatus={report.auditReportStatus}
                        onStepClick={(stage) =>
                          updateStatus.mutate({ id: report.id, audit_report_status: stage })
                        }
                      />
                    ))}
                  </div>
                );
              })
            )}
          </section>
        </main>

        {/* ── MOBILE drawer overlay ── */}
        {rightPanelOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 z-[69] bg-black/60 backdrop-blur-[2px]"
              onClick={() => setRightPanelOpen(false)}
            />
            <aside className="lg:hidden fixed inset-y-0 right-0 z-[70] flex flex-col w-[92vw] max-w-[520px] bg-[#0B1220] border-l border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.65)] overflow-hidden">
              <RightPanelContent />
            </aside>
          </>
        )}

        {/* ── DESKTOP docked panel ── */}
        {rightPanelOpen && (
          <aside className="hidden lg:flex w-[420px] xl:w-[480px] shrink-0 border-l border-white/10 bg-[#0B1220] overflow-hidden">
            <RightPanelContent />
          </aside>
        )}
      </div>
    </div>
  );
}