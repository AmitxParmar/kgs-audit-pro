import { supabase } from '../../config/supabase'

export interface ClientInput {
  name: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  address?: string
  industry?: string
  website?: string
  manufacturing_sites?: any[]
  remote_locations?: any[]
   application_type?: string

   application?: any
}

export const clientService = {
  async createClient(data: ClientInput, userId: string, cb_id: string) {
    try {
      // =============================
      // 1️⃣ CREATE CLIENT
      // =============================
      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: data.name,
          cb_id,
          contact_name: data.contact_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone,
          address: data.address,
          website: data.website,
          industry: data.industry,
          status: 'application_received',
        })
        .select()
        .single()

      if (clientError) throw clientError

      const clientId = client.id
      const app = data.application || {}

      // =============================
      // 2️⃣ CREATE APPLICATION
      // =============================
    const { data: application, error: appError } = await supabase
  .from('application_master')
  .insert({
    client_id: clientId,
    application_type: data.application_type,

    // ✅ FROM FRONTEND
    standard: app.applicable_standards?.join(", ") || 'General',
    type_of_audit: app.type_of_audit,
     attachment_base64: app.attachment_base64,
    product_design_responsibility: app.product_design_responsibility,

    mailing_address: data.address || '',
    registration_site_address: data.address || '',

    manufacturing_sites: app.manufacturing_sites || [],
    remote_locations: app.remote_locations || [],

    iaf_code: app.iaf_code,
    nace_code: app.nace_code,
    sic_code: app.sic_code,

    languages_spoken: app.languages_spoken,
    shifts: app.shifts,

    legal_obligations: app.legal_obligations,
    legal_obligation_details: app.legal_obligation_details,

    previous_iatf_certified: app.previous_iatf_certified,

    automotive_customers: app.automotive_customers,
    iatf_oem_customers: app.iatf_oem_customers,
    other_oem_customers: app.other_oem_customers,

    proposed_scope: app.proposed_scope,
    outsourced_processes: app.outsourced_processes,

    working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],

    status: 'application_received',
    last_action_by: userId,
    last_action_role: 'cb_admin',
  })
  .select()
  .single()

      if (appError) throw appError

      // =============================
      // 3️⃣ CREATE CONTACT
      // =============================
      if (data.contact_name && data.contact_email) {
        const { error: contactError } = await supabase
          .from('contacts') // ✅ FIXED lowercase table
          .insert({
            application_id: application.application_id,
            name: data.contact_name,
            designation: 'Primary Contact',
            phone: Number(data.contact_phone || 0),
            email: data.contact_email,
          })

        if (contactError) throw contactError
      }

      // =============================
      // 4️⃣ ONBOARDING HISTORY ENTRY
      // =============================
      const { error: historyError } = await supabase
        .from('onboarding_history')
        .insert({
          client_id: clientId,
          from_status: null,
          to_status: 'application_received',
          changed_by: userId,
          notes: 'Client onboarding started',
        })

      if (historyError) throw historyError

      // =============================
      // FINAL RESPONSE
      // =============================
      return {
        client,
        application_id: application.application_id,
      }

    } catch (error) {
      console.error(' FULL ONBOARDING ERROR:', error)
      throw error
    }
  },
}