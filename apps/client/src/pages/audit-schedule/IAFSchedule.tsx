import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import KgsSidebar from "./KGSSidebar";

/**
 * IAF MD4 schedule page (separate file).
 * - Same shell + sidebar.
 * - Top "Standard" pills switch between IATF and IAF pages.
 * - UI kept dark and flat (no gradients).
 */

type CollapsedSections = { details: boolean; scope: boolean; team: boolean; checklist: boolean };

type FormState = {
  cab: string;
  auditType: string;
  accreditationBody: string;
  plannedStart: string;
  plannedEnd: string;
  iafDocumentRef: string;
  scopeOfAccreditation: string;

  scopeDescription: string;
  applicableDocs: string;
  witnessRequirement: string;
};

type TeamTone = "amber" | "slate" | "teal";

type TeamMember = {
  name: string;
  role: string;
  qualification: string;
  assignedArea: string;
  badgeTone: TeamTone;
};

type ChecklistItem = {
  label: string;
  checked: boolean;
  status: "Done" | "Required" | "Optional";
};

const steps = ["Audit Planning", "Desk Review", "On-site Audit", "Reporting"] as const;
type StepKey = (typeof steps)[number];

type MemberDraft = {
  name: string;
  role: string;
  qualification: string;
  assignedArea: string;
};

type MemberErrors = Partial<Record<keyof MemberDraft, string>>;

export default function IafSchedule() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState<StepKey>("Audit Planning");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [collapsed, setCollapsed] = useState<CollapsedSections>({
    details: false,
    scope: false,
    team: false,
    checklist: false,
  });

  const [form, setForm] = useState<FormState>({
    cab: "Bravo Industries Cert. Body",
    auditType: "Initial Accreditation",
    accreditationBody: "KGS Accreditation Body",
    plannedStart: "2026-04-12",
    plannedEnd: "2026-04-14",
    iafDocumentRef: "IAF MD4:2022",
    scopeOfAccreditation: "Management System Certification",

    scopeDescription:
      "Accreditation of management system certification bodies for ISO 9001 & ISO 14001",
    applicableDocs: "IAF MD4, MD9, MD11",
    witnessRequirement: "Yes — to be conducted during on-site phase",
  });

  const [team, setTeam] = useState<TeamMember[]>([
    {
      name: "Sunita Rao",
      role: "Lead Assessor",
      qualification: "IAF Certified LA",
      assignedArea: "All processes",
      badgeTone: "amber",
    },
    {
      name: "Ravi Menon",
      role: "Assessor",
      qualification: "ISO 17021 LA",
      assignedArea: "Certification process",
      badgeTone: "slate",
    },
    {
      name: "Priya Nair",
      role: "Technical Assessor",
      qualification: "MS Certification Exp.",
      assignedArea: "Witness audit",
      badgeTone: "teal",
    },
  ]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { label: "CAB application received & reviewed", checked: true, status: "Done" },
    { label: "Accreditation body appointment confirmed", checked: true, status: "Done" },
    { label: "Audit notification sent to CAB", checked: false, status: "Required" },
    { label: "IAF MD4 §5 documented procedures requested", checked: false, status: "Required" },
    { label: "Competence records of CAB personnel obtained", checked: false, status: "Required" },
    { label: "Witness audit client list provided by CAB", checked: false, status: "Optional" },
  ]);

  const [autoSavedAt, setAutoSavedAt] = useState<Date>(new Date());

  const breadcrumbs = useMemo(
    () => ["Dashboard", "Audits", "IAF MD4", "Bravo Industries", "Audit Planning"],
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

      const checked = !item.checked;
      const status: ChecklistItem["status"] = checked ? "Done" : item.status === "Done" ? "Required" : item.status;

      next[idx] = { ...item, checked, status };
      return next;
    });
    setAutoSavedAt(new Date());
  };

  // -------- Add Team Member modal state --------
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [memberDraft, setMemberDraft] = useState<MemberDraft>({
    name: "",
    role: "Assessor",
    qualification: "",
    assignedArea: "",
  });
  const [memberErrors, setMemberErrors] = useState<MemberErrors>({});

  const openAddMember = () => {
    setMemberDraft({
      name: "",
      role: "Assessor",
      qualification: "",
      assignedArea: "",
    });
    setMemberErrors({});
    setAddMemberOpen(true);
  };

  const closeAddMember = () => setAddMemberOpen(false);

  const saveMember = () => {
    const errs: MemberErrors = {};
    if (!memberDraft.name.trim()) errs.name = "Name is required";
    if (!memberDraft.role.trim()) errs.role = "Role is required";
    if (!memberDraft.qualification.trim()) errs.qualification = "Qualification is required";
    if (!memberDraft.assignedArea.trim()) errs.assignedArea = "Assigned area is required";

    setMemberErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const tone: TeamTone =
      memberDraft.role === "Lead Assessor" ? "amber" : memberDraft.role === "Technical Assessor" ? "teal" : "slate";

    setTeam((p) => [
      ...p,
      {
        name: memberDraft.name.trim(),
        role: memberDraft.role.trim(),
        qualification: memberDraft.qualification.trim(),
        assignedArea: memberDraft.assignedArea.trim(),
        badgeTone: tone,
      },
    ]);
    setAutoSavedAt(new Date());
    setAddMemberOpen(false);
  };

  return (
    <div className="h-screen w-full bg-slate-950 text-slate-200 flex overflow-hidden">
      {/* Force dark inputs even on focus/autofill (prevents white fields) */}
      <style>{`
        .kgs-field {
          color: rgb(226 232 240) !important;
          background-color: rgba(0,0,0,0.20) !important;
          caret-color: rgb(226 232 240) !important;
        }
        .kgs-field:focus {
          color: rgb(226 232 240) !important;
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

      <main className="flex-1 min-w-0 flex flex-col">
        {/* Topbar */}
        <header className="h-14 shrink-0 flex items-center justify-between px-4 lg:px-5 border-b border-white/10 bg-slate-950/40 backdrop-blur">
          <div className="flex items-center gap-2 min-w-0">
            <button
              className="lg:hidden h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition grid place-items-center"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
              type="button"
            >
              ☰
            </button>

            <button
              className="hidden lg:grid h-10 w-10 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition place-items-center"
              onClick={() => setSidebarCollapsed((v) => !v)}
              aria-label="Toggle sidebar collapse"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              type="button"
            >
              {sidebarCollapsed ? "»" : "«"}
            </button>

            <div className="text-sm text-slate-300/90 truncate">
              {breadcrumbs.map((b, idx) => (
                <span key={b} className="whitespace-nowrap">
                  {b}
                  {idx < breadcrumbs.length - 1 && <span className="mx-2 text-slate-500">›</span>}
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm" type="button">
              <span className="mr-2">📄</span>Documents
            </button>
            <button className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm" type="button">
              <span className="mr-2">🔔</span>Alerts
            </button>
            <div className="h-9 px-3 rounded-full border border-white/10 bg-white/5 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span className="font-bold text-sm">RK</span>
            </div>
          </div>
        </header>

        {/* Context row */}
        <section className="shrink-0 px-4 lg:px-5 py-3 border-b border-white/10 bg-slate-950/30">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-slate-400">Standard:</span>

            <button
              type="button"
              className="h-8 px-3 rounded-full text-xs font-bold border border-white/10 bg-white/5 text-slate-300/90 hover:bg-white/10 transition"
              onClick={() => navigate("/audit-schedule")}
              title="IATF 16949"
            >
              IATF 16949
            </button>

            <button
              type="button"
              className="h-8 px-3 rounded-full text-xs font-bold border border-amber-500/30 bg-amber-500/15 text-amber-200 hover:bg-amber-500/20 transition"
              onClick={() => navigate("/iaf-schedule")}
              aria-current="page"
              title="IAF MD4"
            >
              IAF MD4
            </button>

            <span className="mx-1 h-4 w-px bg-white/15" />
            <span className="text-sm text-slate-400">
              Bravo Industries <span className="text-slate-600">›</span> Initial Accreditation{" "}
              <span className="text-slate-600">›</span> Lead: Sunita Rao
            </span>
          </div>
        </section>

        {/* Stepper */}
        <section className="shrink-0 px-4 lg:px-5 pt-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {steps.map((s, i) => {
              const isActive = s === activeStep;
              const isCompleted = steps.indexOf(activeStep) > i;

              return (
                <button
                  key={s}
                  onClick={() => setActiveStep(s)}
                  className={[
                    "flex items-center gap-2 rounded-2xl border px-3 py-2 transition",
                    isActive ? "border-amber-500/30 bg-amber-500/10" : "border-white/10 bg-white/5 hover:bg-white/10",
                  ].join(" ")}
                  type="button"
                >
                  <span
                    className={[
                      "h-7 w-7 rounded-full grid place-items-center text-xs font-black border",
                      isCompleted
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                        : isActive
                          ? "border-amber-400/35 bg-amber-500/15 text-amber-200"
                          : "border-white/10 bg-white/5 text-slate-200",
                    ].join(" ")}
                  >
                    {isCompleted ? "✓" : i + 1}
                  </span>
                  <span className="text-sm font-bold">{s}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Content */}
        <section className="flex-1 min-h-0 overflow-auto px-4 lg:px-5 pb-28 space-y-4">
          <Card
            title="Audit details"
            subtitle="IAF MD4 accreditation identification"
            icon="📋"
            collapsed={collapsed.details}
            onToggle={() => setCollapsed((p) => ({ ...p, details: !p.details }))}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Field label="Conformity Assessment Body (CAB)" required>
                <Input value={form.cab} onChange={(v) => updateForm("cab", v)} />
              </Field>

              <Field label="Audit type" required>
                <Select
                  value={form.auditType}
                  onChange={(v) => updateForm("auditType", v)}
                  options={["Initial Accreditation", "Surveillance", "Re-assessment", "Extension of scope"]}
                />
              </Field>

              <Field label="Accreditation body" required>
                <Input value={form.accreditationBody} onChange={(v) => updateForm("accreditationBody", v)} />
              </Field>

              <Field label="Planned start date">
                <Input value={form.plannedStart} onChange={(v) => updateForm("plannedStart", v)} type="date" />
              </Field>

              <Field label="Planned end date">
                <Input value={form.plannedEnd} onChange={(v) => updateForm("plannedEnd", v)} type="date" />
              </Field>

              <div className="hidden lg:block" />

              <Field label="IAF document reference">
                <Input value={form.iafDocumentRef} onChange={(v) => updateForm("iafDocumentRef", v)} />
              </Field>

              <Field label="Scope of accreditation">
                <Input value={form.scopeOfAccreditation} onChange={(v) => updateForm("scopeOfAccreditation", v)} />
              </Field>
            </div>
          </Card>

          <Card
            title="Accreditation scope & criteria"
            subtitle="IAF MD4 clause applicability"
            icon="🎯"
            collapsed={collapsed.scope}
            onToggle={() => setCollapsed((p) => ({ ...p, scope: !p.scope }))}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Field label="Scope description">
                <TextArea value={form.scopeDescription} onChange={(v) => updateForm("scopeDescription", v)} rows={3} />
              </Field>

              <Field label="Applicable IAF MD documents">
                <Select
                  value={form.applicableDocs}
                  onChange={(v) => updateForm("applicableDocs", v)}
                  options={["IAF MD4, MD9, MD11", "IAF MD4 Only", "IAF MD4, MD5", ]}
                />
              </Field>

              <div className="lg:col-span-2">
                <Field label="Witness audit requirement (IAF MD4 §6)">
                  <Select
                    value={form.witnessRequirement}
                    onChange={(v) => updateForm("witnessRequirement", v)}
                    options={[
                      "Yes — to be conducted during on-site phase",
                      "No — exemption applicable"
                    ]}
                  />
                </Field>
              </div>
            </div>
          </Card>

          {/* ✅ Add these below Accreditation scope & criteria (matches screenshot) */}
          <Card
            title="Audit team"
            subtitle="Lead assessor, team & technical assessors"
            icon="👥"
            collapsed={collapsed.team}
            onToggle={() => setCollapsed((p) => ({ ...p, team: !p.team }))}
          >
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-4 px-1 text-[11px] tracking-widest text-slate-500">
                <div>NAME</div>
                <div>ROLE</div>
                <div>QUALIFICATION</div>
                <div>ASSIGNED AREA</div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/10 overflow-hidden">
                {team.map((m, idx) => (
                  <div
                    key={`${m.name}-${idx}`}
                    className="grid grid-cols-4 gap-4 px-4 py-3 text-sm border-t border-white/10 first:border-t-0"
                  >
                    <div className="text-slate-200/90">{m.name}</div>
                    <div>
                      <RoleBadge tone={m.badgeTone}>{m.role}</RoleBadge>
                    </div>
                    <div className="text-slate-300/80">{m.qualification}</div>
                    <div className="text-slate-300/80">{m.assignedArea}</div>
                  </div>
                ))}
              </div>

              <button
                className="h-9 px-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition text-sm"
                onClick={openAddMember}
                type="button"
              >
                + Add team member
              </button>
            </div>
          </Card>

          <Card
            title="Pre-audit checklist"
            subtitle="IAF MD4 planning requirements"
            icon="✅"
            collapsed={collapsed.checklist}
            onToggle={() => setCollapsed((p) => ({ ...p, checklist: !p.checklist }))}
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
                      className="h-4 w-4 rounded border-white/20 bg-black/30 text-amber-500 focus:ring-amber-500/20"
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
        <footer className="shrink-0 sticky bottom-0 border-t border-white/10 bg-slate-950/70 backdrop-blur px-4 lg:px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <button className="h-10 px-3 rounded-xl border border-white/10 bg-transparent hover:bg-white/5 transition" type="button">
                ← Previous
              </button>

              <div className="h-10 px-3 rounded-full border border-emerald-400/25 bg-emerald-400/10 text-emerald-100 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-bold text-sm">Auto-saved</span>
                <span className="text-sm text-emerald-100/70">{`at ${formatTime(autoSavedAt)}`}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button className="h-10 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition font-bold" type="button">
                Save draft
              </button>
              <button
                className="h-10 px-4 rounded-xl border border-amber-500/30 bg-amber-500/20 hover:bg-amber-500/25 transition font-extrabold text-amber-100"
                type="button"
              >
                Save &amp; proceed to Desk Review →
              </button>
            </div>
          </div>
        </footer>
      </main>

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
                    options={["Lead Assessor", "Assessor", "Technical Assessor"]}
                  />
                </ModalField>

                <ModalField label="Qualification" error={memberErrors.qualification}>
                  <Input
                    value={memberDraft.qualification}
                    onChange={(v) => setMemberDraft((p) => ({ ...p, qualification: v }))}
                  />
                </ModalField>

                <ModalField label="Assigned area" error={memberErrors.assignedArea}>
                  <Input
                    value={memberDraft.assignedArea}
                    onChange={(v) => setMemberDraft((p) => ({ ...p, assignedArea: v }))}
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
                  className="h-10 px-4 rounded-xl border border-amber-500/30 bg-amber-500/20 hover:bg-amber-500/25 transition font-extrabold text-amber-100"
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
  children: React.ReactNode;
}) {
  const { title, subtitle, icon, collapsed, onToggle, children } = props;
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-white/[0.03] shadow-[0_25px_70px_rgba(0,0,0,0.32)] overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-xl grid place-items-center border border-white/10 bg-white/5">
            {icon ?? "▢"}
          </div>
          <div className="min-w-0">
            <div className="font-extrabold truncate">{title}</div>
            {subtitle && <div className="text-xs text-slate-400 truncate">{subtitle}</div>}
          </div>
        </div>

        <button
          className="h-9 w-9 rounded-xl grid place-items-center border border-white/10 bg-white/5 hover:bg-white/10 transition"
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

      {!collapsed && <div className="p-4">{children}</div>}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <div className="text-xs text-slate-400">
        {label} {required && <span className="text-rose-400 font-black">*</span>}
      </div>
      {children}
    </label>
  );
}

function ModalField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
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
      className="kgs-field h-10 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/10"
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
      className="kgs-field w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-slate-100 placeholder:text-slate-600 outline-none focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/10 resize-y"
    />
  );
}

function Select(props: { value: string; onChange: (v: string) => void; options: string[] }) {
  const { value, onChange, options } = props;
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="kgs-field h-10 w-full rounded-xl border border-white/10 bg-black/20 px-3 text-slate-100 outline-none focus:border-amber-500/30 focus:ring-2 focus:ring-amber-500/10"
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
    tone === "amber"
      ? "border-amber-500/30 bg-amber-500/15 text-amber-200"
      : tone === "teal"
        ? "border-teal-400/30 bg-teal-400/10 text-teal-200"
        : "border-white/10 bg-white/5 text-slate-200/80";

  return (
    <span className={`inline-flex items-center h-6 px-2 rounded-full border text-xs font-bold ${toneCls}`}>
      {children}
    </span>
  );
}

function StatusPill({ status }: { status: ChecklistItem["status"] }) {
  const cls =
    status === "Done"
      ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
      : status === "Required"
        ? "border-rose-400/25 bg-rose-400/10 text-rose-200"
        : "border-slate-400/20 bg-white/5 text-slate-300/80";

  return (
    <span className={`shrink-0 inline-flex items-center h-6 px-2 rounded-full border text-xs font-bold ${cls}`}>
      {status}
    </span>
  );
}