/**
 * Tokens de color para el esquema "white/black" del AppHeader (texto claro
 * sobre fondo oscuro vs. texto oscuro sobre fondo claro).
 */
export const BASE_SCHEME = {
  white: {
    text: 'text-white',
    textMuted: 'text-white/55',
    itemHover: 'hover:bg-white/10',
    itemActive: 'bg-white/20 font-semibold',
    divider: 'border-white/20',
    hamburger: 'text-white/80 hover:text-white hover:bg-white/10',
    avatarBg: 'bg-white/20',
    avatarRing: 'ring-white/30',
    avatarText: 'text-white',
  },
  black: {
    text: 'text-gray-800',
    textMuted: 'text-gray-500',
    itemHover: 'hover:bg-black/5',
    itemActive: 'bg-black/10 font-semibold',
    divider: 'border-black/10',
    hamburger: 'text-gray-600 hover:text-gray-900 hover:bg-black/5',
    avatarBg: 'bg-gray-200',
    avatarRing: 'ring-black/10',
    avatarText: 'text-gray-800',
  },
} as const;

export type BaseSchemeColors = (typeof BASE_SCHEME)[keyof typeof BASE_SCHEME];
