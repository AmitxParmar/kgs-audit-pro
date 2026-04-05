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

      // =============================
      // 2️⃣ CREATE APPLICATION
      // =============================
      const { data: application, error: appError } = await supabase
        .from('application_master')
        .insert({
          client_id: clientId,
          application_type: data.application_type,
          standard: data.industry || 'General',
          type_of_audit: 'Registration Audit',
          product_design_responsibility: 'Client Responsible',
          mailing_address: data.address || '',
          registration_site_address: data.address || '',
          manufacturing_sites: data.manufacturing_sites || [],
          remote_locations: data.remote_locations || [],
          working_days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          shifts: [{ start: '08:00', end: '16:00' }],
          status: 'pending',
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