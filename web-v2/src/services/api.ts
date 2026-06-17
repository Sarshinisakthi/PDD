import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({ baseURL: API_BASE });

// Attach Bearer token on every request
apiClient.interceptors.request.use(async (config) => {
  const { token, refreshToken } = useAuthStore.getState();
  const activeToken = token || (await refreshToken());
  if (activeToken) config.headers.Authorization = `Bearer ${activeToken}`;
  return config;
});

// =====================
// Health Data
// =====================
export const fetchLatestVitals = () => apiClient.get('/health/latest').then(r => r.data);
export const fetchHealthHistory = () => apiClient.get('/health').then(r => r.data);
export const simulateVitals = () => apiClient.post('/health/simulate').then(r => r.data);
export const addManualVitals = (payload: object) => apiClient.post('/health', payload).then(r => r.data);

// =====================
// Alerts
// =====================
export const fetchAlerts = () => apiClient.get('/health/alerts').then(r => r.data);
export const markAlertRead = (id: string) => apiClient.patch(`/health/alerts/${id}/read`).then(r => r.data);

// =====================
// AI Summary
// =====================
export const getAISummary = () => apiClient.post('/ai/summary').then(r => r.data);

// =====================
// Reports (returns a Blob)
// =====================
export const downloadReport = () =>
  apiClient.get('/reports/generate', { responseType: 'blob' }).then(r => r.data);

export default apiClient;
