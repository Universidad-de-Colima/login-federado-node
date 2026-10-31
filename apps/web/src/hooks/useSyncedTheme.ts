import { useEffect, useState } from 'react';
import { useTheme } from '@heroui/react';

/**
 * Sincroniza el tema activo leyendo `html.class`/`data-theme` vía MutationObserver.
 * Se apoya en `useTheme` de HeroUI solo como valor inicial: cada instancia de
 * `useTheme()` mantiene su propio estado, así que los consumidores de solo
 * lectura usan este observer para reflejar cambios hechos desde otro componente
 * (p. ej. el botón de ThemeToggle) sin depender de un contexto compartido.
 */
export function useSyncedTheme(): 'light' | 'dark' {
  const { resolvedTheme } = useTheme('light');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>(
    resolvedTheme === 'dark' ? 'dark' : 'light'
  );

  useEffect(() => {
    function sync() {
      const html = document.documentElement;
      setCurrentTheme(
        html.classList.contains('dark') || html.getAttribute('data-theme') === 'dark'
          ? 'dark'
          : 'light'
      );
    }
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  return currentTheme;
}
