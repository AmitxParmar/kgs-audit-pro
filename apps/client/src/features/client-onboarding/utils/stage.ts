// ─── Stage ordering ────────────────────────────────────────────────────────────

export const STAGES = [
  "Application Received",
  "Application Review",
  "Contract Creation",
  "Contract Review",
  "Contract Sent",
  "Contract Signed",
  "Onboarding Complete",
] as const;

export type StageName = (typeof STAGES)[number];

// ─── Progress & label maps ─────────────────────────────────────────────────────

export const STAGE_PROGRESS_MAP: Record<StageName, number> = {
  "Application Received": 14,
  "Application Review": 28,
  "Contract Creation": 42,
  "Contract Review": 57,
  "Contract Sent": 71,
  "Contract Signed": 85,
  "Onboarding Complete": 100,
};

export const STAGE_COUNT_MAP: Record<StageName, string> = {
  "Application Received": "Stage 1 of 7",
  "Application Review": "Stage 2 of 7",
  "Contract Creation": "Stage 3 of 7",
  "Contract Review": "Stage 4 of 7",
  "Contract Sent": "Stage 5 of 7",
  "Contract Signed": "Stage 6 of 7",
  "Onboarding Complete": "Stage 7 of 7",
};

// ─── DB status → UI stage name ────────────────────────────────────────────────
// application_master.status is varchar(30); onboarding_history uses strict enum.

export const STATUS_MAP: Record<string, string> = {
  pending: "application_received",
  completed: "onboarding_complete", // legacy alias
  application_received: "application_received",
  application_review: "application_review",
  contract_creation: "contract_creation",
  contract_review: "contract_review",
  contract_sent: "contract_sent",
  contract_signed: "contract_signed",
  onboarding_complete: "onboarding_complete",
};

/** Normalizes any string status to a valid DB enum string. */
export function normalizeStatus(s: string): string {
  return STATUS_MAP[s] ?? "application_received";
}

export function mapStatus(status: string): StageName {
  const normalized = normalizeStatus(status);
  switch (normalized) {
    case "application_received":
      return "Application Received";
    case "application_review":
      return "Application Review";
    case "contract_creation":
      return "Contract Creation";
    case "contract_review":
      return "Contract Review";
    case "contract_sent":
      return "Contract Sent";
    case "contract_signed":
      return "Contract Signed";
    case "onboarding_complete":
      return "Onboarding Complete";
    default:
      return "Application Received";
  }
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Returns true when the client is past the review stage and has entered contracting. */
export function isContractingStage(stage: string): boolean {
  return (
    stage === "Contract Creation" ||
    stage === "Contract Review" ||
    stage === "Contract Sent" ||
    stage === "Contract Signed"
  );
}