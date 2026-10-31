import type { ActionItem, NavItem } from '@/types/layout.types';
import type { ReactNode } from 'react';

import { createPortal } from 'react-dom';

import { useBodyScrollLock } from '@/hooks/useBodyScrollLock';
import {
  CloseIcon,
  HeaderAvatar,
  HeaderLoginButton,
  LogoutButton,
  renderHeaderActions,
  type HeaderUser,
} from './shared';
import { DrawerNavItem } from './DrawerNavItem';
import type { SchemeColors } from './scheme';
import { Button } from '@heroui/react';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  user?: HeaderUser;
  onLogout?: () => void;
  onLogin?: () => void;
  actions?: ReactNode | ActionItem[];
  sc: SchemeColors;
  logoSrc: string;
  siteTitle?: string;
}

export function MobileDrawer({
  open,
  onClose,
  navItems,
  user,
  onLogout,
  onLogin,
  actions,
  sc,
  logoSrc,
  siteTitle,
}: MobileDrawerProps) {
  useBodyScrollLock(open);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-60 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        aria-label="Menú de navegación"
        aria-modal="true"
        className={`fixed top-0 right-0 z-61 flex h-full w-72 flex-col bg-white dark:bg-ucol_gray_dark-300 shadow-2xl transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
      >
        {/* Header del drawer */}
        <div className="items-center justify-between border-b border-gray-200 dark:border-ucol_gray_dark-500 px-4 py-3">
          <Button
            aria-label="Cerrar menú"
            className="rounded-lg p-1.5 text-gray-400 dark:text-gray-500 transition-colors hover:bg-gray-100 dark:hover:bg-ucol_gray_dark-400 hover:text-gray-700 dark:hover:text-gray-200"
            type="button"
            onClick={onClose}
            variant="ghost"
          >
            <CloseIcon />
            Cerrar menú
          </Button>
          <div className="flex items-center gap-2.5">
            <img alt={siteTitle ?? 'UCOL'} className="h-7 w-auto object-contain" src={logoSrc} />
          </div>
          {siteTitle && (
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
              {siteTitle}
            </span>
          )}
        </div>

        {/* Usuario en drawer */}
        {user && (
          <div className="flex items-center gap-3 border-b border-gray-200 dark:border-ucol_gray_dark-500 px-4 py-3">
            <HeaderAvatar
              bgClass={sc.avatarBg}
              ringClass={sc.avatarRing}
              textClass={sc.avatarText}
              user={user}
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                {user.name}
              </span>
              {(user.role ?? user.email) && (
                <span className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {user.role ?? user.email}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {navItems.map((item) => (
            <DrawerNavItem key={item.href} item={item} onClose={onClose} />
          ))}
        </nav>

        {/* Footer: acciones + login/logout */}
        {(actions || onLogout || onLogin) && (
          <div className="flex flex-col gap-2 border-t border-gray-200 dark:border-ucol_gray_dark-500 p-3">
            {actions && (
              <div className="flex items-center gap-2 px-1">
                {renderHeaderActions(actions, { textClass: sc.text, hoverClass: sc.itemHover })}
              </div>
            )}
            {onLogin && (
              <HeaderLoginButton
                onClick={() => {
                  onLogin();
                  onClose();
                }}
              />
            )}
            {onLogout && (
              <LogoutButton
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              />
            )}
          </div>
        )}
      </div>
    </>,
    document.body
  );
}
