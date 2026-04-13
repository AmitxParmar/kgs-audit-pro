import { clientOnboardingService } from "@/services/clientOnboardingService";
import { useQuery } from "@tanstack/react-query";
import { mapStatus, STAGE_PROGRESS_MAP, STAGE_COUNT_MAP } from "../utils/stage";
import type { ClientRaw, ApplicationMasterRaw } from "./types";

// ─── Transformed client shape ─────────────────────────────────────────────────

export interface ClientViewModel {
  id: string;
  name: string;
  cb_id: string;
  industry: string | null;
  kyc_status: string | null;
  onboarded_at: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  website: string | null;
  code: string;
  date: string;
  scope: string;
  stage: string;
  progress: number;
  stageCount: string;
  type: string;
  application_id: string | undefined;
  application: ApplicationMasterRaw | null;
  applications: { application_id: string; status: string }[];
  decisionNote: string;
}

// ─── Query key ────────────────────────────────────────────────────────────────

export const CLIENTS_QUERY_KEY = ["onboarding", "clients-list"] as const;

// ─── Selector: raw → view model (module-level = stable reference) ─────────────

function selectClients(data: ClientRaw[]): ClientViewModel[] {
  if (!Array.isArray(data)) return [];

  return data.map((client): ClientViewModel => {
    // Supabase one-to-many join returns an array; single-row joins may return an object
    const app: ApplicationMasterRaw | null = Array.isArray(client.application_master)
      ? (client.application_master[0] ?? null)
      : (client.application_master ?? null);

    const status = mapStatus(app?.status ?? "pending");

    return {
      id: client.id,
      name: client.name,
      cb_id: client.cb_id ?? "",
      industry: client.industry,
      kyc_status: client.kyc_status,
      onboarded_at: client.onboarded_at,
      contact_name: client.contact_name,
      contact_email: client.contact_email,
      contact_phone: client.contact_phone,
      address: client.address,
      website: client.website,
      code: `CLI-${client.id.slice(0, 6)}`,
      date: client.onboarded_at
        ? `Created ${new Date(client.onboarded_at).toLocaleDateString()}`
        : "N/A",
      scope: client.industry ?? "N/A",
      stage: status,
      progress: STAGE_PROGRESS_MAP[status] ?? 14,
      stageCount: STAGE_COUNT_MAP[status] ?? "Stage 1 of 7",
      type: app?.application_type?.trim().toUpperCase() ?? "IAF",
      application_id: app?.application_id,
      application: app,
      applications: app
        ? [{ application_id: app.application_id, status: app.status }]
        : [],
      decisionNote: app?.scheme_comment ?? "",
    };
  });
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useClients = () =>
  useQuery<ClientRaw[], Error, ClientViewModel[]>({
    queryKey: CLIENTS_QUERY_KEY,
    queryFn: () => clientOnboardingService.getClients() as Promise<ClientRaw[]>,
    select: selectClients,
    staleTime: 5 * 60 * 1000,   // 5 min — data is fresh, no background refetch
    retry: false,               // surface errors immediately
    refetchOnWindowFocus: false,
    refetchOnMount: true,       // fetch once on first mount only
  });