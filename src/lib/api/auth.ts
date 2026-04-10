import { api, setToken } from './client';
import type { Profile } from '../../types/auth';

interface AuthResponse {
  access_token: string;
  user: { id: string; full_name: string; email: string };
  profile: Profile;
}

interface MeResponse {
  id: string;
  full_name: string;
  email: string;
  profile: Profile;
}

export async function signUp(fullName: string, email: string, password: string) {
  const data = await api.post<AuthResponse>('/auth/register', { fullName, email, password });
  setToken(data.access_token);
  return data;
}

export async function signIn(email: string, password: string) {
  const data = await api.post<AuthResponse>('/auth/login', { email, password });
  setToken(data.access_token);
  return data;
}

export async function getMe() {
  return api.get<MeResponse>('/auth/me');
}

export async function updateProfile(updates: Partial<Profile>) {
  // Convert snake_case keys to camelCase for the backend
  const camelUpdates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    camelUpdates[camelKey] = value;
  }
  return api.patch<MeResponse>('/auth/profile', camelUpdates);
}
