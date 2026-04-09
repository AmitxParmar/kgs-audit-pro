import { supabase } from "@/lib/supabase";

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

export const clientOnboardingService = {
  // ✅ GET ALL CLIENTS
  async getClients() {
    // We explicitly list columns to avoid fetching large base64 attachments in the list view
    const { data, error } = await supabase
      .from("clients")
      .select(`
        id,
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
          created_at,
          updated_at
        )
      `)
      .order("onboarded_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  // ✅ CREATE CLIENT (WITH APPLICATION & CONTACT & HISTORY)
  async create(data: ClientInput) {
    try {
      // 1. Get current user session
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Unauthorized");

       // Get cb_id from user metadata if possible, otherwise use user.id as fallback
      const cb_id = user.user_metadata?.cb_id || user.id;

      // =============================
      // 1️⃣ CREATE CLIENT
      // =============================
      const { data: client, error: clientError } = await supabase
        .from("clients")
        .insert({
          name: data.name,
          cb_id,
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          address: data.address,
          website: data.website,
          industry: data.industry,
          status: "application_received",
        })
        .select()
        .single();

      if (clientError) throw clientError;

      const clientId = client.id;
      const appData = data.application || {};

      // =============================
      // 2️⃣ CREATE APPLICATION
      // =============================
      const { data: application, error: appError } = await supabase
        .from("application_master")
        .insert({
          client_id: clientId,
          application_type: data.application_type,
          standard: appData.applicable_standards?.join(", ") || "General",
          type_of_audit: appData.type_of_audit,
          attachment_base64: appData.attachment_base64,
          product_design_responsibility: appData.product_design_responsibility,
          mailing_address: data.address || "",
          registration_site_address: data.address || "",
          manufacturing_sites: appData.manufacturing_sites || [],
          remote_locations: appData.remote_locations || [],
          iaf_code: appData.iaf_code,
          nace_code: appData.nace_code,
          sic_code: appData.sic_code,
          languages_spoken: appData.languages_spoken,
          shifts: appData.shifts,
          legal_obligations: appData.legal_obligations,
          legal_obligation_details: appData.legal_obligation_details,
          previous_iatf_certified: appData.previous_iatf_certified,
          automotive_customers: appData.automotive_customers,
          iatf_oem_customers: appData.iatf_oem_customers,
          other_oem_customers: appData.other_oem_customers,
          proposed_scope: appData.proposed_scope,
          outsourced_processes: appData.outsourced_processes,
          working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          status: "application_received",
          last_action_by: user.id,
          last_action_role: "cb_admin",
        })
        .select()
        .single();

      if (appError) throw appError;

      // =============================
      // 3️⃣ CREATE CONTACT
      // =============================
      if (data.contact_name && data.contact_email) {
        const { error: contactError } = await supabase
          .from("contacts")
          .insert({
            application_id: application.application_id,
            name: data.contact_name,
            designation: "Primary Contact",
            phone: data.contact_phone || "0",
            email: data.contact_email,
          });

        if (contactError) throw contactError;
      }

      // =============================
      // 4️⃣ ONBOARDING HISTORY ENTRY
      // =============================
      const { error: historyError } = await supabase
        .from("onboarding_history")
        .insert({
          client_id: clientId,
          from_status: null,
          to_status: "application_received",
          changed_by: user.id,
          notes: "Client onboarding started",
        });

      if (historyError) throw historyError;

      return {
        client,
        application_id: application.application_id,
      };
    } catch (error) {
      console.error("FULL ONBOARDING ERROR:", error);
      throw error;
    }
  },

  // ✅ UPDATE APPLICATION STAGE
  async updateApplicationStatus(id: string, payload: { status: string; note?: string; review_document?: string }) {
    const { status, note, review_document } = payload;
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Unauthorized");

      const { data: existingApp, error: fetchError } = await supabase
        .from("application_master")
        .select("client_id, status")
        .eq("application_id", id)
        .single();

      if (fetchError) throw fetchError;

      const clientId = existingApp.client_id;
      const fromStatus = existingApp.status === "pending" ? "application_received" : existingApp.status;

      const { data: updatedApp, error: appError } = await supabase
        .from("application_master")
        .update({
          status,
          scheme_comment: note,
          application_review_document: review_document,
          updated_at: new Date().toISOString(),
          last_action_by: user.id,
        })
        .eq("application_id", id)
        .select()
        .single();

      if (appError) throw appError;

      // Sync status with client record
      const { error: clientError } = await supabase
        .from("clients")
        .update({ status })
        .eq("id", clientId);

      if (clientError) throw clientError;

      // Add to history
      const { error: historyError } = await supabase
        .from("onboarding_history")
        .insert({
          client_id: clientId,
          from_status: fromStatus,
          to_status: status === "pending" ? "application_received" : status,
          changed_by: user.id,
          notes: note || `Application moved to ${status}`,
        });

      if (historyError) throw historyError;

      return updatedApp;
    } catch (error) {
      console.error("Update Status Error:", error);
      throw error;
    }
  },

  // ✅ CREATE CONTRACT
  async createContract(payload: {
    application_id: string;
    contract_number: string;
    start_date?: string;
    end_date?: string;
    notes?: string;
    pdf_base64?: string;
  }) {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("Unauthorized");

      const { application_id, contract_number, start_date, end_date, notes, pdf_base64 } = payload;

      const { data: app, error: appError } = await supabase
        .from("application_master")
        .select("client_id, status")
        .eq("application_id", application_id)
        .single();

      if (appError) throw appError;

      const clientId = app.client_id;
      const fromStatus = app.status;

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
          review_notes: notes,
          pdf_url: pdf_base64,
        })
        .select()
        .single();

      if (contractError) throw contractError;

      // Update application status
      const { error: appUpdateError } = await supabase
        .from("application_master")
        .update({
          status: "contract_review",
          updated_at: new Date().toISOString(),
        })
        .eq("application_id", application_id);

      if (appUpdateError) throw appUpdateError;

      // Update client status
      await supabase.from("clients").update({ status: "contract_review" }).eq("id", clientId);

      // Add to history
      await supabase.from("onboarding_history").insert({
        client_id: clientId,
        from_status: fromStatus,
        to_status: "contract_review",
        changed_by: user.id,
        notes: "Contract created (Draft)",
      });

      return contract;
    } catch (error) {
      console.error("Create Contract Error:", error);
      throw error;
    }
  }
};

// Backward compatibility (optional, since many components use this export)
export const updateApplicationStatus = (id: string, payload: any) => 
  clientOnboardingService.updateApplicationStatus(id, payload);