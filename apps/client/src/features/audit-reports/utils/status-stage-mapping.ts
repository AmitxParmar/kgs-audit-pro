export const STATUS_STAGE_MAP: Record<string, string> = {
  // Draft Report
  client_onboarded: "Draft Report",
  audit_planned: "Draft Report",
  audit_in_progress: "Draft Report",

  // Technical Review
  report_under_review: "Technical Review",

  // IATF Update
  cert_decision: "IATF Update",

  // NC Management
  nc_raised: "NC Management",

  // Certification
  cert_granted: "Certification",
  cert_uploaded: "Certification",
  active: "Certification",
  denied: "Certification",
  suspended: "Certification",
};

export const getUiStage = (status: string): string => {
  return STATUS_STAGE_MAP[status] || "Draft Report"; // fallback
};
