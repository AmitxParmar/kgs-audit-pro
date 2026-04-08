import { supabase } from '../lib/supabase';

export const auditReportService = {
  getStats: async () => {
    const { data, error } = await supabase
      .from("audits")
      .select("status");

    if (error) throw error;

    // Aggregate counts by status
    const stats: Record<string, number> = {};
    data.forEach((audit) => {
      stats[audit.status] = (stats[audit.status] || 0) + 1;
    });

    return stats;
  },

  getGroupedAudits: async (filters?: {
    clientId?: string;
    cbId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }, limit?: number) => {
    let query = supabase.from("audits").select(`
      *,
      client:client_id(name),
      lead_auditor:lead_auditor_id(full_name),
      standard:standard_id(code)
    `);

    if (filters?.clientId) query = query.eq("client_id", filters.clientId);
    if (filters?.cbId) query = query.eq("cb_id", filters.cbId);
    if (filters?.status) query = query.eq("status", filters.status);
    if (filters?.fromDate) query = query.gte("planned_date", filters.fromDate);
    if (filters?.toDate) query = query.lte("planned_date", filters.toDate);
    if (limit) query = query.limit(limit);

    const { data, error } = await query;
    if (error) throw error;

    const grouped: Record<string, any[]> = {};
    data.forEach((audit) => {
      if (!grouped[audit.status]) grouped[audit.status] = [];
      grouped[audit.status].push(audit);
    });

    return grouped;
  },

  getAuditById: async (id: string) => {
    const { data, error } = await supabase
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  createAudit: async (payload: any) => {
    const { data, error } = await supabase
      .from("audits")
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  getStandards: async () => {
    const { data, error } = await supabase
      .from("audit_standards")
      .select("id, code")
      .order("code");
    if (error) throw error;
    return data;
  },

  getAuditors: async () => {
    const { data, error } = await supabase
      .from("auditor_profiles")
      .select(`
        id,
        user:user_id (
          full_name,
          email
        )
      `)
      .order("user_id");

    if (error) throw error;
    
    // Flatten the result to match the expected UI structure
    return data.map((profile: any) => ({
      id: profile.id,
      full_name: profile.user?.full_name || "Unknown",
      email: profile.user?.email || "N/A"
    }));
  },

  getClients: async () => {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        application_master (
          application_type,
          status
        )
      `)
      .order('onboarded_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getCertificationBodies: async () => {
    const { data, error } = await supabase
      .from("certification_bodies")
      .select("id, name, accred_no, country, status")
      .order("name");

    if (error) throw error;
    return data;
  },
};
