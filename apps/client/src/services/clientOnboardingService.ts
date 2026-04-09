import type {
  OnboardClientPayload,
  CreateContractPayload,
} from "@/features/client-onboarding/api/types";
import { supabase } from "@/lib/supabase";
import { profileService } from "./profileService";
import { normalizeStatus } from "@/features/client-onboarding/utils";

// Kept for any legacy callers — new code should use OnboardClientPayload
export interface ClientInput {
  name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  industry?: string;
  website?: string;
  manufacturing_sites?: any[];
  remote_locations?: any[];
  application_type?: string;
  application?: any;
}



// ─── Helper: resolve the certification body id for the current user ───────────
// Strategy (in order):
//   1. user.user_metadata.cb_id   — fastest, set at sign-up by admin
//   2. profiles.cb_id             — standard Supabase profile pattern
//   3. certification_bodies table — fallback for single-tenant setups where
//                                   only one active CB exists (e.g. KGS)
async function getCbId(userId: string): Promise<string> {
  // 1. JWT metadata (fastest — no extra round-trip)
  const { data: { user } } = await supabase.auth.getUser();
  const metaCbId: string | undefined = user?.user_metadata?.cb_id;
  if (metaCbId) return metaCbId;

  // 2. Single-tenant fallback — use the one active certification body
  const { data: cb, error: cbError } = await supabase
    .from("certification_bodies")
    .select("id")
    .eq("status", "active")
    .limit(1)
    .maybeSingle();

  if (cbError || !cb?.id) {
    throw new Error(
      "Could not determine your certification body. " +
      "Please ensure your account is linked to an active certification body.",
    );
  }

  return cb.id as string;
}

export const clientOnboardingService = {
  // ─── GET ALL CLIENTS ───────────────────────────────────────────────────────
  async getClients() {
    const { data, error } = await supabase
      .from("clients")
      .select(
        `
        id,
        cb_id,
        name,
        industry,
        kyc_status,
        onboarded_at,
        contact_name,
        contact_email,
        contact_phone,
        address,
        website,
        status,
        application_master (
          application_id,
          application_type,
          status,
          standard,
          type_of_audit,
          scheme_comment,
          iaf_code,
          nace_code,
          sic_code,
          legal_obligations,
          legal_obligation_details,
          proposed_scope,
          outsourced_processes,
          shifts,
          manufacturing_sites,
          created_at,
          updated_at
        )
      `,
      )
      .order("onboarded_at", { ascending: false });

    if (error) {
      console.error("getClients error:", error);
      throw error;
    }
    return data ?? [];
  },

  // ─── CREATE CLIENT ─────────────────────────────────────────────────────────
  // Executes 4 sequential inserts:
  //   1. clients          → stores the company / contact snapshot
  //   2. application_master → full IATF/IAF application data
  //   3. contacts         → primary contact record (linked to application)
  //   4. onboarding_history → audit trail entry
  async create(data: OnboardClientPayload) {
    // ── Resolve both auth user (for last_action_by) and profile (for changed_by)
    const [user, profile] = await Promise.all([
      profileService.getAuthUser(),
      profileService.getCurrent(),
    ]);

    // ── Resolve cb_id ──────────────────────────────────────────────────────────
    const cb_id = await getCbId(user.id);

    const appData = data.application;
    const allRemoteLocations = appData.manufacturing_sites.flatMap(
      (site) => site.remote_locations ?? [],
    );

    // ── 1. Create client ───────────────────────────────────────────────────────
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .insert({
        name: data.name,
        cb_id,
        contact_name: data.contact_name || null,
        contact_email: data.contact_email || null,
        contact_phone: data.contact_phone || null,
        address: data.address || null,
        website: data.website || null,
        industry: data.industry || null,
        status: "application_received",
      })
      .select()
      .single();

    if (clientError) throw clientError;
    const clientId: string = client.id;

    // ── 2. Create application_master ───────────────────────────────────────────
    const { data: application, error: appError } = await supabase
      .from("application_master")
      .insert({
        client_id: clientId,
        application_type: data.application_type,
        standard: appData.applicable_standards.join(", ") || "General",
        status: "application_received",
        type_of_audit: appData.type_of_audit || null,
        product_design_responsibility: appData.product_design_responsibility || null,
        mailing_address: data.address || null,
        registration_site_address: data.address || null,
        manufacturing_sites: appData.manufacturing_sites,
        remote_locations: allRemoteLocations,
        extended_sites: [],
        iaf_code: appData.iaf_code || null,
        nace_code: appData.nace_code || null,
        sic_code: appData.sic_code || null,
        languages_spoken: appData.languages_spoken,
        shifts: appData.shifts,
        working_days: appData.working_days ?? [],
        surveillance_frequency: appData.surveillance_frequency ?? null,
        legal_obligations: appData.legal_obligations,
        legal_obligation_details: appData.legal_obligation_details || null,
        previous_iatf_certified: appData.previous_iatf_certified,
        automotive_customers: appData.automotive_customers,
        automotive_percentage:
          appData.automotive_percentage
            ? parseInt(appData.automotive_percentage as unknown as string, 10) || null
            : null,
        has_iatf_oem_customers: appData.has_iatf_oem_customers ?? false,
        iatf_oem_customers: appData.iatf_oem_customers.filter((c) => c.selected),
        has_other_oem_customers: appData.has_other_oem_customers ?? false,
        other_oem_customers: appData.other_oem_customers,
        proposed_scope: appData.proposed_scope || null,
        outsourced_processes: appData.outsourced_processes || null,
        annex4_eligibility: appData.annex4_eligibility ?? false,
        attachment_base64: appData.attachment_base64 ?? null,
        // last_action_by → FK to auth.users → use auth user.id
        last_action_by: user.id,
        // role from profile (not hardcoded)
        last_action_role: profile.role ?? "cb_admin",
      })
      .select()
      .single();

    if (appError) throw appError;
    const applicationId: string = application.application_id;

    // ── 3. Create primary contact ──────────────────────────────────────────────
    if (data.contact_name && data.contact_email) {
      const { error: contactError } = await supabase.from("contacts").insert({
        application_id: applicationId,
        name: data.contact_name,
        designation: "Primary Contact",
        phone: data.contact_phone || null,
        email: data.contact_email,
      });
      if (contactError) console.warn("Contact insert warning:", contactError);
    }

    // ── 4. Onboarding history ──────────────────────────────────────────────────
    // changed_by → FK to profiles.id → use profile.id (NOT user.id)
    const { error: historyError } = await supabase
      .from("onboarding_history")
      .insert({
        client_id: clientId,
        from_status: null,
        to_status: "application_received",
        changed_by: profile.id,
        notes: "Client onboarding started",
      });

    if (historyError) throw historyError;

    return { client, application_id: applicationId };
  },

  // ─── UPDATE APPLICATION STATUS ─────────────────────────────────────────────
  async updateApplicationStatus(
    id: string,
    payload: { status: string; note?: string; review_document?: string },
  ) {
    const { status, note, review_document } = payload;

    // auth user for last_action_by (→ auth.users), profile for changed_by (→ profiles)
    const [user, profile] = await Promise.all([
      profileService.getAuthUser(),
      profileService.getCurrent(),
    ]);

    const { data: existingApp, error: fetchError } = await supabase
      .from("application_master")
      .select("client_id, status")
      .eq("application_id", id)
      .single();
    if (fetchError) throw fetchError;

    const clientId: string = existingApp.client_id;
    const fromStatus: string =
      existingApp.status === "pending" ? "application_received" : existingApp.status;

    const { data: updatedApp, error: appError } = await supabase
      .from("application_master")
      .update({
        status,
        scheme_comment: note ?? null,
        application_review_document: review_document ?? null,
        updated_at: new Date().toISOString(),
        last_action_by: user.id,     // FK → auth.users
        last_action_role: profile.role ?? "cb_admin",
      })
      .eq("application_id", id)
      .select()
      .single();
    if (appError) throw appError;

    const { error: clientError } = await supabase
      .from("clients")
      .update({ status })
      .eq("id", clientId);
    if (clientError) throw clientError;

    // changed_by → profiles.id
    const { error: historyError } = await supabase
      .from("onboarding_history")
      .insert({
        client_id: clientId,
        from_status: normalizeStatus(fromStatus),
        to_status: normalizeStatus(status),
        changed_by: profile.id,
        notes: note || `Application moved to ${status}`,
      });
    if (historyError) throw historyError;

    return updatedApp;
  },

  // ─── CREATE CONTRACT ────────────────────────────────────────────────────────
  async createContract(payload: CreateContractPayload) {
    const [user, profile] = await Promise.all([
      profileService.getAuthUser(),
      profileService.getCurrent(),
    ]);

    const { application_id, contract_number, start_date, end_date, notes, pdf_base64 } = payload;

    const { data: app, error: appFetchError } = await supabase
      .from("application_master")
      .select("client_id, status")
      .eq("application_id", application_id)
      .single();
    if (appFetchError) throw appFetchError;

    const clientId: string = app.client_id;
    const fromStatus: string = app.status;

    const { data: contract, error: contractError } = await supabase
      .from("contract_master")
      .insert({
        client_id: clientId,
        application_id,
        contract_number,
        start_date: start_date || null,
        end_date: end_date || null,
        status: "contract_draft",
        contract_status: "draft",
        created_by: user.id,
        review_notes: notes ?? null,
        pdf_url: pdf_base64 ?? null,
      })
      .select()
      .single();
    if (contractError) throw contractError;

    await supabase
      .from("application_master")
      .update({ status: "contract_review", updated_at: new Date().toISOString() })
      .eq("application_id", application_id);

    await supabase
      .from("clients")
      .update({ status: "contract_review" })
      .eq("id", clientId);

    // changed_by → profiles.id
    await supabase.from("onboarding_history").insert({
      client_id: clientId,
      from_status: normalizeStatus(fromStatus),
      to_status: "contract_review",
      changed_by: profile.id,
      notes: "Contract created (Draft)",
    });

    return contract;
  },
};

// Backward compatibility shim (legacy callers)
export const updateApplicationStatus = (id: string, payload: any) =>
  clientOnboardingService.updateApplicationStatus(id, payload);
