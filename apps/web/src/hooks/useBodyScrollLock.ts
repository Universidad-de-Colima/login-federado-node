import { useEffect } from 'react';

/** Bloquea el scroll del body mientras `locked` sea true (uso típico: drawers/modales). */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [locked]);
}
