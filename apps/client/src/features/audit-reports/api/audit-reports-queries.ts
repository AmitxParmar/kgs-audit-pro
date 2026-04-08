import { useQuery } from '@tanstack/react-query';
import { auditReportService } from '@/services/auditReportService';
import { auditKeys } from './types';


// data fetching queries with tanstack queries
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
