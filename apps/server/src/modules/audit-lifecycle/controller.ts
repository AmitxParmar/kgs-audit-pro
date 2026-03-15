import { Request, Response } from 'express'
import { AuthenticatedRequest } from '../../middleware/auth'
import { createError } from '../../middleware/errorHandler'
import { auditService } from './service'

export const getAudits = async (req: Request, res: Response): Promise<void> => {
  try {
    const audits = await auditService.getAudits()
    res.json(audits)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audits' })
  }
}

export const createAudit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const audit = await auditService.createAudit(req.body, req.user!.id)
    res.status(201).json(audit)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create audit' })
  }
}

export const getAuditById = async (req: Request, res: Response): Promise<void> => {
  try {
    const audit = await auditService.getAuditById(req.params.id)
    if (!audit) {
      res.status(404).json({ error: 'Audit not found' })
      return
    }
    res.json(audit)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch audit' })
  }
}

export const updateAudit = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const audit = await auditService.updateAudit(req.params.id, req.body, req.user!.id)
    res.json(audit)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update audit' })
  }
}
