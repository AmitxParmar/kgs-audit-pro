import { z } from 'zod';
export declare const AuditStatusSchema: z.ZodEnum<["planning", "execution", "review", "completed"]>;
export type AuditStatus = z.infer<typeof AuditStatusSchema>;
export declare const AuditTypeSchema: z.ZodEnum<["iso_9001", "iso_14001", "iso_45001", "iso_27001", "iso_22000", "custom"]>;
export type AuditType = z.infer<typeof AuditTypeSchema>;
export declare const AuditSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    client_id: z.ZodString;
    audit_type: z.ZodEnum<["iso_9001", "iso_14001", "iso_45001", "iso_27001", "iso_22000", "custom"]>;
    status: z.ZodEnum<["planning", "execution", "review", "completed"]>;
    start_date: z.ZodString;
    end_date: z.ZodOptional<z.ZodString>;
    created_by: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "planning" | "execution" | "review" | "completed";
    client_id: string;
    audit_type: "iso_9001" | "iso_14001" | "iso_45001" | "iso_27001" | "iso_22000" | "custom";
    start_date: string;
    created_by: string;
    id?: string | undefined;
    end_date?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}, {
    status: "planning" | "execution" | "review" | "completed";
    client_id: string;
    audit_type: "iso_9001" | "iso_14001" | "iso_45001" | "iso_27001" | "iso_22000" | "custom";
    start_date: string;
    created_by: string;
    id?: string | undefined;
    end_date?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}>;
export type Audit = z.infer<typeof AuditSchema>;
export declare const CreateAuditSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    client_id: z.ZodString;
    audit_type: z.ZodEnum<["iso_9001", "iso_14001", "iso_45001", "iso_27001", "iso_22000", "custom"]>;
    status: z.ZodEnum<["planning", "execution", "review", "completed"]>;
    start_date: z.ZodString;
    end_date: z.ZodOptional<z.ZodString>;
    created_by: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    status: "planning" | "execution" | "review" | "completed";
    client_id: string;
    audit_type: "iso_9001" | "iso_14001" | "iso_45001" | "iso_27001" | "iso_22000" | "custom";
    start_date: string;
    created_by: string;
    end_date?: string | undefined;
}, {
    status: "planning" | "execution" | "review" | "completed";
    client_id: string;
    audit_type: "iso_9001" | "iso_14001" | "iso_45001" | "iso_27001" | "iso_22000" | "custom";
    start_date: string;
    created_by: string;
    end_date?: string | undefined;
}>;
export type CreateAudit = z.infer<typeof CreateAuditSchema>;
export declare const UpdateAuditSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    client_id: z.ZodOptional<z.ZodString>;
    audit_type: z.ZodOptional<z.ZodEnum<["iso_9001", "iso_14001", "iso_45001", "iso_27001", "iso_22000", "custom"]>>;
    status: z.ZodOptional<z.ZodEnum<["planning", "execution", "review", "completed"]>>;
    start_date: z.ZodOptional<z.ZodString>;
    end_date: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    created_by: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "id" | "created_by" | "created_at">, "strip", z.ZodTypeAny, {
    status?: "planning" | "execution" | "review" | "completed" | undefined;
    client_id?: string | undefined;
    audit_type?: "iso_9001" | "iso_14001" | "iso_45001" | "iso_27001" | "iso_22000" | "custom" | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    updated_at?: string | undefined;
}, {
    status?: "planning" | "execution" | "review" | "completed" | undefined;
    client_id?: string | undefined;
    audit_type?: "iso_9001" | "iso_14001" | "iso_45001" | "iso_27001" | "iso_22000" | "custom" | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    updated_at?: string | undefined;
}>;
export type UpdateAudit = z.infer<typeof UpdateAuditSchema>;
//# sourceMappingURL=audit.d.ts.map