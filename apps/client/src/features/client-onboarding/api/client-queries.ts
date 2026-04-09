import { clientOnboardingService } from "@/services/clientOnboardingService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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

export function mapStatus(status: string) {
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

// ✅ QUERY: GET CLIENTS
export const useClients = () => {
  return useQuery(
    ['clients-list'],
    clientOnboardingService.getClients,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000,   // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      select: (data) => data.map((client: any) => {
        const app = Array.isArray(client.application_master) 
          ? client.application_master[0] 
          : client.application_master;
          
        const status = mapStatus(app?.status || "pending");
        
        return {
          ...client,
          code: `CLI-${client.id.slice(0, 6)}`,
          date: `Created ${new Date(client.onboarded_at).toLocaleDateString()}`,
          scope: client.industry || "N/A",
          stage: status,
          progress: STAGE_PROGRESS_MAP[status] || 14,
          stageCount: STAGE_COUNT_MAP[status] || "Stage 1 of 7",
          type: app?.application_type
            ? app.application_type.trim().toUpperCase()
            : "IAF",
          application_id: app?.application_id,
          application: app,
          applications: app ? [{ application_id: app.application_id, status: app.status }] : [],
          decisionNote: app?.scheme_comment || "",
        };
      }),
    }
  );
};

// ✅ MUTATION: ONBOARD CLIENT
export const useOnboardClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => clientOnboardingService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients-list'] });
      toast.success("Client onboarded successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to onboard client");
    }
  });
};

// ✅ MUTATION: UPDATE STATUS
export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => 
      clientOnboardingService.updateApplicationStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients-list'] });
      toast.success("Status updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update status");
    }
  });
};

// ✅ MUTATION: CREATE CONTRACT
export const useCreateContract = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) => clientOnboardingService.createContract(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients-list'] });
      toast.success("Contract created successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create contract");
    }
  });
};