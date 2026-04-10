import { auditReportService } from "@/services/auditReportService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { auditKeys } from "./types";

export const useCreateAudit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: auditReportService.createAudit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditKeys.all });
    },
  });
};

export const useUpdateAuditReportStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: auditReportService.updateAuditReportStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auditKeys.all });
    },
  });
};