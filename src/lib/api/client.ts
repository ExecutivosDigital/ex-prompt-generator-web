const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

const TOKEN_KEY = 'ex_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function transformKeysToSnake(obj: any): any {
  if (obj === null || obj === undefined || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(transformKeysToSnake);
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      camelToSnake(key),
      typeof value === 'object' && value !== null ? transformKeysToSnake(value) : value,
    ]),
  );
}

export class ApiError extends Error {
  readonly status: number;
  readonly errors: string[];
  readonly payload: unknown;

  constructor(message: string, status: number, errors: string[], payload: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
    this.payload = payload;
  }
}

function extractErrors(payload: unknown): string[] {
  if (!payload || typeof payload !== 'object') return [];
  const p = payload as { errors?: unknown; message?: unknown };

  if (Array.isArray(p.errors)) {
    const list = p.errors.filter((e): e is string => typeof e === 'string' && e.trim().length > 0);
    if (list.length > 0) return list;
  }

  if (Array.isArray(p.message)) {
    const list = p.message.filter((e): e is string => typeof e === 'string' && e.trim().length > 0);
    if (list.length > 0) return list;
  }

  if (typeof p.message === 'string' && p.message.trim().length > 0) {
    return [p.message.trim()];
  }

  return [];
}

function resolveMessage(errors: string[], status: number): string {
  if (errors.length > 0) return errors[0];
  if (status >= 500) return 'Estamos com uma instabilidade no servidor. Tente novamente em instantes.';
  return `Erro ${status}. Tente novamente.`;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const errors = extractErrors(payload);
    const message = resolveMessage(errors, res.status);
    throw new ApiError(message, res.status, errors, payload);
  }

  const data = await res.json();
  return transformKeysToSnake(data) as T;
}

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body?: unknown) => request<T>('POST', path, body),
  patch: <T>(path: string, body?: unknown) => request<T>('PATCH', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
