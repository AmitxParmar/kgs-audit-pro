import { auditReportService } from "@/services/auditReportService";
import { useQuery } from "@tanstack/react-query";

const STAGE_PROGRESS_MAP: Record<string, number> = {
  "Application Received": 14,
  "Application Review": 28,
  "Contract Creation": 42,
  "Contract Review": 57,
  "Contract Sent": 71,
  "Contract Signed": 85,
  "Onboarding Complete": 100,
};

const STAGE_COUNT_MAP: Record<string, string> = {
  "Application Received": "Stage 1 of 7",
  "Application Review": "Stage 2 of 7",
  "Contract Creation": "Stage 3 of 7",
  "Contract Review": "Stage 4 of 7",
  "Contract Sent": "Stage 5 of 7",
  "Contract Signed": "Stage 6 of 7",
  "Onboarding Complete": "Stage 7 of 7",
};

function mapStatus(status: string) {
  switch (status) {
    case "pending":
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
    case "completed":
      return "Onboarding Complete";
    default:
      return "Application Received";
  }
}

export const useClients = () => {
  return useQuery({
    queryKey: ['clients-list'],
    queryFn: auditReportService.getClients,
    select: (data) => data.map((client: any) => {
      const app = client.application_master?.[0];
      const status = mapStatus(app?.status || "pending");
      
      return {
        name: client.name,
        code: `CLI-${client.id.slice(0, 6)}`,
        email: client.contact_email,
        phone: client.contact_phone,
        date: `Created ${new Date(client.created_at).toLocaleDateString()}`,
        scope: client.industry || "N/A",
        stage: status,
        progress: STAGE_PROGRESS_MAP[status] || 14,
        stageCount: STAGE_COUNT_MAP[status] || "Stage 1 of 7",
        type: app?.application_type
          ? app.application_type.trim().toUpperCase()
          : "IAF",
      };
    }),
  });
};