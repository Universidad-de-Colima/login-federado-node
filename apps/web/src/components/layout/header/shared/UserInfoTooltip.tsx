import { useState, type ReactNode } from 'react';

import type { HeaderUser } from './types';

/** Tooltip con nombre/rol que aparece al hover, usado cuando `userDisplay="avatar"`. */
export function UserInfoTooltip({
  user,
  maxWidthClass = 'max-w-56',
  children,
}: {
  user: HeaderUser;
  maxWidthClass?: string;
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {children}
      <div
        aria-hidden={visible ? undefined : true}
        className={`pointer-events-none absolute right-0 top-full mt-2 w-max ${maxWidthClass} rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 shadow-xl transition-all duration-150 z-50 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
        }`}
      >
        <p className="text-sm font-medium text-gray-900 dark:text-gray-50 leading-snug">{user.name}</p>
        {(user.role ?? user.email) && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{user.role ?? user.email}</p>
        )}
      </div>
    </div>
  );
}
