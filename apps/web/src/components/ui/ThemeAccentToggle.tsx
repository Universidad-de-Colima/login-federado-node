'use client';

import { useCallback, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { flushSync } from 'react-dom';

import { cn } from '@/lib/utils';
import { Button, ColorSwatchPicker, Popover, parseColor, useTheme } from '@heroui/react';
import { PaletteIcon } from '@hugeicons/core-free-icons';
import { hugeIcon } from '@/utils/hugeIcon';

export type TransitionVariant =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'hexagon'
  | 'rectangle'
  | 'star';

export interface AccentPreset {
  name: string;
  label: string;
  light: string;
  dark: string;
  fg: string;
  /** Color de la línea del border inferior del header, si difiere del acento. */
  border?: { light: string; dark: string };
}

interface ThemeAccentToggleProps {
  duration?: number;
  variant?: TransitionVariant;
  /** When true, the transition expands from the viewport center instead of the button center. */
  fromCenter?: boolean;
  /** Forces white icons, for use over dark/colored header backgrounds. */
  onlyWhite?: boolean;
  className?: string;
  /** Preset de acento activo. */
  accent: AccentPreset;
  /** Presets disponibles para el selector. */
  accentPresets: readonly AccentPreset[];
  onAccentChange: (preset: AccentPreset) => void;
}

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
  const pairs = Array.from({ length: vertexCount }, () => `${cx}px ${cy}px`).join(', ');
  return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number
): [string, string] {
  switch (variant) {
    case 'circle':
      return [`circle(0px at ${cx}px ${cy}px)`, `circle(${maxRadius}px at ${cx}px ${cy}px)`];
    case 'square': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'triangle': {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        `${cx}px ${cy - scale}px`,
        `${cx + dx}px ${cy + 0.5 * scale}px`,
        `${cx - dx}px ${cy + 0.5 * scale}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
    }
    case 'diamond': {
      // Slightly larger than the view-transition circle radius so axis-aligned coverage matches the circle reveal.
      const R = maxRadius * Math.SQRT2;
      const end = [
        `${cx}px ${cy - R}px`,
        `${cx + R}px ${cy}px`,
        `${cx}px ${cy + R}px`,
        `${cx - R}px ${cy}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'hexagon': {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`);
      }
      return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(', ')})`];
    }
    case 'rectangle': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        `${cx - halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy + halfH}px`,
        `${cx - halfW}px ${cy + halfH}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'star': {
      // Small overscan so the last frames never leave a 1px seam before the transition group ends.
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(`${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`);
          const innerA = outerA + Math.PI / 5;
          verts.push(
            `${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`
          );
        }
        return `polygon(${verts.join(', ')})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [`circle(0px at ${cx}px ${cy}px)`, `circle(${maxRadius}px at ${cx}px ${cy}px)`];
  }
}

/**
 * Control único (una sola "píldora") que combina el toggle de tema (con
 * animación de view-transition) y el selector de color de acento (popover),
 * en vez de dos botones separados en el header.
 */
export const ThemeAccentToggle = ({
  className,
  duration = 400,
  variant,
  fromCenter = false,
  onlyWhite = false,
  accent,
  accentPresets,
  onAccentChange,
}: ThemeAccentToggleProps) => {
  const shape = variant ?? 'circle';
  const { resolvedTheme, setTheme } = useTheme('light');
  const isDark = resolvedTheme === 'dark';
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleTheme = useCallback(() => {
    const button = buttonRef.current;
    if (!button) return;

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight;

    let x: number;
    let y: number;
    if (fromCenter) {
      x = viewportWidth / 2;
      y = viewportHeight / 2;
    } else {
      const { top, left, width, height } = button.getBoundingClientRect();
      x = left + width / 2;
      y = top + height / 2;
    }

    const maxRadius = Math.hypot(Math.max(x, viewportWidth - x), Math.max(y, viewportHeight - y));

    const applyTheme = () => {
      setTheme(isDark ? 'light' : 'dark');
    };

    if (typeof document.startViewTransition !== 'function') {
      applyTheme();
      return;
    }

    const root = document.documentElement;
    root.dataset.magicuiThemeVt = 'active';
    root.style.setProperty('--magicui-theme-toggle-vt-duration', `${duration}ms`);
    const cleanup = () => {
      delete root.dataset.magicuiThemeVt;
      root.style.removeProperty('--magicui-theme-toggle-vt-duration');
    };

    const transition = document.startViewTransition(() => {
      flushSync(applyTheme);
    });
    if (typeof transition?.finished?.finally === 'function') {
      transition.finished.finally(cleanup);
    } else {
      cleanup();
    }

    const ready = transition?.ready;
    if (ready && typeof ready.then === 'function') {
      const clipPath = getThemeTransitionClipPaths(
        shape,
        x,
        y,
        maxRadius,
        viewportWidth,
        viewportHeight
      );
      ready.then(() => {
        document.documentElement.animate(
          {
            clipPath,
          },
          {
            duration,
            // Star: linear avoids easing overshoot that fights polygon interpolation at t→1; VT group duration is synced above.
            easing: shape === 'star' ? 'linear' : 'ease-in-out',
            fill: 'forwards',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    }
  }, [shape, fromCenter, duration, isDark, setTheme]);

  const wrapperClass = onlyWhite
    ? 'divide-white/20'
    : 'divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800';
  const PaletteIconEl = hugeIcon(PaletteIcon);

  return (
    <div
      className={cn(
        'inline-flex items-stretch rounded-lg overflow-hidden divide-x',
        wrapperClass,
        className
      )}
    >
      <Button
        key="theme-toggle"
        ref={buttonRef}
        onPress={toggleTheme}
        variant="ghost"
        isIconOnly
        className={cn(
          'rounded-none p-2 transition-colors',
          onlyWhite
            ? 'bg-transparent hover:bg-white/15'
            : 'hover:bg-gray-100 dark:hover:bg-gray-700'
        )}
        aria-label="Cambiar tema"
      >
        {isDark ? (
          <Sun size={20} className={cn(onlyWhite && 'text-white')} />
        ) : (
          <Moon size={20} className={cn(onlyWhite && 'text-white')} />
        )}
        <span className="sr-only">Cambiar tema</span>
      </Button>

      <Popover>
        <Popover.Trigger>
          <Button
            aria-label="Color de acento"
            isIconOnly
            className={cn(
              'rounded-none p-2 transition-colors',
              onlyWhite
                ? 'bg-transparent hover:bg-white/15'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            )}
            variant="ghost"
          >
            <PaletteIconEl size={20} className={cn(onlyWhite && 'text-white')} />
          </Button>
        </Popover.Trigger>
        <Popover.Content placement="bottom end">
          <Popover.Dialog className="p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Color de acento</p>
            <ColorSwatchPicker
              className="max-w-40"
              value={parseColor(accent.light)}
              onChange={(color) => {
                const hex = color.toString('hex').toLowerCase();
                const preset = accentPresets.find((p) => p.light.toLowerCase() === hex);
                if (preset) onAccentChange(preset);
              }}
            >
              {accentPresets.map((preset) => (
                <ColorSwatchPicker.Item
                  key={preset.name}
                  aria-label={preset.label}
                  className={cn(
                    preset.name === 'default' &&
                      'ring-1 ring-inset ring-gray-300 dark:ring-gray-600'
                  )}
                  color={preset.light}
                >
                  <ColorSwatchPicker.Swatch />
                  <ColorSwatchPicker.Indicator />
                </ColorSwatchPicker.Item>
              ))}
            </ColorSwatchPicker>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    </div>
  );
};
