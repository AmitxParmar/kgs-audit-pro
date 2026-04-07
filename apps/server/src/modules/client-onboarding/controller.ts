import { Request, Response } from 'express'
import { clientService } from './service'
import { supabase } from '../../config/supabase'

// ✅ GET ALL CLIENTS
export const getClients = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        application_master (*)
      `)
      .order('onboarded_at', { ascending: false });

    if (error) throw error;

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ CREATE CLIENT
export const createClient = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;
    const cb_id = req.user.cb_id;

    const result = await clientService.createClient(
      req.body,
      userId,
      cb_id
    );

    return res.status(201).json({
      success: true,
      message: 'Client onboarded successfully',
      data: result,
    });
  } catch (error: any) {
    return res.status(500).json({
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
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE CLIENT
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('clients')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ UPDATE APPLICATION STAGE
export const updateApplicationStage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, note, review_document } = req.body;

    const allowedStatuses = [
      "application_received",
      "application_review",
      "contract_creation",
      "contract_review",
      "contract_sent",
      "contract_signed",
      "completed",
    ];

    if (!allowedStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    const { data: existingApp, error: fetchError } = await supabase
      .from("application_master")
      .select("client_id, status")
      .eq("application_id", id)
      .single();

    if (fetchError) throw fetchError;

    const clientId = existingApp.client_id;

    const fromStatus =
      existingApp.status === "pending"
        ? "application_received"
        : existingApp.status;

    const { data: updatedApp, error: appError } = await supabase
      .from("application_master")
      .update({
        status,
        scheme_comment: note,
        application_review_document: review_document,
        updated_at: new Date(),
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

    const { error: historyError } = await supabase
      .from("onboarding_history")
      .insert({
        client_id: clientId,
        from_status: fromStatus,
        to_status: status === "pending" ? "application_received" : status,
        notes: note || "Moved to Application Review",
      });

    if (historyError) throw historyError;

    return res.json(updatedApp);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// ✅ CREATE CONTRACT
export const createContract = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    const {
      application_id,
      contract_number,
      start_date,
      end_date,
      notes,
      pdf_base64,
    } = req.body;

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
        created_by: userId,
        review_notes: notes,
        pdf_url: pdf_base64,
      })
      .select()
      .single();

    if (contractError) throw contractError;

    const { error: appUpdateError } = await supabase
      .from("application_master")
      .update({
        status: "contract_review",
        updated_at: new Date(),
      })
      .eq("application_id", application_id);

    if (appUpdateError) throw appUpdateError;

    const { error: clientError } = await supabase
      .from("clients")
      .update({ status: "contract_review" })
      .eq("id", clientId);

    if (clientError) throw clientError;

    const { error: historyError } = await supabase
      .from("onboarding_history")
      .insert({
        client_id: clientId,
        from_status: fromStatus,
        to_status: "contract_review",
        changed_by: userId,
        notes: "Contract created (Draft)",
      });

    if (historyError) throw historyError;

    return res.status(201).json(contract);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};