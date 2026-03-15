import { z } from 'zod';
export declare const DocumentTypeSchema: z.ZodEnum<["audit_report", "certificate", "evidence", "procedure", "form", "photo", "other"]>;
export type DocumentType = z.infer<typeof DocumentTypeSchema>;
export declare const DocumentSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    type: z.ZodEnum<["audit_report", "certificate", "evidence", "procedure", "form", "photo", "other"]>;
    file_path: z.ZodString;
    file_size: z.ZodNumber;
    mime_type: z.ZodString;
    audit_id: z.ZodOptional<z.ZodString>;
    uploaded_by: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "audit_report" | "certificate" | "evidence" | "procedure" | "form" | "photo" | "other";
    name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    uploaded_by: string;
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    audit_id?: string | undefined;
}, {
    type: "audit_report" | "certificate" | "evidence" | "procedure" | "form" | "photo" | "other";
    name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    uploaded_by: string;
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    audit_id?: string | undefined;
}>;
export type Document = z.infer<typeof DocumentSchema>;
export declare const CreateDocumentSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    name: z.ZodString;
    type: z.ZodEnum<["audit_report", "certificate", "evidence", "procedure", "form", "photo", "other"]>;
    file_path: z.ZodString;
    file_size: z.ZodNumber;
    mime_type: z.ZodString;
    audit_id: z.ZodOptional<z.ZodString>;
    uploaded_by: z.ZodString;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    type: "audit_report" | "certificate" | "evidence" | "procedure" | "form" | "photo" | "other";
    name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    uploaded_by: string;
    audit_id?: string | undefined;
}, {
    type: "audit_report" | "certificate" | "evidence" | "procedure" | "form" | "photo" | "other";
    name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    uploaded_by: string;
    audit_id?: string | undefined;
}>;
export type CreateDocument = z.infer<typeof CreateDocumentSchema>;
export declare const UpdateDocumentSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["audit_report", "certificate", "evidence", "procedure", "form", "photo", "other"]>>;
    file_path: z.ZodOptional<z.ZodString>;
    file_size: z.ZodOptional<z.ZodNumber>;
    mime_type: z.ZodOptional<z.ZodString>;
    audit_id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    uploaded_by: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "id" | "created_at" | "uploaded_by">, "strip", z.ZodTypeAny, {
    type?: "audit_report" | "certificate" | "evidence" | "procedure" | "form" | "photo" | "other" | undefined;
    updated_at?: string | undefined;
    name?: string | undefined;
    file_path?: string | undefined;
    file_size?: number | undefined;
    mime_type?: string | undefined;
    audit_id?: string | undefined;
}, {
    type?: "audit_report" | "certificate" | "evidence" | "procedure" | "form" | "photo" | "other" | undefined;
    updated_at?: string | undefined;
    name?: string | undefined;
    file_path?: string | undefined;
    file_size?: number | undefined;
    mime_type?: string | undefined;
    audit_id?: string | undefined;
}>;
export type UpdateDocument = z.infer<typeof UpdateDocumentSchema>;
//# sourceMappingURL=document.d.ts.map