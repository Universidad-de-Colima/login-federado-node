import { useNavigate, useLocation } from "react-router";
import { useState, useEffect, useCallback } from "react";
import { Select, ListBox } from "@heroui/react";

export interface RoleOption {
  /** Identificador único del rol */
  value: string;
  /** Texto a mostrar */
  label: string;
  /** Ruta a la que navegar al seleccionar este rol */
  path: string;
}

interface RoleTitleProps {
  /** Roles disponibles para el usuario actual */
  roles: RoleOption[];
}

/**
 * Componente genérico que muestra los roles disponibles del usuario
 * y permite cambiar de contexto navegando a la ruta asociada.
 */
export const RoleTitle = ({ roles }: RoleTitleProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener el rol activo según la ruta actual
  const getRoleFromPath = useCallback(() => {
    const currentPath = location.pathname;

    const match = roles.find(
      (role) => currentPath === role.path || currentPath.startsWith(role.path + "/")
    );

    return match?.value ?? roles[0]?.value ?? null;
  }, [location.pathname, roles]);

  const [selectedRole, setSelectedRole] = useState<string | null>(() => getRoleFromPath());

  useEffect(() => {
    setSelectedRole(getRoleFromPath());
  }, [getRoleFromPath]);

  const redirectRole = useCallback(
    (value: string) => {
      const role = roles.find((r) => r.value === value);
      navigate(role?.path ?? "/");
    },
    [navigate, roles]
  );

  const handleRoleChange = useCallback(
    (value: string) => {
      setSelectedRole(value);
      redirectRole(value);
    },
    [redirectRole]
  );

  if (roles.length === 0) return null;

  // Un único rol: badge clickeable
  if (roles.length === 1) {
    const singleRole = roles[0];
    return (
      <div
        onClick={() => redirectRole(singleRole.value)}
        style={{ cursor: "pointer" }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            redirectRole(singleRole.value);
          }
        }}
      >
        {singleRole.label}
      </div>
    );
  }

  // Múltiples roles: selector
  return (
    <div className="flex gap-2 items-center">
      <Select
        selectedKey={selectedRole}
        onSelectionChange={(key) => handleRoleChange(String(key))}
        aria-label="Seleccionar rol"
        placeholder="Seleccionar rol"
        className="role-select min-w-[150px]"
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {roles.map((role) => (
              <ListBox.Item key={role.value} id={role.value}>
                {role.label}
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
    </div>
  );
};
