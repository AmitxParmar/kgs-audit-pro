import { WorkflowStep } from "../components/ReportStatusRow";

export type RightPanelTab = "documents" | "alerts";

export type AuditReport = {
  id: string;
  companyName: string;
  auditSubType: string;
  auditor: string;
  date: string;
  workflowSteps: WorkflowStep[];
  auditReportStatus: AuditReportStatusEnum | null;
  // kept for display-only (e.g. "Report Under Review" badge) — not used for filtering
  legacyStatus: string;
};

// The 5 enum values from audit_report_status_type
export type AuditReportStatusEnum =
  | "draft_report"
  | "technical_review"
  | "iatf_update"
  | "nc_update"
  | "certification_update";

export type StageKey =
  | "all"
  | "draft_report"
  | "technical_review"
  | "iatf_update"
  | "nc_update"
  | "certification_update";

// Ordered list — matches the 5 workflow circles in order
export const STAGE_ORDER: AuditReportStatusEnum[] = [
  "draft_report",
  "technical_review",
  "iatf_update",
  "nc_update",
  "certification_update",
];

// Human-readable labels for each enum value
export const STAGE_LABELS: Record<AuditReportStatusEnum, string> = {
  draft_report: "Draft Report",
  technical_review: "Technical Review",
  iatf_update: "IATF Update",
  nc_update: "NC Management",
  certification_update: "Certification",
};

export function transformAudit(apiAudit: any): AuditReport {
  const currentStatus = apiAudit.audit_report_status as AuditReportStatusEnum | null;
  const currentIndex = currentStatus ? STAGE_ORDER.indexOf(currentStatus) : -1;

  const workflowSteps: WorkflowStep[] = STAGE_ORDER.map((stageEnum, index) => {
    let stepStatus: "done" | "active" | "pending" = "pending";
    if (currentIndex >= 0) {
      if (index < currentIndex) stepStatus = "done";
      else if (index === currentIndex) stepStatus = "active";
    }
    return {
      label: STAGE_LABELS[stageEnum],
      status: stepStatus,
      stageEnum,
    };
  });

  return {
    id: apiAudit.id,
    companyName: apiAudit.client?.name || "Unknown Client",
    auditSubType: apiAudit.standard?.code || "Audit",
    auditor: apiAudit.lead_auditor?.full_name || "Unassigned",
    date: apiAudit.planned_date || "TBD",
    auditReportStatus: currentStatus,
    legacyStatus: apiAudit.status ?? "",
    workflowSteps,
  };
}

export function countByStage(reports: AuditReport[], stage: StageKey): number {
  if (stage === "all") return reports.length;
  return reports.filter((r) => r.auditReportStatus === stage).length;
}