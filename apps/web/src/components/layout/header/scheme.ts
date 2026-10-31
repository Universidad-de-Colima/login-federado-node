import { BASE_SCHEME } from './shared';

/* ─── Paleta de colores por scheme (white/black) ────────── */

export const SC = {
  white: {
    ...BASE_SCHEME.white,
    btnBorder: 'border-white/30 hover:border-white/60',
    btnText: 'text-white/80 hover:text-white',
    mobileChildIdle: 'text-white/75 hover:text-white hover:bg-white/10',
    mobileChildActive: 'text-white font-semibold bg-white/20',
  },
  black: {
    ...BASE_SCHEME.black,
    btnBorder: 'border-gray-300 hover:border-gray-500',
    btnText: 'text-gray-600 hover:text-gray-900',
    mobileChildIdle: 'text-gray-500 hover:text-gray-900 hover:bg-black/5',
    mobileChildActive: 'text-gray-900 font-semibold bg-black/10',
  },
} as const;

export type SchemeColors = (typeof SC)[keyof typeof SC];
