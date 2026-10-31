/**
 * Tipos relacionados con la sesión de usuario y autenticación
 */

export interface RoleScope {
  scope_type?: string;
  organizational_unit_uuid?: string | null;
  organizational_unit_name?: string | null;
}

export interface Role {
  uuid?: string;
  role_key: string;
  name?: string;
  description?: string;
  // Una entrada por cada unidad organizacional a la que aplica este rol
  // (rol global: un único scope con organizational_unit_uuid null).
  scopes?: RoleScope[];
  activities?: Array<{
    uuid: string;
    name: string;
    status: string;
  }>;
  // Propiedades legacy
  id?: number;
  created_at?: string;
  updated_at?: string;
  pivot?: {
    id: number;
  };
}

export interface UserProfile {
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  ncuenta?: string;
  ntrabajador?: string;
  roles: Role[];
  // Propiedades legacy para compatibilidad
  role?: string;
  role_uuid?: string;
  is_student?: Array<{
    uuidEnrollment: string;
    status: string;
    activity: { uuid: string; name: string };
  }>;
  is_instructor?: Array<{
    uuid: string;
    name: string;
    status: string;
  }>;
}

export interface AuthValidationResult {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  userProfile: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
  validateAuthentication: () => Promise<AuthValidationResult>;
}

/**
 * Estructura de respuesta de la API de sesión
 */
export interface SessionApiResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}