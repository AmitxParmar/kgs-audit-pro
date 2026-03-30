import { supabase } from '../../config/supabase';

export interface Client {
  id?: string;
  company_name: string;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  address?: string;
  industry?: string;
  website?: string;
  manufacturing_sites?: any;
  remote_locations?: any;
  created_by?: string;
  assigned_to?: string;
  initial_status?: 'application_received' | string;
}

export const clientService = {
  async createClient(clientData: Client, userId: string): Promise<any> {
    // 1️⃣ Insert into clients
   const { data: client, error: clientError } = await supabase
  .from('clients')
  .insert({
    ...clientData,
    created_by: userId,
    status: clientData.initial_status || 'application_received',
  })
  .select()
  .single()

if (clientError) {
  console.error('❌ Client insert error:', clientError)  // <- ADD THIS
  throw clientError
}
console.log('✅ Client inserted successfully:', client)  // <- ADD THIS

    const clientId = client.id;

    // 2️⃣ Insert into onboarding_history
    await supabase.from('onboarding_history').insert({
      client_id: clientId,
      from_status: null,
      to_status: client.status,
      changed_by: userId,
      notes: 'Initial application received',
    });

    // 3️⃣ Insert into application_master
    const { data: application, error: appError } = await supabase
      .from('application_master')
      .insert({
        client_id: clientId,
        standard: clientData.industry || 'N/A',
        type_of_audit: 'Registration Audit',
        product_design_responsibility: 'Client Responsible',
        mailing_address: clientData.address || '',
        registration_site_address: clientData.address || '',
        manufacturing_sites: clientData.manufacturing_sites || [],
        remote_locations: clientData.remote_locations || [],
        working_days: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
        shifts: [{ start: '08:00', end: '16:00' }],
        status: 'pending',
      })
      .select()
      .single();

    if (appError) throw appError;

    // 4️⃣ Insert into Contacts
    if (clientData.contact_name && clientData.contact_email) {
      await supabase.from('Contacts').insert({
        application_id: application.application_id, // link to application_master
        Name: clientData.contact_name,
        Designation: 'Primary Contact',
        Phone: clientData.contact_phone || 0,
        Email: clientData.contact_email,
      });
    }

    // 5️⃣ Return client info along with application_id
    return { ...client, application_id: application.application_id };
  },

  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getClientById(id: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return null;
    return data;
  },

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({ ...clientData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};