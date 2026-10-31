export interface User {
  id: number;
  nombre: string;
  correo: string;
  creado: string;
}

export interface UserInput {
  nombre: string;
  correo: string;
}

interface ApiResponse<T = unknown> {
  error: boolean;
  message: string;
  data: T;
}

/** Desenvuelve { error, message, data }; lanza Error si la API reporta una falla. */
async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  const body: ApiResponse<T> | null = await res.json().catch(() => null);
  if (!res.ok || !body || body.error) {
    throw new Error(body?.message ?? `HTTP ${res.status}`);
  }
  return body.data;
}

export const getUsers = () => apiFetch<User[]>('/usuarios');

export const createUser = (dto: UserInput) =>
  apiFetch<User>('/usuarios', { method: 'POST', body: JSON.stringify(dto) });

export const deleteUser = (id: number) =>
  apiFetch<unknown>(`/usuarios/${id}`, { method: 'DELETE' });
