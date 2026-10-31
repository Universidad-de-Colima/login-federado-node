import { ComponentType, ReactElement } from 'react';

/**
 * Tipos de colores disponibles para los botones de navegación
 */
export type ColorScheme = 'primary' | 'secondary' | 'admin' | 'attendance' | 'danger' | 'success';

/**
 * Propiedades para los botones de navegación
 */
export interface NavButtonProps {
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  onClick: () => void;
  colorScheme: ColorScheme;
  title?: string;
  ariaLabel?: string;
  iconOnly?: boolean;
  /** Oculta el label en pantallas < sm, dejando solo el icono */
  responsive?: boolean;
}

/**
 * Item de navegación del AppHeader. Soporta submenús (children) y
 * visibilidad condicionada por autenticación/rol.
 */
export interface NavItem {
  label: string;
  href: string;
  icon?: ComponentType<{ className?: string }>;
  /** Solo visible si hay sesión iniciada */
  private?: boolean;
  /** Solo visible si el usuario tiene alguno de estos roles */
  role?: string | string[];
  children?: NavItem[];
}

/**
 * Acción tipada para el slot `actions` del AppHeader.
 */
export interface ActionItem {
  key: string;
  label?: string;
  icon?: ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'danger';
  title?: string;
}

/**
 * Configuración de información del usuario
 */
export interface UserInfoProps {
  userProfile: {
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    sessions_to_check_today?: unknown;
  };
  userInitial: string;
  nameRole: string | null;
}

/**
 * Configuración del entorno de desarrollo
 */
export interface EnvironmentConfig {
  isPre: boolean;
  isDev: boolean;
  isProd: boolean;
  hostname: string;
  bannerColor: string;
  bannerText: string;
  bannerIcon: ReactElement;
}

/**
 * Esquemas de colores predefinidos para botones
 */
export const COLOR_SCHEMES: Record<ColorScheme, {
  base: string;
  hover: string;
  focus: string;
  text: string;
}> = {
  primary: {
    base: 'bg-apple_green-500 border border-apple_green-600',
    hover: 'hover:bg-apple_green-400 hover:border-apple_green-700',
    focus: 'focus-visible:ring-apple_green-400',
    text: 'text-white'
  },
  secondary: {
    base: 'bg-ucol_purple-500 border border-ucol_purple-600',
    hover: 'hover:bg-ucol_purple-400 hover:border-ucol_purple-700',
    focus: 'focus-visible:ring-ucol_purple-400',
    text: 'text-white'
  },
  admin: {
    base: 'bg-gray-600 border border-gray-700',
    hover: 'hover:bg-gray-700 hover:border-gray-800',
    focus: 'focus-visible:ring-gray-400',
    text: 'text-white'
  },
  attendance: {
    base: 'bg-ultra_violet-600 border border-ultra_violet-700',
    hover: 'hover:bg-ultra_violet-700 hover:border-ultra_violet-800',
    focus: 'focus-visible:ring-ultra_violet-400',
    text: 'text-white'
  },
  danger: {
    base: 'bg-fire_brick-600 border border-fire_brick-700',
    hover: 'hover:bg-fire_brick-500 hover:border-fire_brick-800',
    focus: 'focus-visible:ring-fire_brick-400',
    text: 'text-white'
  },
  success: {
    base: 'bg-emerald-600 border border-emerald-700',
    hover: 'hover:bg-emerald-700 hover:border-emerald-800',
    focus: 'focus-visible:ring-emerald-400',
    text: 'text-white'
  }
};

/**
 * Clases base para efectos de interacción
 */
export const INTERACTION_CLASSES = [
  'shadow-md hover:shadow-lg active:shadow-sm',
  'hover:scale-[1.02] active:scale-[0.98]',
  'transition-all duration-200',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
].join(' ');

/**
 * Clases base para botones
 */
export const BUTTON_BASE_CLASSES = [
  'flex items-center gap-2 rounded-lg shrink-0 whitespace-nowrap',
  'text-sm sm:text-base py-2 px-3 sm:py-2 sm:px-5',
  'font-medium',
  'min-h-[40px]' // Ajusta el valor según el diseño
].join(' ');

/** Ícono renderizable como componente (react-icons, etc.) */
export type NavIcon = ComponentType<{ className?: string }>;
