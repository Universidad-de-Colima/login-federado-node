/**
 * Helpers de color para el AppHeader. Permiten que `background`/`borderBottom`
 * acepten un hex, una clase Tailwind, o un par [light, dark], y derivar de
 * ahí el esquema de color (blanco/negro) a usar.
 */

/** Resuelve string | [light, dark] al valor del tema activo */
export function resolveColor(
  color: string | [string, string] | undefined,
  theme: 'light' | 'dark',
): string | undefined {
  if (!color) return undefined;
  if (Array.isArray(color)) return theme === 'dark' ? color[1] : color[0];
  return color;
}

/** Convierte hex a rgba con alpha */
export function hexToRgba(hex: string, alpha: number): string {
  const c = hex.replace('#', '').padEnd(6, '0');
  return `rgba(${parseInt(c.slice(0, 2), 16)},${parseInt(c.slice(2, 4), 16)},${parseInt(c.slice(4, 6), 16)},${alpha})`;
}

/** Luminancia relativa WCAG de un color hex */
export function hexLuminance(hex: string): number {
  const c = hex.replace('#', '');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

/** Extrae el hex del color activo desde un string de clases Tailwind, ej: "bg-white dark:bg-[#0f172a]" */
export function extractHexFromBgClass(
  bgClass: string | undefined,
  theme: 'light' | 'dark',
): string | undefined {
  if (!bgClass) return undefined;
  const parts = bgClass.split(/\s+/);

  if (theme === 'dark') {
    const hit = parts
      .find((p) => p.startsWith('dark:bg-[#'))
      ?.match(/dark:bg-\[(#[\da-fA-F]{3,8})\]/)?.[1];
    if (hit) return hit;
  }

  const hit = parts
    .find((p) => !p.startsWith('dark:') && p.startsWith('bg-[#'))
    ?.match(/bg-\[(#[\da-fA-F]{3,8})\]/)?.[1];
  if (hit) return hit;

  if (theme === 'light' && parts.includes('bg-white')) return '#ffffff';
  if (theme === 'light' && parts.includes('bg-black')) return '#000000';
  if (theme === 'dark' && parts.includes('dark:bg-white')) return '#ffffff';
  if (theme === 'dark' && parts.includes('dark:bg-black')) return '#000000';

  return undefined;
}

export interface ResolvedBgColor {
  /** Valor resuelto para el tema activo: hex, clase Tailwind, o undefined */
  resolved: string | undefined;
  /** true si `resolved` es un hex literal (vs. clase Tailwind) */
  isHex: boolean;
  /** hex efectivo, ya sea directo o extraído de una clase Tailwind arbitraria (bg-[#...]) */
  hex: string | undefined;
}

/** Resuelve un prop de color (string | [light, dark]) a {resolved, isHex, hex} para el tema activo. */
export function resolveBgColor(
  color: string | [string, string] | undefined,
  theme: 'light' | 'dark',
): ResolvedBgColor {
  const resolved = resolveColor(color, theme);
  const isHex = resolved?.startsWith('#') ?? false;
  const hex = isHex ? resolved! : extractHexFromBgClass(resolved, theme);
  return { resolved, isHex, hex };
}

/** Elige entre dos valores según la luminancia de un hex (< 0.5 → oscuro → darkValue). */
export function pickByLuminance<T>(
  hex: string | undefined,
  darkValue: T,
  lightValue: T,
): T | undefined {
  if (!hex) return undefined;
  return hexLuminance(hex) < 0.8 ? darkValue : lightValue;
}
