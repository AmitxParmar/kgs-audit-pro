import { apiFetch } from "./api";

export const clientOnboardingService = {
  create: (payload: any) =>
    apiFetch("/api/client-onboarding", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

export const updateApplicationStatus = (id: string, payload: any) =>
  apiFetch(`/api/client-onboarding/application/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });