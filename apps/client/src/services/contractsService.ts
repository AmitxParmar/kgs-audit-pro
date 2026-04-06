import { apiFetch } from "./api";

export const contractsService = {
  create: (payload: any) =>
    apiFetch("/api/contracts", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getAll: () => apiFetch("/api/contracts"),
  getById: (id: string) => apiFetch(`/api/contracts/${id}`),
  update: (id: string, payload: any) =>
    apiFetch(`/api/contracts/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
};
