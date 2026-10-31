/** Perfil SAML que devuelve el IdP de UCOL (se guarda tal cual en la sesión del backend). */
export interface SamlUser {
  uCorreo:      string;
  uNombre:      string;
  uDependencia: string;
  uCuenta:      string;
  uTrabajador:  string;
  uTipo:        string;
  /** El backend NestJS aún no maneja roles: siempre null */
  role:         string | null;
}

interface ApiResponse<T = unknown> {
  error:   boolean;
  message: string;
  data:    T;
}

/** GET /auth/me → perfil SAML, o null si no hay sesión (el backend responde 401). */
export async function getSession(): Promise<SamlUser | null> {
  try {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
    if (!res.ok) return null;
    const body: ApiResponse<Omit<SamlUser, "role">> = await res.json();
    return !body.error ? { ...body.data, role: null } : null;
  } catch {
    return null;
  }
}

/**
 * Redirige al IdP UCOL. Tras autenticar, el backend devuelve al usuario a
 * FRONT_URL, por lo que `returnTo` no se usa.
 */
export function redirectToSamlLogin(_returnTo?: string): void {
  window.location.href = `${API_URL}/auth/login`;
}

/** Cierra la sesión local y en el IdP; el backend redirige de vuelta al front. */
export function redirectToSamlLogout(): void {
  window.location.href = `${API_URL}/auth/logout`;
}
