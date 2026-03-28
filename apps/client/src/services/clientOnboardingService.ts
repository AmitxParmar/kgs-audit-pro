
import { apiFetch } from './api'

export const clientOnboardingService = {
  create: (payload: any) =>
    apiFetch('/api/client-onboarding', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getAll: () =>
    apiFetch('/api/client-onboarding')
}