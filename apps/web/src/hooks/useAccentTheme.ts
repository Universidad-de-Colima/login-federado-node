import { useEffect, useState } from 'react';
import type { AccentPreset } from '@/components/ui/ThemeAccentToggle';

/**
 * Presets basados en la paleta `ucol_*`. Se aplican como variables CSS
 * `--accent` / `--accent-foreground`, persistidas en localStorage y elegibles
 * desde el popover de `ThemeAccentToggle`.
 */
export const ACCENT_PRESETS: AccentPreset[] = [
  {
    name: 'default',
    label: 'Predeterminado',
    light: '#ffffff',
    dark: '#000000',
    fg: '#ffffff',
    border: { light: '#9ab024', dark: '#C1D82F' },
  },
  { name: 'success', label: 'Lima UCOL', light: '#9ab024', dark: '#C1D82F', fg: '#1a2e0c' },
  { name: 'primary', label: 'Verde UCOL', light: '#64B32E', dark: '#82c558', fg: '#ffffff' },
  { name: 'secondary', label: 'Morado UCOL', light: '#522583', dark: '#7539b5', fg: '#ffffff' },
  { name: 'magenta', label: 'Magenta UCOL', light: '#C7017F', dark: '#9F0166', fg: '#ffffff' },
  { name: 'blue', label: 'Azul UCOL', light: '#006096', dark: '#0080C8', fg: '#ffffff' },
];

const ACCENT_LS_KEY = 'ucol-accent-preset';
const STYLE_ID = 'ucol-accent-override';

function getSavedAccent(): AccentPreset {
  const saved = localStorage.getItem(ACCENT_LS_KEY);
  return ACCENT_PRESETS.find((p) => p.name === saved) ?? ACCENT_PRESETS[2];
}

/** Aplica las variables CSS del acento. También se llama al arrancar (main.tsx) para que el Loader lo respete. */
export function applyAccent(accent: AccentPreset) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  // "default" no aplica override: el header deriva su color de la paleta tailwind
  if (accent.name === 'default') {
    el.textContent = '';
    return;
  }
  el.textContent = `
      :root { --accent: ${accent.light}; --accent-foreground: ${accent.fg}; }
      .dark, [data-theme="dark"] { --accent: ${accent.dark}; --accent-foreground: ${accent.fg}; }
    `;
}

export function initAccentTheme() {
  applyAccent(getSavedAccent());
}

export function useAccentTheme() {
  const [accent, setAccent] = useState<AccentPreset>(getSavedAccent);

  useEffect(() => {
    localStorage.setItem(ACCENT_LS_KEY, accent.name);
    applyAccent(accent);
  }, [accent]);

  return { accent, setAccent };
}
