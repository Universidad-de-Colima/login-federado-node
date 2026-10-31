import type { NavItem } from '@/types/layout.types';

import { useState } from 'react';
import { Link, useLocation } from 'react-router';

import { ChevronIcon, isNavItemActiveStrict, renderNavIcon } from './shared';

const ICON_WRAPPER_CLASS = 'shrink-0 text-gray-400 dark:text-gray-500';

export function DrawerNavItem({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const hasChildren = !!item.children?.length;
  const isActive = isNavItemActiveStrict(location.pathname, item);

  const baseClass = 'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-colors';
  const activeClass = 'text-white font-semibold bg-accent';
  const idleClass = 'text-gray-800 dark:text-gray-100 hover:bg-accent/60';

  if (!hasChildren) {
    return (
      <Link className={`${baseClass} no-underline ${isActive ? activeClass : idleClass}`} to={item.href} onClick={onClose}>
        {item.icon && <span className={ICON_WRAPPER_CLASS}>{renderNavIcon(item.icon, 'w-5 h-5')}</span>}
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <button className={`${baseClass} ${isActive || open ? activeClass : idleClass}`} type="button" onClick={() => setOpen((v) => !v)}>
        {item.icon && <span className={ICON_WRAPPER_CLASS}>{renderNavIcon(item.icon, 'w-5 h-5')}</span>}
        <span className="flex-1 text-left">{item.label}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-gray-200 dark:border-ucol_gray_dark-500 pl-3">
          {item.children!.map((child) => {
            const childActive = location.pathname.startsWith(child.href);

            return (
              <Link
                key={child.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-colors ${
                  childActive
                    ? 'text-accent font-semibold bg-accent/10'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-accent/60'
                }`}
                to={child.href}
                onClick={onClose}
              >
                {child.icon && <span className={ICON_WRAPPER_CLASS}>{renderNavIcon(child.icon, 'w-4 h-4')}</span>}
                {child.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
