import axios from 'axios';
import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export const auditReportService = {
  getStats: async () => {
    const { data } = await api.get('/api/audit-report/stats');
    return data.data;
  },

  getGroupedAudits: async (params?: any) => {
    const { data } = await api.get('/api/audit-report/grouped', { params });
    return data.data;
  },

  getAuditById: async (id: string) => {
    const { data } = await api.get(`/api/audit-report/${id}`);
    return data.data;
  },

  createAudit: async (payload: any) => {
    const { data } = await api.post('/api/audit-report', payload);
    return data.data;
  },

  getStandards: async () => {
    const { data } = await api.get('/api/audit-report/standards');
    return data.data;
  },

  getAuditors: async () => {
    const { data } = await api.get('/api/audit-report/auditors');
    return data.data;
  },

  getClients: async () => {
    const { data } = await api.get('/api/client-onboarding');
    // client-onboarding returns a plain array, not the { data } wrapper
    return data;
  },
//TODO: separate this later into separate query (eg. cb-queries.ts)
  getCertificationBodies: async () => {
    const { data } = await api.get('/api/certification-bodies');
    return data.data;
  },
};
