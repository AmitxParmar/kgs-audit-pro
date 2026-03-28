import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth';
import { clientService } from './service';

export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await clientService.getClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
};

export const createClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const client = await clientService.createClient(req.body, req.user!.id)
    console.log(' Client created:', client) 
    res.status(201).json(client)
  } catch (error: any) {
    console.error(' CREATE CLIENT ERROR:', error) 
    res.status(500).json({ error: 'Failed to create client', details: error.message || error })
  }
}

export const getClientById = async (req: Request, res: Response) => {
  try {
    const client = await clientService.getClientById(req.params.id);
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch client' });
  }
};

export const updateClient = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const client = await clientService.updateClient(req.params.id, req.body);
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update client' });
  }
};