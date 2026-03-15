import { supabase } from '../../config/supabase'

export interface Audit {
  id?: string
  client_id: string
  audit_type: string
  status: 'planning' | 'execution' | 'review' | 'completed'
  start_date: string
  end_date?: string
  created_by: string
  created_at?: string
  updated_at?: string
}

export const auditService = {
  async getAudits(): Promise<Audit[]> {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  async createAudit(auditData: Omit<Audit, 'id' | 'created_at' | 'updated_at'>, userId: string): Promise<Audit> {
    const { data, error } = await supabase
      .from('audits')
      .insert({
        ...auditData,
        created_by: userId
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getAuditById(id: string): Promise<Audit | null> {
    const { data, error } = await supabase
      .from('audits')
      .select('*')
      .eq('id', id)
      .single()

    if (error) return null
    return data
  },

  async updateAudit(id: string, auditData: Partial<Audit>, userId: string): Promise<Audit> {
    const { data, error } = await supabase
      .from('audits')
      .update({
        ...auditData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
