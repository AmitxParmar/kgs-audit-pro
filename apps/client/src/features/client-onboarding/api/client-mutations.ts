import { clientOnboardingService } from "@/services/clientOnboardingService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { CLIENTS_QUERY_KEY } from "./client-queries";

import type {
  OnboardClientPayload,
  UpdateApplicationStatusPayload,
  CreateContractPayload,
} from "./types";


// ─── Onboard a new client ─────────────────────────────────────────────────────

export const useOnboardClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OnboardClientPayload) =>
      clientOnboardingService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast.success("Client onboarded successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to onboard client");
    },
  });
};

// ─── Update application status ────────────────────────────────────────────────

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateApplicationStatusPayload;
    }) => clientOnboardingService.updateApplicationStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast.success("Status updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update status");
    },
  });
};

// ─── Create contract ──────────────────────────────────────────────────────────

export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateContractPayload) =>
      clientOnboardingService.createContract(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLIENTS_QUERY_KEY });
      toast.success("Contract created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create contract");
    },
  });
};