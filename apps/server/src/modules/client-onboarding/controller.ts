import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth'
import { clientService } from './service'
import { supabase } from '../../config/supabase'

export const getClients = async (req: Request, res: Response) => {
  try {
    

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

    if (error) {
      
      throw error;
    }

    

    res.json(data);
  } catch (error: any) {
   
    res.status(500).json({ error: error.message });
  }
};

export const createClient = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    

    const userId = req.user.id;
    const cb_id = req.user.cb_id;

    const result = await clientService.createClient(
      req.body,
      userId,
      cb_id
    );

    res.status(201).json({
      success: true,
      message: 'Client onboarded successfully',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Failed to onboard client',
      error: error.message,
    });
  }
};


// ✅ GET CLIENT BY ID
export const getClientById = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}

// ✅ UPDATE CLIENT
export const updateClient = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single()

    if (error) throw error

    res.json(data)
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}