import type { CSSProperties } from 'react';

export const CONTAINER_MAX_W: Record<string, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-screen-2xl',
  'screen-xl': 'max-w-screen-xl',
};

export interface ResolvedContainerWidth {
  cwCls: string;
  cwStyle: CSSProperties | undefined;
}

/**
 * Resuelve `containerWidth` (clave nombrada o valor CSS) a una clase Tailwind
 * o a un `style.maxWidth` inline.
 */
export function resolveContainerWidth(containerWidth: string | undefined): ResolvedContainerWidth {
  const cwCls =
    containerWidth && containerWidth in CONTAINER_MAX_W ? CONTAINER_MAX_W[containerWidth] : '';
  const cwStyle =
    containerWidth && !(containerWidth in CONTAINER_MAX_W) ? { maxWidth: containerWidth } : undefined;
  return { cwCls, cwStyle };
}
