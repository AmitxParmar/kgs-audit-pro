import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import KgsSidebar from "./KGSSidebar";
import Document, { type PanelTheme } from "./Document";
import Notification from "./Notification";

type CollapsedSections = { details: boolean; scope: boolean; team: boolean; checklist: boolean };

type TeamTone = "blue" | "teal" | "slate";

type TeamMember = {
  name: string;
  role: string;
  qualification: string;
  assignedProcess: string;
  badgeTone: TeamTone;
};

type ChecklistItem = {
  label: string;
  checked: boolean;
  status: "Done" | "Required" | "Optional";
};

const steps = ["Audit Planning", "Audit Execution", "NC Management", "Reporting"] as const;
type StepKey = (typeof steps)[number];

type FormState = {
  customer: string;
  auditType: string;
  site: string;
  plannedStart: string;
  plannedEnd: string;
  standardVersion: string;
  certificationBody: string;
  scopeOfCertification: string;
  csr: string;
  excludedClauses: string;
};

type MemberDraft = {
  name: string;
  role: string;
  qualification: string;
  assignedProcess: string;
};

type MemberErrors = Partial<Record<keyof MemberDraft, string>>;

type RightPanelTab = "documents" | "notifications";

export default function AuditSchedule() {
  const navigate = useNavigate();
  const theme: PanelTheme = "audit";

  const [activeStep, setActiveStep] = useState<StepKey>("Audit Planning");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [collapsed, setCollapsed] = useState<CollapsedSections>({
    details: false,
    scope: false,
    team: false,
    checklist: false,
  });

  // Right panel (desktop docked + mobile overlay)
  const [rightPanelOpen, setRightPanelOpen] = useState(false); // ✅ closed by default
  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>("documents");
  const notificationsCount = 0;

  const [form, setForm] = useState<FormState>({
    customer: "Acme Motors Q2",
    auditType: "Customer Audit",
    site: "Test Site 1",
    plannedStart: "2026-06-15",
    plannedEnd: "2026-06-17",
    standardVersion: "IATF 16949:2016",
    certificationBody: "KGS Certification Pvt Ltd",
    scopeOfCertification: "Design, manufacture and supply of automotive components for passenger vehicles",
    csr: "BMW Group CSR",
    excludedClauses: "",
  });

  const [team, setTeam] = useState<TeamMember[]>([
    {
      name: "Rajesh Kumar",
      role: "Lead Auditor",
      qualification: "IATF Certified LA",
      assignedProcess: "All processes",
      badgeTone: "blue",
    },
    {
      name: "Meena Pillai",
      role: "Auditor",
      qualification: "ISO 9001 LA",
      assignedProcess: "Production, QMS",
      badgeTone: "slate",
    },
    {
      name: "Arjun Sharma",
      role: "Technical Expert",
      qualification: "Automotive Eng.",
      assignedProcess: "Manufacturing process",
      badgeTone: "teal",
    },
  ]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { label: "90-day advance notice sent to client", checked: true, status: "Done" },
    { label: "Previous audit report reviewed", checked: true, status: "Done" },
    { label: "CSR documents obtained", checked: true, status: "Done" },
    { label: "Audit plan sent to auditee (30 days prior)", checked: false, status: "Required" },
    { label: "QMS manual & procedures requested", checked: false, status: "Required" },
    { label: "FMEA & control plan samples obtained", checked: false, status: "Optional" },
  ]);

  const [autoSavedAt, setAutoSavedAt] = useState<Date>(new Date());

  const breadcrumbs = useMemo(
    () => ["Dashboard", "Audits", "IATF 16949", "Acme Motors Q2", "Audit Planning"],
    []
  );

  const updateForm = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    setAutoSavedAt(new Date());
  };

  const formatTime = (d: Date) => {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  };

  const toggleChecklist = (idx: number) => {
    setChecklist((prev) => {
      const next = [...prev];
      const item = next[idx];
      if (!item) return prev;

      const wasDone = item.status === "Done";
      const checked = !item.checked;
      const status: ChecklistItem["status"] = checked ? "Done" : wasDone ? "Required" : item.status;

      next[idx] = { ...item, checked, status };
      return next;
    });
    setAutoSavedAt(new Date());
  };

  // -------- Add Team Member modal state --------
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberDraft, setMemberDraft] = useState<MemberDraft>({
    name: "",
    role: "Auditor",
    qualification: "",
    assignedProcess: "",
  });
  const [memberErrors, setMemberErrors] = useState<MemberErrors>({});

  const openAddMember = () => {
    setMemberDraft({ name: "", role: "Auditor", qualification: "", assignedProcess: "" });
    setMemberErrors({});
    setAddMemberOpen(true);
  };
  const closeAddMember = () => setAddMemberOpen(false);

  const saveMember = () => {
    const errs: MemberErrors = {};
    if (!memberDraft.name.trim()) errs.name = "Name is required";
    if (!memberDraft.role.trim()) errs.role = "Role is required";
    if (!memberDraft.qualification.trim()) errs.qualification = "Qualification is required";
    if (!memberDraft.assignedProcess.trim()) errs.assignedProcess = "Assigned process is required";

    setMemberErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const tone: TeamTone =
      memberDraft.role === "Lead Auditor" ? "blue" : memberDraft.role === "Technical Expert" ? "teal" : "slate";

    setTeam((p) => [
      ...p,
      {
        name: memberDraft.name.trim(),
        role: memberDraft.role.trim(),
        qualification: memberDraft.qualification.trim(),
        assignedProcess: memberDraft.assignedProcess.trim(),
        badgeTone: tone,
      },
    ]);
    setAutoSavedAt(new Date());
    setAddMemberOpen(false);
  };

  // Right panel controls
  const openDocs = () => {
    setRightPanelTab("documents");
    setRightPanelOpen(true);
  };
  const openNotifs = () => {
    setRightPanelTab("notifications");
    setRightPanelOpen(true);
  };
  const closeRightPanel = () => setRightPanelOpen(false);

  const activeTabText = "text-blue-300";
  const underlineCls = "bg-blue-500";

  const headerTab = (t: RightPanelTab, label: string, icon: string, badge?: number) => {
    const active = rightPanelTab === t;
    return (
      <button
        type="button"
        onClick={() => setRightPanelTab(t)}
        className={[
          "h-12 px-4 rounded-2xl transition text-sm font-extrabold flex items-center gap-2",
          active ? activeTabText : "text-slate-500 hover:text-slate-300",
        ].join(" ")}
      >
        <span className={active ? "opacity-100" : "opacity-80"}>{icon}</span>
        <span>{label}</span>
        {typeof badge === "number" && badge > 0 && (
          <span className="ml-1 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-black">
            {badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <div className="h-screen w-full bg-[#0B1220] text-slate-200 flex overflow-hidden">
      {/* Match image: darker base, softer input contrast */}
      <style>{`
        .kgs-field {
          color: rgb(226 232 240) !important;
          background-color: rgba(0,0,0,0.22) !important;
          caret-color: rgb(226 232 240) !important;
        }
        .kgs-field:focus {
          background-color: rgba(0,0,0,0.28) !important;
        }
        input.kgs-field:-webkit-autofill,
        textarea.kgs-field:-webkit-autofill,
        select.kgs-field:-webkit-autofill {
          -webkit-text-fill-color: rgb(226 232 240) !important;
          box-shadow: 0 0 0px 1000px rgba(0,0,0,0.28) inset !important;
          transition: background-color 999999s ease-out 0s;
          caret-color: rgb(226 232 240) !important;
        }
        input.kgs-field[type="date"] { color-scheme: dark; }
      `}</style>

      <KgsSidebar
        sidebarCollapsed={sidebarCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* MAIN + RIGHT PANEL WRAPPER */}
      <div className="flex-1 min-w-0 flex overflow-hidden">
        {/* Main */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Topbar */}
          <header className="h-14 shrink-0 flex items-center justify-between px-4 lg:px-5 border-b border-white/10 bg-black/20 backdrop-blur">
            <div className="flex items-center gap-2 min-w-0">
              <button
                className="lg:hidden h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grid place-items-center"
                onClick={() => setMobileSidebarOpen(true)}
                aria-label="Open sidebar"
                type="button"
              >
                ☰
              </button>

              {/* ✅ Sidebar minimize button (like IAF) */}
              <button
                className="hidden lg:grid h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition place-items-center"
                onClick={() => setSidebarCollapsed((v) => !v)}
                aria-label="Toggle sidebar collapse"
                title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                type="button"
              >
                {sidebarCollapsed ? "»" : "«"}
              </button>

              <div className="text-sm text-slate-400/90 truncate">
                {breadcrumbs.map((b, idx) => (
                  <span key={b} className="whitespace-nowrap">
                    {b}
                    {idx < breadcrumbs.length - 1 && <span className="mx-2 text-slate-600">›</span>}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="h-9 px-4 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm font-semibold text-slate-200/90"
                type="button"
                onClick={openDocs}
              >
                <span className="mr-2 opacity-80">▦</span>Documents
              </button>

              <button
                className="h-9 px-4 rounded-full border border-blue-500/30 bg-blue-500/15 hover:bg-blue-500/20 transition text-sm font-extrabold text-blue-100"
                type="button"
                onClick={openNotifs}
              >
                <span className="mr-2 opacity-90">🔔</span>Alerts
                <span className="ml-2 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-rose-500/15 border border-rose-400/25 text-rose-200 text-xs font-black">
                  {notificationsCount}
                </span>
              </button>

              <div className="h-9 px-3 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-500" />
                <span className="font-extrabold text-sm">RK</span>
              </div>
            </div>
          </header>

          {/* Context row (switch) */}
          <section className="shrink-0 px-4 lg:px-5 py-3 border-b border-white/10 bg-black/10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-slate-500">Standard:</span>

              <div className="inline-flex rounded-xl border border-white/10 bg-black/20 overflow-hidden">
                <button
                  type="button"
                  className="h-9 px-4 text-sm font-extrabold bg-blue-500/15 text-blue-200 border-r border-white/10"
                  onClick={() => navigate("/audit-schedule")}
                  aria-current="page"
                >
                  IATF 16949
                </button>
                <button
                  type="button"
                  className="h-9 px-4 text-sm font-extrabold text-slate-400 hover:bg-white/5"
                  onClick={() => navigate("/iaf-schedule")}
                >
                  IAF MD4
                </button>
              </div>

              <span className="mx-1 h-4 w-px bg-white/10" />
              <span className="text-sm text-slate-400">
                Acme Motors Q2 <span className="text-slate-600">·</span> Customer Audit{" "}
                <span className="text-slate-600">·</span> Lead: Rajesh Kumar
              </span>
            </div>
          </section>

          {/* ✅ Stepper with thin connector line like IAF */}
          <section className="shrink-0 px-4 lg:px-5 pt-4 pb-3 border-b border-white/10 bg-black/10">
            <div className="flex flex-wrap items-center gap-3">
              {steps.map((s, i) => {
                const isActive = s === activeStep;
                const isCompleted = steps.indexOf(activeStep) > i;

                return (
                  <div key={s} className="flex items-center">
                    <button onClick={() => setActiveStep(s)} className="flex items-center gap-3" type="button">
                      <span
                        className={[
                          "h-8 w-8 rounded-full grid place-items-center text-xs font-black border",
                          isCompleted
                            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                            : isActive
                              ? "border-blue-400/30 bg-blue-500/20 text-blue-200"
                              : "border-white/10 bg-white/5 text-slate-500",
                        ].join(" ")}
                      >
                        {isCompleted ? "✓" : i + 1}
                      </span>

                      <span
                        className={["text-sm font-extrabold", isActive ? "text-slate-100" : "text-slate-500"].join(" ")}
                      >
                        {s}
                      </span>
                    </button>

                    {i < steps.length - 1 && <span className="mx-4 h-px w-14 bg-white/10" />}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Content */}
          <section className="flex-1 min-h-0 overflow-auto px-4 lg:px-5 pb-28 space-y-4 bg-gradient-to-b from-black/0 to-black/20">
            <Card
              title="Audit details"
              subtitle="Core identification & classification"
              icon="📋"
              collapsed={collapsed.details}
              onToggle={() => setCollapsed((p) => ({ ...p, details: !p.details }))}
              iconTone="slate"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Customer / auditee" required>
                  <Input value={form.customer} onChange={(v) => updateForm("customer", v)} />
                </Field>

                <Field label="Audit type" required>
                  <Select
                    value={form.auditType}
                    onChange={(v) => updateForm("auditType", v)}
                    options={["Customer Audit", "Internal Audit", "Supplier Audit"]}
                  />
                </Field>

                <Field label="Site / location" required>
                  <Input value={form.site} onChange={(v) => updateForm("site", v)} />
                </Field>

                <Field label="Planned start date">
                  <Input value={form.plannedStart} onChange={(v) => updateForm("plannedStart", v)} type="date" />
                </Field>

                <Field label="Planned end date">
                  <Input value={form.plannedEnd} onChange={(v) => updateForm("plannedEnd", v)} type="date" />
                </Field>

                <div className="hidden lg:block" />

                <Field label="Standard / version">
                  <Input value={form.standardVersion} onChange={(v) => updateForm("standardVersion", v)} />
                </Field>

                <Field label="Certification body">
                  <Input value={form.certificationBody} onChange={(v) => updateForm("certificationBody", v)} />
                </Field>
              </div>
            </Card>

            <Card
              title="Scope & criteria"
              subtitle="IATF clause applicability & CSR"
              icon="🎯"
              collapsed={collapsed.scope}
              onToggle={() => setCollapsed((p) => ({ ...p, scope: !p.scope }))}
              iconTone="slate"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Field label="Scope of certification">
                  <TextArea
                    value={form.scopeOfCertification}
                    onChange={(v) => updateForm("scopeOfCertification", v)}
                    rows={3}
                  />
                </Field>

                <Field label="Customer Specific Requirements (CSR)">
                  <Select
                    value={form.csr}
                    onChange={(v) => updateForm("csr", v)}
                    options={["BMW Group CSR", "Ford CSR", "GM CSR", "VW Group CSR"]}
                  />
                </Field>

                <div className="lg:col-span-2">
                  <Field label="Excluded clauses (with justification)">
                    <Input
                      value={form.excludedClauses}
                      onChange={(v) => updateForm("excludedClauses", v)}
                      placeholder="e.g. 8.3 Design & Development — excluded (no design responsibility)"
                    />
                  </Field>
                </div>
              </div>
            </Card>

            <Card
              title="Audit team"
              subtitle="Lead auditor, team & technical experts"
              icon="👥"
              collapsed={collapsed.team}
              onToggle={() => setCollapsed((p) => ({ ...p, team: !p.team }))}
              iconTone="purple"
            >
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-4 px-1 text-[11px] tracking-widest text-slate-500">
                  <div>NAME</div>
                  <div>ROLE</div>
                  <div>QUALIFICATION</div>
                  <div>ASSIGNED PROCESS</div>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/10 overflow-hidden">
                  {team.map((m, idx) => (
                    <div
                      key={`${m.name}-${idx}`}
                      className="grid grid-cols-4 gap-4 px-4 py-3 text-sm border-t border-white/10 first:border-t-0"
                    >
                      <div className="text-slate-200/90 font-semibold">{m.name}</div>
                      <div>
                        <RoleBadge tone={m.badgeTone}>{m.role}</RoleBadge>
                      </div>
                      <div className="text-slate-300/80">{m.qualification}</div>
                      <div className="text-slate-300/80">{m.assignedProcess}</div>
                    </div>
                  ))}
                </div>

                <button
                  className="h-10 px-4 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 transition text-sm font-semibold text-slate-300"
                  onClick={openAddMember}
                  type="button"
                >
                  + Add team member
                </button>
              </div>
            </Card>

            <Card
              title="Pre-audit checklist"
              subtitle="Confirm readiness before execution"
              icon="✅"
              collapsed={collapsed.checklist}
              onToggle={() => setCollapsed((p) => ({ ...p, checklist: !p.checklist }))}
              iconTone="green"
            >
              <div className="space-y-2">
                {checklist.map((item, idx) => (
                  <div
                    key={`${item.label}-${idx}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/10 px-4 py-3"
                  >
                    <label className="flex items-center gap-3 min-w-0 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleChecklist(idx)}
                        className="h-4 w-4 rounded border-white/20 bg-black/30 text-blue-500 focus:ring-blue-500/20"
                      />
                      <span
                        className={[
                          "text-sm truncate",
                          item.checked ? "text-slate-300/60 line-through" : "text-slate-200/90",
                        ].join(" ")}
                        title={item.label}
                      >
                        {item.label}
                      </span>
                    </label>

                    <StatusPill status={item.status} />
                  </div>
                ))}
              </div>
            </Card>
          </section>

          {/* Bottom bar */}
          <footer className="shrink-0 sticky bottom-0 border-t border-white/10 bg-black/30 backdrop-blur px-4 lg:px-5 py-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <button className="h-10 px-4 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 transition font-semibold text-slate-300" type="button">
                  ← Previous
                </button>

                <div className="h-10 px-3 rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-100 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="font-extrabold text-sm">Auto-saved</span>
                  <span className="text-sm text-emerald-100/70">{`at ${formatTime(autoSavedAt)}`}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button className="h-10 px-6 rounded-xl border border-white/10 bg-black/20 hover:bg-white/5 transition font-semibold text-slate-300" type="button">
                  Save draft
                </button>
                <button
                  className="h-10 px-6 rounded-xl border border-blue-500/30 bg-blue-500 hover:bg-blue-400 transition font-extrabold text-white shadow-[0_18px_45px_rgba(59,130,246,0.22)]"
                  type="button"
                  onClick={() => setActiveStep("Audit Execution")}
                >
                  Save &amp; proceed to Audit Execution →
                </button>
              </div>
            </div>
          </footer>
        </main>

        {/* Desktop: docked right panel */}
        {rightPanelOpen && (
          <aside className="hidden lg:flex w-[420px] xl:w-[480px] shrink-0 border-l border-white/10 bg-[#0B1220] overflow-hidden">
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="px-6 pt-5 pb-2 border-b border-white/10 bg-black/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {headerTab("documents", "Documents", "▦")}
                    {headerTab("notifications", "Notifications", "🔔", notificationsCount)}
                  </div>

                  <button
                    className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grid place-items-center text-slate-300"
                    onClick={closeRightPanel}
                    aria-label="Close panel"
                    type="button"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-3 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={[
                      "h-full w-1/2 transition-transform duration-300",
                      underlineCls,
                      rightPanelTab === "documents" ? "translate-x-0" : "translate-x-full",
                    ].join(" ")}
                  />
                </div>
              </div>

              <div className="flex-1 min-h-0 overflow-auto px-6 py-5">
                {rightPanelTab === "documents" ? <Document theme={theme} /> : <Notification theme={theme} />}
              </div>
            </div>
          </aside>
        )}

        {/* Mobile: overlay drawer */}
        <div className={["lg:hidden", rightPanelOpen ? "block" : "hidden"].join(" ")}>
          <div className="fixed inset-0 z-[80] bg-black/60" onClick={closeRightPanel} />
          <aside className="fixed top-0 right-0 z-[81] h-full w-[92vw] max-w-[520px] border-l border-white/10 bg-[#0B1220] shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
            <div className="flex h-full flex-col">
              <div className="px-5 pt-5 pb-2 border-b border-white/10 bg-black/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {headerTab("documents", "Documents", "▦")}
                    {headerTab("notifications", "Notifications", "🔔", notificationsCount)}
                  </div>

                  <button
                    className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grid place-items-center text-slate-300"
                    onClick={closeRightPanel}
                    aria-label="Close panel"
                    type="button"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-3 h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={[
                      "h-full w-1/2 transition-transform duration-300",
                      underlineCls,
                      rightPanelTab === "documents" ? "translate-x-0" : "translate-x-full",
                    ].join(" ")}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto px-5 py-5">
                {rightPanelTab === "documents" ? <Document theme={theme} /> : <Notification theme={theme} />}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Add team member modal */}
      {addMemberOpen && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-[2px]" onClick={closeAddMember} />
          <div className="fixed inset-0 z-[61] grid place-items-center p-4">
            <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-slate-950 shadow-[0_40px_120px_rgba(0,0,0,0.55)] overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 bg-white/5">
                <div>
                  <div className="font-extrabold">Add team member</div>
                  <div className="text-xs text-slate-400">All fields are required</div>
                </div>
                <button
                  className="h-9 w-9 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grid place-items-center"
                  onClick={closeAddMember}
                  aria-label="Close"
                  type="button"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <ModalField label="Name" error={memberErrors.name}>
                  <Input value={memberDraft.name} onChange={(v) => setMemberDraft((p) => ({ ...p, name: v }))} />
                </ModalField>

                <ModalField label="Role" error={memberErrors.role}>
                  <Select
                    value={memberDraft.role}
                    onChange={(v) => setMemberDraft((p) => ({ ...p, role: v }))}
                    options={["Lead Auditor", "Auditor", "Technical Expert"]}
                  />
                </ModalField>

                <ModalField label="Qualification" error={memberErrors.qualification}>
                  <Input
                    value={memberDraft.qualification}
                    onChange={(v) => setMemberDraft((p) => ({ ...p, qualification: v }))}
                  />
                </ModalField>

                <ModalField label="Assigned process" error={memberErrors.assignedProcess}>
                  <Input
                    value={memberDraft.assignedProcess}
                    onChange={(v) => setMemberDraft((p) => ({ ...p, assignedProcess: v }))}
                  />
                </ModalField>
              </div>

              <div className="px-5 py-4 border-t border-white/10 bg-white/[0.03] flex items-center justify-end gap-2">
                <button
                  className="h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-bold"
                  onClick={closeAddMember}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="h-10 px-4 rounded-xl border border-blue-500/30 bg-blue-600/20 hover:bg-blue-600/25 transition font-extrabold text-blue-100"
                  onClick={saveMember}
                  type="button"
                >
                  Add member
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------ Reusable UI ------------------------------ */

function Card(props: {
  title: string;
  subtitle?: string;
  icon?: string;
  collapsed?: boolean;
  onToggle?: () => void;
  iconTone?: "slate" | "purple" | "green";
  children: React.ReactNode;
}) {
  const { title, subtitle, icon, collapsed, onToggle, children, iconTone } = props;

  const iconCls =
    iconTone === "purple"
      ? "bg-purple-500/15 border-purple-500/25"
      : iconTone === "green"
        ? "bg-emerald-400/10 border-emerald-400/25"
        : "bg-white/5 border-white/10";

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.02] shadow-[0_25px_70px_rgba(0,0,0,0.35)] overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/10 bg-black/10">
        <div className="flex items-center gap-4 min-w-0">
          <div className={`h-11 w-11 rounded-2xl grid place-items-center border ${iconCls}`}>{icon ?? "▢"}</div>
          <div className="min-w-0">
            <div className="font-extrabold text-[16px] truncate text-slate-100">{title}</div>
            {subtitle && <div className="text-sm text-slate-500 truncate">{subtitle}</div>}
          </div>
        </div>

        <button
          className="h-10 w-10 rounded-xl grid place-items-center border border-white/10 bg-white/5 hover:bg-white/10 transition text-slate-400"
          onClick={onToggle}
          aria-label="Toggle section"
          title="Toggle"
          type="button"
        >
          <span className={["inline-block transition-transform", collapsed ? "-rotate-90" : "rotate-0"].join(" ")}>
            ▾
          </span>
        </button>
      </div>

      {!collapsed && <div className="p-5">{children}</div>}
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2">
      <div className="text-sm font-semibold text-slate-500">
        {label} {required && <span className="text-rose-400 font-black">*</span>}
      </div>
      {children}
    </label>
  );
}

function ModalField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-slate-400">
        {label} <span className="text-rose-400 font-black">*</span>
      </div>
      {children}
      {error && <div className="text-xs text-rose-300">{error}</div>}
    </div>
  );
}

function Input(props: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
}) {
  const { value, onChange, placeholder, type } = props;
  return (
    <input
      value={value}
      type={type ?? "text"}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="kgs-field h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10"
    />
  );
}

function TextArea(props: { value: string; onChange: (v: string) => void; rows?: number }) {
  const { value, onChange, rows } = props;
  return (
    <textarea
      value={value}
      rows={rows ?? 4}
      onChange={(e) => onChange(e.target.value)}
      className="kgs-field w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-slate-100 placeholder:text-slate-600 outline-none focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10 resize-y"
    />
  );
}

function Select(props: { value: string; onChange: (v: string) => void; options: string[] }) {
  const { value, onChange, options } = props;
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="kgs-field h-12 w-full rounded-xl border border-white/10 bg-black/20 px-4 text-slate-100 outline-none focus:border-blue-500/30 focus:ring-2 focus:ring-blue-500/10"
    >
      {options.map((o) => (
        <option key={o} value={o} className="bg-slate-950">
          {o}
        </option>
      ))}
    </select>
  );
}

function RoleBadge({ tone, children }: { tone: TeamTone; children: React.ReactNode }) {
  const toneCls =
    tone === "blue"
      ? "border-blue-500/30 bg-blue-500/15 text-blue-200"
      : tone === "teal"
        ? "border-teal-400/30 bg-teal-400/10 text-teal-200"
        : "border-white/10 bg-white/5 text-slate-200/80";

  return <span className={`inline-flex items-center h-6 px-2 rounded-full border text-xs font-bold ${toneCls}`}>{children}</span>;
}

function StatusPill({ status }: { status: ChecklistItem["status"] }) {
  const cls =
    status === "Done"
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
      : status === "Required"
        ? "border-rose-400/25 bg-rose-400/10 text-rose-200"
        : "border-slate-400/20 bg-white/5 text-slate-300/80";

  return <span className={`shrink-0 inline-flex items-center h-6 px-2 rounded-full border text-xs font-bold ${cls}`}>{status}</span>;
}