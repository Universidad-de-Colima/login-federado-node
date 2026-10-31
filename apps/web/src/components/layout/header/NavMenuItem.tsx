import type { NavItem } from '@/types/layout.types';

import { Link, useLocation } from 'react-router';
import { Button } from '@heroui/react';

import { ChevronIcon, HeaderTooltip, isNavItemActiveStrict, renderNavIcon } from './shared';
import type { SchemeColors } from './scheme';

const ICON_WRAPPER_CLASS = 'shrink-0 text-default-400';

interface NavMenuItemProps {
  item: NavItem;
  siblings?: NavItem[];
  openSubmenu: string | null;
  onToggleSubmenu: (href: string) => void;
  sc: SchemeColors;
  /** Modo compacto: solo ícono + tooltip con el label, sin texto visible. */
  compact?: boolean;
}

export function NavMenuItem({
  item,
  siblings,
  openSubmenu,
  onToggleSubmenu,
  sc,
  compact = false,
}: NavMenuItemProps) {
  const location = useLocation();
  const hasChildren = !!item.children?.length;
  const isActive = isNavItemActiveStrict(location.pathname, item, siblings);
  const isOpen = openSubmenu === item.href;

  const baseLinkClass = `flex items-center gap-1 p-2 text-sm rounded-full ${sc.text} no-underline transition-colors whitespace-nowrap`;

  if (!hasChildren) {
    const link = (
      <Link
        aria-label={compact ? item.label : undefined}
        className={`${baseLinkClass} ${isActive ? sc.itemActive : sc.itemHover}`}
        to={item.href}
      >
        {item.icon && (
          <span className={ICON_WRAPPER_CLASS}>{renderNavIcon(item.icon, 'w-5 h-5')}</span>
        )}
        {!compact && item.label}
      </Link>
    );

    return <li>{compact ? <HeaderTooltip label={item.label}>{link}</HeaderTooltip> : link}</li>;
  }

  const trigger = (
    <Button
      aria-expanded={isOpen ? 'true' : 'false'}
      aria-haspopup="true"
      aria-label={compact ? item.label : undefined}
      className={`flex w-full items-center gap-2 px-4 py-2 text-sm rounded-full ${sc.text} transition-colors whitespace-nowrap ${
        isActive || isOpen ? sc.itemActive : sc.itemHover
      }`}
      variant="ghost"
      onPress={() => onToggleSubmenu(item.href)}
    >
      {item.icon && (
        <span className={ICON_WRAPPER_CLASS}>{renderNavIcon(item.icon, 'w-5 h-5')}</span>
      )}
      {!compact && item.label}
      {!compact && <ChevronIcon open={isOpen} />}
    </Button>
  );

  return (
    <li className="relative">
      {compact ? <HeaderTooltip label={item.label}>{trigger}</HeaderTooltip> : trigger}

      {isOpen && (
        <ul className="absolute top-full left-0 mt-1.5 min-w-48 bg-white dark:bg-ucol_gray_dark-300 rounded-xl shadow-xl border border-gray-200 dark:border-ucol_gray_dark-500 py-1.5 z-50 list-none p-0 m-0">
          {item.children!.map((child) => {
            const childActive = isNavItemActiveStrict(location.pathname, child, item.children);

            return (
              <li key={child.href}>
                <Link
                  className={`flex items-center gap-2.5 px-4 py-2 text-sm no-underline transition-colors rounded-full mx-1 ${
                    childActive
                      ? 'text-ucol_green-500 font-semibold bg-gray-100 dark:bg-ucol_gray_dark-400'
                      : 'text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-ucol_gray_dark-400'
                  }`}
                  to={child.href}
                  onClick={() => onToggleSubmenu(item.href)}
                >
                  {child.icon && (
                    <span className="shrink-0 text-gray-400 dark:text-gray-500">
                      {renderNavIcon(child.icon, 'w-3.5 h-3.5')}
                    </span>
                  )}
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}
