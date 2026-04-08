import { getUiStage } from "./status-stage-mapping";
import { WorkflowStep } from "../components/ReportStatusRow";

export type RightPanelTab = "documents" | "alerts";

export type AuditReport = {
  id: string;
  companyName: string;
  auditSubType: string;
  auditor: string;
  date: string;
  workflowSteps: WorkflowStep[];
  status: string;
};

export type StageKey =
  | "all"
  | "draft"
  | "tech-review"
  | "iatf-update"
  | "nc-management"
  | "certification"
  | "rejected";

// Mock data removed in favor of real API data

export const STAGE_ORDER = [
  "Draft Report",
  "Technical Review",
  "IATF Update",
  "NC Management",
  "Certification",
];

export const STAGE_MAP_REVERSE: Record<string, string> = {
  "draft": "Draft Report",
  "tech-review": "Technical Review",
  "iatf-update": "IATF Update",
  "nc-management": "NC Management",
  "certification": "Certification",
};

export function transformAudit(apiAudit: any): AuditReport {
  const currentStage = getUiStage(apiAudit.status);
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  const workflowSteps = STAGE_ORDER.map((label, index) => {
    let status: "done" | "active" | "pending" = "pending";
    if (index < currentIndex) {
      status = "done";
    } else if (index === currentIndex) {
      status = "active";
    }
    return { label, status };
  });

  return {
    id: apiAudit.id,
    companyName: apiAudit.client?.name || "Unknown Client",
    auditSubType: apiAudit.standard?.code || "Audit",
    auditor: apiAudit.lead_auditor?.full_name || "Unassigned",
    date: apiAudit.planned_date || "TBD",
    status: apiAudit.status,
    workflowSteps,
  };
}

export function countByStage(reports: AuditReport[], stage: keyof typeof STAGE_MAP_REVERSE | "all" | "rejected"): number {
  if (stage === "all") return reports.length;
  if (stage === "rejected") return reports.filter((r) => r.status === "denied").length;
  
  const uiStage = STAGE_MAP_REVERSE[stage];
  if (!uiStage) return 0;
  
  return reports.filter((r) => getUiStage(r.status) === uiStage).length;
}