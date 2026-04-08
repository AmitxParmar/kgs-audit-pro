export const auditKeys = {
  all: ['audits'] as const,
  stats: () => [...auditKeys.all, 'stats'] as const,
  grouped: (filters?: any) => [...auditKeys.all, 'grouped', filters] as const,
  detail: (id: string) => [...auditKeys.all, 'detail', id] as const,
  standards: () => [...auditKeys.all, 'standards'] as const,
  auditors: () => [...auditKeys.all, 'auditors'] as const,
  clients: () => [...auditKeys.all, 'clients'] as const,
  certificationBodies: () => [...auditKeys.all, 'certificationBodies'] as const,
};