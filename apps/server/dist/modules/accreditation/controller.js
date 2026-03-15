"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecycleBin = exports.restore = exports.softDelete = exports.getSignedUrl = exports.getMasterList = exports.addExternalLink = exports.upload = void 0;
const documentService_1 = require("./documentService");
const supabase_1 = require("../../config/supabase");
const documentService = new documentService_1.DocumentRepositoryService();
const upload = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }
        const result = await documentService.upload({
            cbId: req.user.cb_id,
            docType: 'internal',
            category: req.body.category,
            title: req.body.title,
            version: req.body.version,
            fileBuffer: req.file.buffer,
            fileName: req.file.originalname,
            mimeType: req.file.mimetype,
            uploadedBy: req.user.id
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to upload document' });
    }
};
exports.upload = upload;
const addExternalLink = async (req, res) => {
    try {
        const result = await documentService.addExternalLink({
            cbId: req.user.cb_id,
            title: req.body.title,
            category: req.body.category,
            source: req.body.source,
            externalUrl: req.body.externalUrl,
            issueDate: req.body.issueDate,
            expiryDate: req.body.expiryDate,
            uploadedBy: req.user.id
        });
        res.status(201).json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to add external link' });
    }
};
exports.addExternalLink = addExternalLink;
const getMasterList = async (req, res) => {
    try {
        const { docType } = req.query;
        const result = await documentService.getMasterList(req.user.cb_id, docType);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};
exports.getMasterList = getMasterList;
const getSignedUrl = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: document } = await supabase_1.supabaseAdmin
            .from('documents')
            .select('storage_path')
            .eq('id', id)
            .single();
        if (!document) {
            res.status(404).json({ error: 'Document not found' });
            return;
        }
        const signedUrl = await documentService.getSignedUrl(document.storage_path);
        res.json({ signedUrl });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to generate signed URL' });
    }
};
exports.getSignedUrl = getSignedUrl;
const softDelete = async (req, res) => {
    try {
        await documentService.softDelete(req.params.id);
        res.json({ message: 'Document moved to recycle bin' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete document' });
    }
};
exports.softDelete = softDelete;
const restore = async (req, res) => {
    try {
        await documentService.restore(req.params.id);
        res.json({ message: 'Document restored' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to restore document' });
    }
};
exports.restore = restore;
const getRecycleBin = async (req, res) => {
    try {
        const result = await documentService.getRecycleBin(req.user.cb_id);
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch recycle bin' });
    }
};
exports.getRecycleBin = getRecycleBin;
//# sourceMappingURL=controller.js.map