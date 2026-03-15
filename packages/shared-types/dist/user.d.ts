import { z } from 'zod';
export declare const UserRoleSchema: z.ZodEnum<["admin", "auditor", "audit_manager", "client", "viewer"]>;
export type UserRole = z.infer<typeof UserRoleSchema>;
export declare const UserSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<["admin", "auditor", "audit_manager", "client", "viewer"]>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    role: "admin" | "auditor" | "audit_manager" | "client" | "viewer";
    is_active: boolean;
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}, {
    name: string;
    email: string;
    role: "admin" | "auditor" | "audit_manager" | "client" | "viewer";
    id?: string | undefined;
    created_at?: string | undefined;
    updated_at?: string | undefined;
    is_active?: boolean | undefined;
}>;
export type User = z.infer<typeof UserSchema>;
export declare const CreateUserSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    name: z.ZodString;
    role: z.ZodEnum<["admin", "auditor", "audit_manager", "client", "viewer"]>;
    is_active: z.ZodDefault<z.ZodBoolean>;
    created_at: z.ZodOptional<z.ZodString>;
    updated_at: z.ZodOptional<z.ZodString>;
}, "id" | "created_at" | "updated_at">, "strip", z.ZodTypeAny, {
    name: string;
    email: string;
    role: "admin" | "auditor" | "audit_manager" | "client" | "viewer";
    is_active: boolean;
}, {
    name: string;
    email: string;
    role: "admin" | "auditor" | "audit_manager" | "client" | "viewer";
    is_active?: boolean | undefined;
}>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
export declare const UpdateUserSchema: z.ZodObject<Omit<{
    id: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    email: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["admin", "auditor", "audit_manager", "client", "viewer"]>>;
    is_active: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    created_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    updated_at: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "id" | "created_at">, "strip", z.ZodTypeAny, {
    updated_at?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    role?: "admin" | "auditor" | "audit_manager" | "client" | "viewer" | undefined;
    is_active?: boolean | undefined;
}, {
    updated_at?: string | undefined;
    name?: string | undefined;
    email?: string | undefined;
    role?: "admin" | "auditor" | "audit_manager" | "client" | "viewer" | undefined;
    is_active?: boolean | undefined;
}>;
export type UpdateUser = z.infer<typeof UpdateUserSchema>;
//# sourceMappingURL=user.d.ts.map