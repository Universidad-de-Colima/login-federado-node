import type { ComponentType, ReactNode } from 'react';

/**
 * Resuelve un ícono de `NavItem`/`ActionItem` (componente) a un nodo
 * renderizado, aplicando `className`.
 */
export function renderNavIcon(
  Icon: ComponentType<{ className?: string }> | undefined,
  className: string,
): ReactNode {
  if (!Icon) return null;
  return <Icon className={className} />;
}
