import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { auditReportService } from '../services/auditReportService';

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

export const useAuditStats = () => {
  return useQuery({
    queryKey: auditKeys.stats(),
    queryFn: auditReportService.getStats,
  });
};

export const useGroupedAudits = (filters?: any) => {
  return useQuery({
    queryKey: auditKeys.grouped(filters),
    queryFn: () => auditReportService.getGroupedAudits(filters),
  });
};

export const useAuditDetail = (id: string) => {
  return useQuery({
    queryKey: auditKeys.detail(id),
    queryFn: () => auditReportService.getAuditById(id),
    enabled: !!id,
  });
};

export const useCreateAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: auditReportService.createAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditKeys.all });
    },
  });
};

export const useStandards = () => {
  return useQuery({
    queryKey: auditKeys.standards(),
    queryFn: auditReportService.getStandards,
  });
};

export const useAuditors = () => {
  return useQuery({
    queryKey: auditKeys.auditors(),
    queryFn: auditReportService.getAuditors,
  });
};

export const useClients = () => {
  return useQuery({
    queryKey: auditKeys.clients(),
    queryFn: auditReportService.getClients,
  });
};

export const useCertificationBodies = () => {
  return useQuery({
    queryKey: auditKeys.certificationBodies(),
    queryFn: auditReportService.getCertificationBodies,
  });
};
