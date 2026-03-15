"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = void 0;
const supabase_1 = require("../../config/supabase");
exports.auditService = {
    async getAudits() {
        const { data, error } = await supabase_1.supabase
            .from('audits')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data || [];
    },
    async createAudit(auditData, userId) {
        const { data, error } = await supabase_1.supabase
            .from('audits')
            .insert({
            ...auditData,
            created_by: userId
        })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    },
    async getAuditById(id) {
        const { data, error } = await supabase_1.supabase
            .from('audits')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            return null;
        return data;
    },
    async updateAudit(id, auditData, userId) {
        const { data, error } = await supabase_1.supabase
            .from('audits')
            .update({
            ...auditData,
            updated_at: new Date().toISOString()
        })
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
};
//# sourceMappingURL=service.js.map