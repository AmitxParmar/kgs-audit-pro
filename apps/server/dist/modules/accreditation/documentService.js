"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentRepositoryService = void 0;
const supabase_1 = require("../../config/supabase");
class DocumentRepositoryService {
    async upload(opts) {
        const bucket = opts.docType === 'internal' ? 'internal-docs' : 'external-docs';
        const path = `${opts.cbId}/${opts.category}/${Date.now()}_${opts.fileName}`;
        const { error: storageErr } = await supabase_1.supabaseAdmin.storage
            .from(bucket)
            .upload(path, opts.fileBuffer, { contentType: opts.mimeType });
        if (storageErr)
            throw new Error(storageErr.message);
        const { data, error } = await supabase_1.supabaseAdmin
            .from('documents')
            .insert({
            cb_id: opts.cbId,
            title: opts.title,
            doc_type: opts.docType,
            category: opts.category,
            version: opts.version ?? '1.0',
            source: opts.source,
            issue_date: opts.issueDate,
            expiry_date: opts.expiryDate,
            storage_path: `${bucket}/${path}`,
            uploaded_by: opts.uploadedBy,
        })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async addExternalLink(opts) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from('documents')
            .insert({
            cb_id: opts.cbId,
            title: opts.title,
            doc_type: 'external',
            category: opts.category,
            source: opts.source,
            external_url: opts.externalUrl,
            issue_date: opts.issueDate,
            expiry_date: opts.expiryDate,
            uploaded_by: opts.uploadedBy,
        })
            .select()
            .single();
        if (error)
            throw new Error(error.message);
        return data;
    }
    async getMasterList(cbId, docType) {
        let query = supabase_1.supabaseAdmin
            .from('document_master_list')
            .select('*')
            .eq('cb_id', cbId);
        if (docType)
            query = query.eq('doc_type', docType);
        const { data, error } = await query;
        if (error)
            throw new Error(error.message);
        return data;
    }
    async getSignedUrl(storagePath, expiresInSeconds = 3600) {
        const [bucket, ...rest] = storagePath.split('/');
        const { data, error } = await supabase_1.supabaseAdmin.storage
            .from(bucket)
            .createSignedUrl(rest.join('/'), expiresInSeconds);
        if (error)
            throw new Error(error.message);
        return data.signedUrl;
    }
    async softDelete(documentId) {
        const { error } = await supabase_1.supabaseAdmin
            .from('documents')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', documentId);
        if (error)
            throw new Error(error.message);
    }
    async restore(documentId) {
        const { error } = await supabase_1.supabaseAdmin
            .from('documents')
            .update({ deleted_at: null })
            .eq('id', documentId);
        if (error)
            throw new Error(error.message);
    }
    async permanentDelete(documentId, storagePath) {
        if (storagePath) {
            const [bucket, ...rest] = storagePath.split('/');
            await supabase_1.supabaseAdmin.storage.from(bucket).remove([rest.join('/')]);
        }
        await supabase_1.supabaseAdmin.from('documents').delete().eq('id', documentId);
    }
    async getRecycleBin(cbId) {
        const { data, error } = await supabase_1.supabaseAdmin
            .from('documents')
            .select('*')
            .eq('cb_id', cbId)
            .not('deleted_at', 'is', null)
            .order('deleted_at', { ascending: false });
        if (error)
            throw new Error(error.message);
        return data;
    }
}
exports.DocumentRepositoryService = DocumentRepositoryService;
//# sourceMappingURL=documentService.js.map