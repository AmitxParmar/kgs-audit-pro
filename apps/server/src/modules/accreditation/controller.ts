import { Request, Response } from 'express'

import { DocumentRepositoryService } from './documentService'
import { supabaseAdmin } from '../../config/supabase'

const documentService = new DocumentRepositoryService()

export const upload = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const result = await documentService.upload({
      cbId: req.user!.cb_id,
      docType: 'internal',
      category: req.body.category,
      title: req.body.title,
      version: req.body.version,
      fileBuffer: req.file.buffer,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      uploadedBy: req.user!.id
    })

    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document' })
  }
}

export const addExternalLink = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await documentService.addExternalLink({
      cbId: req.user!.cb_id,
      title: req.body.title,
      category: req.body.category,
      source: req.body.source,
      externalUrl: req.body.externalUrl,
      issueDate: req.body.issueDate,
      expiryDate: req.body.expiryDate,
      uploadedBy: req.user!.id
    })

    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to add external link' })
  }
}

export const getMasterList = async (req: Request, res: Response): Promise<void> => {
  try {
    const { docType } = req.query
    const result = await documentService.getMasterList(
      req.user!.cb_id,
      docType as 'internal' | 'external'
    )
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' })
  }
}

export const getSignedUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    // First get document to find storage path
    const { data: document } = await supabaseAdmin
      .from('documents')
      .select('storage_path')
      .eq('id', id)
      .single()

    if (!document) {
      res.status(404).json({ error: 'Document not found' })
      return
    }

    const signedUrl = await documentService.getSignedUrl(document.storage_path)
    res.json({ signedUrl })
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate signed URL' })
  }
}

export const softDelete = async (req: Request, res: Response): Promise<void> => {
  try {
    await documentService.softDelete(req.params.id)
    res.json({ message: 'Document moved to recycle bin' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' })
  }
}

export const restore = async (req: Request, res: Response): Promise<void> => {
  try {
    await documentService.restore(req.params.id)
    res.json({ message: 'Document restored' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to restore document' })
  }
}

export const getRecycleBin = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await documentService.getRecycleBin(req.user!.cb_id)
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recycle bin' })
  }
}
