"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAudit = exports.getAuditById = exports.createAudit = exports.getAudits = void 0;
const service_1 = require("./service");
const getAudits = async (req, res) => {
    try {
        const audits = await service_1.auditService.getAudits();
        res.json(audits);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch audits' });
    }
};
exports.getAudits = getAudits;
const createAudit = async (req, res) => {
    try {
        const audit = await service_1.auditService.createAudit(req.body, req.user.id);
        res.status(201).json(audit);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create audit' });
    }
};
exports.createAudit = createAudit;
const getAuditById = async (req, res) => {
    try {
        const audit = await service_1.auditService.getAuditById(req.params.id);
        if (!audit) {
            res.status(404).json({ error: 'Audit not found' });
            return;
        }
        res.json(audit);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch audit' });
    }
};
exports.getAuditById = getAuditById;
const updateAudit = async (req, res) => {
    try {
        const audit = await service_1.auditService.updateAudit(req.params.id, req.body, req.user.id);
        res.json(audit);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update audit' });
    }
};
exports.updateAudit = updateAudit;
//# sourceMappingURL=controller.js.map