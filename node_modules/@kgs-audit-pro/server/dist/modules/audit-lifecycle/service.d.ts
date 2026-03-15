export interface Audit {
    id?: string;
    client_id: string;
    audit_type: string;
    status: 'planning' | 'execution' | 'review' | 'completed';
    start_date: string;
    end_date?: string;
    created_by: string;
    created_at?: string;
    updated_at?: string;
}
export declare const auditService: {
    getAudits(): Promise<Audit[]>;
    createAudit(auditData: Omit<Audit, "id" | "created_at" | "updated_at">, userId: string): Promise<Audit>;
    getAuditById(id: string): Promise<Audit | null>;
    updateAudit(id: string, auditData: Partial<Audit>, userId: string): Promise<Audit>;
};
//# sourceMappingURL=service.d.ts.map