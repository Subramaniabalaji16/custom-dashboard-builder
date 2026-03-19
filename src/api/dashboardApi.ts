import axios from 'axios';
import { DashboardState } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const api = axios.create({ baseURL: `${BASE_URL}/api` });

export async function fetchDashboard(): Promise<DashboardState> {
  const { data } = await api.get<DashboardState>('/dashboard');
  return data;
}

export async function saveDashboard(state: Pick<DashboardState, 'layout' | 'widgets'>): Promise<DashboardState> {
  const { data } = await api.put<DashboardState>('/dashboard', state);
  return data;
}
