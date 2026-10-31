import type { ActionItem } from '@/types/layout.types';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { renderNavIcon } from './renderIcon';

export interface RenderHeaderActionsOptions {
  /** Clase de texto/color por defecto (no-danger) */
  textClass: string;
  /** Clase de hover por defecto (no-danger) */
  hoverClass: string;
}

/** Renderiza el slot `actions` del header: ReactNode libre o ActionItem[] tipado. */
export function renderHeaderActions(
  actions: ReactNode | ActionItem[] | undefined,
  { textClass, hoverClass }: RenderHeaderActionsOptions,
): ReactNode {
  if (!actions) return null;
  if (!Array.isArray(actions)) return <>{actions}</>;

  const base = 'flex items-center gap-1.5 px-2.5 py-1.5 text-sm transition-colors shrink-0';

  return (
    <>
      {actions.map((item) => {
        const iconEl = renderNavIcon(item.icon, 'w-4 h-4 shrink-0');
        const isDanger = item.variant === 'danger';
        const colorCls = isDanger ? 'text-red-400 hover:bg-red-500/10' : `${textClass} ${hoverClass}`;

        if (item.href) {
          return (
            <Link key={item.key} className={`${base} no-underline ${colorCls}`} title={item.title} to={item.href}>
              {iconEl}
              {item.label && <span>{item.label}</span>}
            </Link>
          );
        }
        return (
          <button key={item.key} className={`${base} ${colorCls}`} title={item.title ?? item.label} type="button" onClick={item.onClick}>
            {iconEl}
            {item.label && <span>{item.label}</span>}
          </button>
        );
      })}
    </>
  );
}
