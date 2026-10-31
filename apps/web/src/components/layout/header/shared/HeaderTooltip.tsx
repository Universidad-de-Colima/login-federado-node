import { useState, type ReactNode } from 'react';

/** Tooltip genérico al hover/focus, usado para íconos sin label visible (modo compacto). */
export function HeaderTooltip({
  label,
  children,
  placement = 'bottom',
}: {
  label: ReactNode;
  children: ReactNode;
  placement?: 'bottom' | 'bottom-end';
}) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-flex"
      onBlur={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      <span
        aria-hidden={visible ? undefined : true}
        className={`pointer-events-none absolute top-full mt-2 w-max max-w-56 whitespace-nowrap rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-2.5 py-1.5 text-xs font-medium text-gray-900 dark:text-gray-50 shadow-xl transition-all duration-150 z-50 ${
          placement === 'bottom-end' ? 'right-0' : 'left-1/2 -translate-x-1/2'
        } ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'}`}
        role="tooltip"
      >
        {label}
      </span>
    </span>
  );
}
