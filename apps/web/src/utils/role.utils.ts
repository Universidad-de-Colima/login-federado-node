/**
 * Utilidades para manejo de roles y conversión entre formatos legacy y nuevos
 */

import { UserProfile, Role } from "@/types/session.types";

/**
 * Mapea un rol string a su equivalente numérico legacy (ya no se usa pero se mantiene por compatibilidad)
 */
export const roleStringToNumber = (roleString: string): string => {
  // Esta función ya no es necesaria con el nuevo sistema de roles
  // pero se mantiene por compatibilidad con código existente
  return roleString;
};

/**
 * Obtiene el rol principal del usuario (el primer rol del array)
 */
export const getPrimaryRole = (userProfile: UserProfile): string | null => {
  // Prioridad: role legacy > primer rol del array
  if (userProfile?.role) {
    return userProfile.role;
  }
  if (userProfile?.roles && userProfile.roles.length > 0) {
    return userProfile.roles[0].role_key;
  }
  return null;
};

/**
 * Verifica si el usuario tiene un rol específico
 */
export const hasRole = (userProfile: UserProfile | null, targetRole: string): boolean => {
  if (!userProfile) return false;

  // Verificar en el campo legacy
  if (userProfile.role?.toLowerCase() === targetRole.toLowerCase()) {
    return true;
  }

  // Verificar en el array de roles
  if (userProfile.roles && userProfile.roles.length > 0) {
    return userProfile.roles.some(
      role => role.role_key.toLowerCase() === targetRole.toLowerCase()
    );
  }

  return false;
};

/**
 * Obtiene todos los roles del usuario como array de strings
 */
export const getAllRoleKeys = (userProfile: UserProfile | null): string[] => {
  if (!userProfile) return [];

  if (userProfile.roles && userProfile.roles.length > 0) {
    return userProfile.roles.map(role => role.role_key);
  }

  // Fallback a rol legacy si existe
  if (userProfile.role) {
    return [userProfile.role];
  }

  return [];
};

/**
 * Obtiene el nombre legible del rol principal
 */
export const getRoleName = (userProfile: UserProfile | null): string | null => {
  if (!userProfile) return null;

  // Prioridad: role legacy > primer rol del array
  if (userProfile.role) {
    return userProfile.role;
  }

  if (userProfile.roles && userProfile.roles.length > 0) {
    return userProfile.roles[0].role_key;
  }

  // Si no tiene rol, e promotor empty o no está definido
  if (!userProfile.is_instructor || userProfile.is_instructor.length === 0) {
    return "Alumno";
  }

  return null;
};

/**
 * Obtiene el nombre legible del rol principal
 */
export const getPrimaryRoleName = (userProfile: UserProfile | null): string | null => {
  return getRoleName(userProfile);
};

/**
 * Obtiene todos los roles como string concatenado
 */
export const getRoleNamesString = (userProfile: UserProfile | null): string => {
  if (!userProfile) return "Sin rol";

  const roleKeys = getAllRoleKeys(userProfile);

  if (roleKeys.length === 0 && (!userProfile.is_instructor || userProfile.is_instructor.length === 0)) {
    return "Alumno";
  }

  return roleKeys.join(", ");
};

/**
 * Obtiene las descripciones de todos los roles
 */
export const getRoleDescriptions = (userProfile: UserProfile | null): string[] => {
  if (!userProfile || !userProfile.roles) return [];
  return userProfile.roles.map(role => role.description).filter((d): d is string => d !== undefined);
};

/**
 * Obtiene los UUIDs de todos los roles
 */
export const getRoleUuids = (userProfile: UserProfile | null): string[] => {
  if (!userProfile || !userProfile.roles) return [];
  return userProfile.roles.map(role => role.uuid).filter((u): u is string => u !== undefined);
};

/**
 * Añade compatibilidad legacy al perfil
 * Añade las propiedades 'role' y 'role_uuid' basadas en el primer rol del array
 */
export const addLegacyRoleToProfile = (userProfile: UserProfile): UserProfile => {
  // Si ya tiene las propiedades legacy, retornar tal cual
  if (userProfile.role !== undefined && userProfile.role_uuid !== undefined) {
    return userProfile;
  }

  // Si tiene roles en el array, usar el primero para legacy
  if (userProfile.roles && userProfile.roles.length > 0) {
    return {
      ...userProfile,
      role: userProfile.roles[0].role_key,
      role_uuid: userProfile.roles[0].uuid
    };
  }

  // Retornar sin cambios si no hay roles
  return userProfile;
};

/**
 * Verifica si el usuario tiene múltiples roles
 */
export const hasMultipleRoles = (userProfile: UserProfile | null): boolean => {
  if (!userProfile || !userProfile.roles) return false;
  return userProfile.roles.length > 1;
};

/**
 * Verifica si el usuario tiene alguno de los roles especificados
 */
export const hasAnyRole = (userProfile: UserProfile | null, targetRoles: string[]): boolean => {
  if (!userProfile) return false;

  const normalizedTargetRoles = targetRoles.map(r => r.toLowerCase());
  const userRoleKeys = getAllRoleKeys(userProfile).map(r => r.toLowerCase());

  return userRoleKeys.some(roleKey => normalizedTargetRoles.includes(roleKey));
};

/**
 * Verifica si el usuario tiene alguno de los roles indicados con alcance global
 * (scope_type distinto de "local"). Un rol sin `scopes` se considera global.
 * Refleja `ActivityAccessService::hasGlobalScopeRole` del backend.
 */
export const hasGlobalScopeRole = (userProfile: UserProfile | null, targetRoles: string[]): boolean => {
  if (!userProfile?.roles) return false;

  const normalizedTargetRoles = targetRoles.map(r => r.toLowerCase());

  return userProfile.roles.some(role => {
    if (!normalizedTargetRoles.includes(role.role_key.toLowerCase())) return false;
    const scopes = role.scopes ?? [];
    return scopes.length === 0 || scopes.some(scope => scope.scope_type !== 'local');
  });
};

/**
 * Verifica si el usuario tiene todos los roles especificados
 */
export const hasAllRoles = (userProfile: UserProfile | null, targetRoles: string[]): boolean => {
  if (!userProfile) return false;

  const normalizedTargetRoles = targetRoles.map(r => r.toLowerCase());
  const userRoleKeys = getAllRoleKeys(userProfile).map(r => r.toLowerCase());

  return normalizedTargetRoles.every(targetRole => userRoleKeys.includes(targetRole));
};

/**
 * Obtiene un rol específico por su role_key
 */
export const getRoleByKey = (userProfile: UserProfile | null, roleKey: string): Role | undefined => {
  if (!userProfile || !userProfile.roles) return undefined;

  return userProfile.roles.find(
    role => role.role_key.toLowerCase() === roleKey.toLowerCase()
  );
};

/**
 * Verifica si el usuario es administrador
 */
export const isAdmin = (userProfile: UserProfile | null): boolean => {
  return hasRole(userProfile, 'administrador');
};

/**
 * Verifica si el usuario es responsable de actividad deportiva
 */
export const isWorkshopResponsible = (userProfile: UserProfile | null): boolean => {
  return hasRole(userProfile, 'responsable');
};

/**
 * Verifica si el usuario es acreditador
 */
export const isAccreditor = (userProfile: UserProfile | null): boolean => {
  return hasRole(userProfile, 'acreditador');
};