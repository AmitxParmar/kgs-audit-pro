import StatusBubble from "./StatusBubble";
import type { AuditReportStatusEnum } from "../utils";

export type WorkflowStepStatus = "done" | "active" | "pending";

export type WorkflowStep = {
  label: string;
  status: WorkflowStepStatus;
  stageEnum: AuditReportStatusEnum;
};

export type ReportStatusRowProps = {
  companyName: string;
  auditSubType: string;
  auditor: string;
  date: string;
  workflowSteps: WorkflowStep[];
  auditReportStatus: AuditReportStatusEnum | null;
  /** Called when user taps a workflow circle — passes the target stage enum value */
  onStepClick?: (stage: AuditReportStatusEnum) => void;
};

const auditTypePillColors: Record<string, string> = {
  registration: "bg-blue-500/15 text-blue-300 border-blue-400/20",
  surveillance: "bg-purple-500/15 text-purple-300 border-purple-400/20",
  recertification: "bg-amber-500/15 text-amber-300 border-amber-400/20",
};

function StepCircle({
  step,
  isCurrent,
  onClick,
}: {
  step: WorkflowStep;
  isCurrent: boolean;
  onClick: () => void;
}) {
  const base =
    "h-11 w-11 rounded-full border-2 grid place-items-center flex-shrink-0 transition cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400/60";

  const hoverRing = "hover:ring-2 hover:ring-teal-400/40 hover:scale-105 active:scale-95";

  if (step.status === "done") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={`Set stage: ${step.label}`}
        className={`${base} ${hoverRing} border-teal-400/50 bg-teal-400/15`}
      >
        <svg className="h-5 w-5 text-teal-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  }

  if (step.status === "active") {
    return (
      <button
        type="button"
        onClick={onClick}
        title={`Current stage: ${step.label}`}
        className={`${base} ${hoverRing} border-teal-400/70 bg-teal-400/20 animate-pulse`}
      >
        <div className="h-3 w-3 rounded-full bg-teal-400" />
      </button>
    );
  }

  // pending
  return (
    <button
      type="button"
      onClick={onClick}
      title={`Set stage: ${step.label}`}
      className={`${base} ${hoverRing} border-white/15 bg-white/[0.03] hover:border-teal-400/30`}
    >
      <div className="h-2.5 w-2.5 rounded-full bg-slate-600" />
    </button>
  );
}

export default function ReportStatusRow({
  companyName,
  auditSubType,
  auditor,
  date,
  workflowSteps,
  auditReportStatus,
  onStepClick,
}: ReportStatusRowProps) {
  const auditTypePill =
    auditTypePillColors[auditSubType.toLowerCase()] ??
    "bg-slate-400/10 text-slate-300 border-slate-400/20";

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base font-extrabold text-slate-100 truncate">
            {companyName}
          </span>
          <span
            className={`inline-flex items-center h-6 px-2 rounded-full border text-xs font-semibold ${auditTypePill}`}
          >
            {auditSubType}
          </span>
          <StatusBubble status={auditReportStatus} />
        </div>

        <div className="flex items-center gap-4 shrink-0 text-xs text-slate-400">
          {/* Auditor */}
          <span className="flex items-center gap-1.5">
            <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
            </svg>
            {auditor}
          </span>
          {/* Date */}
          <span className="flex items-center gap-1.5">
            <svg
              className="h-3.5 w-3.5 text-slate-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.25A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4H5V2.75A.75.75 0 0 1 5.75 2Zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75Z"
                clipRule="evenodd"
              />
            </svg>
            {date}
          </span>
        </div>
      </div>

      {/* Workflow steps */}
      <div className="flex items-start gap-4 overflow-x-auto pb-1">
        {workflowSteps.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5 min-w-[72px]">
            <StepCircle
              step={step}
              isCurrent={step.stageEnum === auditReportStatus}
              onClick={() => onStepClick?.(step.stageEnum)}
            />
            <span className="text-[10px] text-center text-slate-500 leading-tight max-w-[72px]">
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}