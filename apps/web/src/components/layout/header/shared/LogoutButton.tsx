import type { ReactNode } from 'react';
import { Button } from '@heroui/react';

import { LogoutIcon } from './icons';

const DEFAULT_CLASS =
  'flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10';

/** Fila "Cerrar sesión" de ancho completo, usada en el drawer móvil. */
export function LogoutButton({
  onClick,
  className = DEFAULT_CLASS,
  icon,
}: {
  onClick: () => void;
  className?: string;
  icon?: ReactNode;
}) {
  return (
    <Button className={className} type="button" onClick={onClick} variant="outline">
      {icon ?? <LogoutIcon />}
      Cerrar sesión
    </Button>
  );
}
