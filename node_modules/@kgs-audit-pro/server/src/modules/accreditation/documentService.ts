// apps/server/src/modules/accreditation/documentService.ts
import { supabaseAdmin } from '../../config/supabase';

export class DocumentRepositoryService {

  /** Upload a new document (internal or external file) */
  async upload(opts: {
    cbId:       string;
    docType:    'internal' | 'external';
    category:   string;
    title:      string;
    version?:   string;
    source?:    string;       // external: issuing body
    issueDate?: string;
    expiryDate?: string;
    fileBuffer: Buffer;
    fileName:   string;
    mimeType:   string;
    uploadedBy: string;
  }) {
    const bucket = opts.docType === 'internal' ? 'internal-docs' : 'external-docs';
    const path   = `${opts.cbId}/${opts.category}/${Date.now()}_${opts.fileName}`;

    const { error: storageErr } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, opts.fileBuffer, { contentType: opts.mimeType });

    if (storageErr) throw new Error(storageErr.message);

    const { data, error } = await supabaseAdmin
      .from('documents')
      .insert({
        cb_id:        opts.cbId,
        title:        opts.title,
        doc_type:     opts.docType,
        category:     opts.category,
        version:      opts.version ?? '1.0',
        source:       opts.source,
        issue_date:   opts.issueDate,
        expiry_date:  opts.expiryDate,
        storage_path: `${bucket}/${path}`,
        uploaded_by:  opts.uploadedBy,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /** Add an external document by URL (no file upload) */
  async addExternalLink(opts: {
    cbId:        string;
    title:       string;
    category:    string;
    source:      string;
    externalUrl: string;
    issueDate?:  string;
    expiryDate?: string;
    uploadedBy:  string;
  }) {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .insert({
        cb_id:        opts.cbId,
        title:        opts.title,
        doc_type:     'external',
        category:     opts.category,
        source:       opts.source,
        external_url: opts.externalUrl,
        issue_date:   opts.issueDate,
        expiry_date:  opts.expiryDate,
        uploaded_by:  opts.uploadedBy,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  /** Master list for a CB — filtered by type */
  async getMasterList(cbId: string, docType?: 'internal' | 'external') {
    let query = supabaseAdmin
      .from('document_master_list')
      .select('*')
      .eq('cb_id', cbId);

    if (docType) query = query.eq('doc_type', docType);
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  /** Generate a time-limited signed URL for private file access */
  async getSignedUrl(storagePath: string, expiresInSeconds = 3600) {
    const [bucket, ...rest] = storagePath.split('/');
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .createSignedUrl(rest.join('/'), expiresInSeconds);

    if (error) throw new Error(error.message);
    return data.signedUrl;
  }

  /** Soft delete → moves to recycle bin */
  async softDelete(documentId: string) {
    const { error } = await supabaseAdmin
      .from('documents')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', documentId);

    if (error) throw new Error(error.message);
  }

  /** Restore from recycle bin */
  async restore(documentId: string) {
    const { error } = await supabaseAdmin
      .from('documents')
      .update({ deleted_at: null })
      .eq('id', documentId);

    if (error) throw new Error(error.message);
  }

  /** Hard purge (super_admin only, permanent) */
  async permanentDelete(documentId: string, storagePath: string | null) {
    if (storagePath) {
      const [bucket, ...rest] = storagePath.split('/');
      await supabaseAdmin.storage.from(bucket).remove([rest.join('/')]);
    }
    await supabaseAdmin.from('documents').delete().eq('id', documentId);
  }

  /** Recycle bin — deleted docs for a CB */
  async getRecycleBin(cbId: string) {
    const { data, error } = await supabaseAdmin
      .from('documents')
      .select('*')
      .eq('cb_id', cbId)
      .not('deleted_at', 'is', null)
      .order('deleted_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }
}