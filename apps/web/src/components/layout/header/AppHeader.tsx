import type { ActionItem, NavItem } from '@/types/layout.types';
import type { ReactNode } from 'react';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import clsx from 'clsx';
import { Button } from '@heroui/react';

import logoWhite from '@/assets/images/logo_white.svg';
import logoBlack from '@/assets/images/logo_black.svg';
import { NavButton } from './NavButton';
import { FaSignOutAlt, FaSignInAlt } from 'react-icons/fa';
import { useSyncedTheme } from '@/hooks/useSyncedTheme';
import { useScrolled } from '@/hooks/useScrolled';
import { useOutsideClick } from '@/hooks/useOutsideClick';
import {
  HamburgerIcon,
  HeaderUserDisplay,
  hexToRgba,
  pickByLuminance,
  renderHeaderActions,
  resolveBgColor,
  resolveColor,
  resolveContainerWidth,
  type HeaderUser,
} from './shared';
import { SC } from './scheme';
import { NavMenuItem } from './NavMenuItem';
import { MobileDrawer } from './MobileDrawer';

export type { HeaderUser };

export interface AppHeaderProps {
  /** Texto junto al logo */
  siteTitle?: string;
  /** Ruta del enlace del brand */
  siteLink?: string;
  /**
   * Variante del logo.
   * "auto" elige automáticamente: black en tema claro, white en tema oscuro.
   */
  logoVariant?: 'white' | 'black' | 'auto';
  /** Ítems de navegación (soportan submenús) */
  navItems?: NavItem[];
  /**
   * Color del borde inferior. Hex string o [hexLight, hexDark].
   * También acepta clases Tailwind si no empieza con "#".
   */
  borderBottom?: string | [string, string];
  /**
   * Color de fondo. Hex string o [hexLight, hexDark].
   * También acepta clases Tailwind si no empieza con "#".
   */
  background?: string | [string, string];
  /** Efecto mica/vidrio esmerilado (backdrop-blur + fondo semitransparente). */
  mica?: boolean;
  /**
   * Esquema de colores del contenido.
   * Si se omite, se deriva automáticamente del tema activo o de la luminancia del fondo.
   */
  scheme?: 'white' | 'black';
  /**
   * Modo de visualización del usuario.
   * "full" → nombre + rol/email + avatar · "avatar" → solo avatar con tooltip.
   */
  userDisplay?: 'full' | 'avatar';
  /** Usuario autenticado */
  user?: HeaderUser;
  /** Callback del botón "Cerrar sesión". Si se omite, el botón no aparece. */
  onLogout?: () => void;
  /** Callback del botón "Iniciar sesión". Si se omite, el botón no aparece. */
  onLogin?: () => void;
  /** Slot derecho: ReactNode libre o ActionItem[] tipado. */
  actions?: ReactNode | ActionItem[];
  /**
   * Ancho máximo del contenido interno del header.
   * Clave nombrada: "sm" | "md" | "lg" | "xl" | "2xl" | "screen-xl" — o valor CSS.
   */
  containerWidth?: string;
  /** Alineación de los ítems de navegación en desktop. Default: "right". */
  navAlign?: 'left' | 'center' | 'right';
}

/**
 * Header de navegación del sitio: sticky, con nav por rol/auth, tema
 * sincronizado, drawer móvil y esquema de color derivado del fondo.
 */
export function AppHeader({
  siteTitle,
  siteLink = '/',
  logoVariant,
  navItems = [],
  borderBottom,
  background,
  mica = false,
  scheme,
  user,
  onLogout,
  onLogin,
  actions,
  containerWidth,
  navAlign,
  userDisplay = 'full',
}: AppHeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [layoutMode, setLayoutMode] = useState<'full' | 'compact' | 'hamburger'>('full');
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const measureCompactRef = useRef<HTMLDivElement>(null);

  const currentTheme = useSyncedTheme();
  const scrolled = useScrolled();

  /* Resuelve arrays [light, dark] al color del tema actual */
  const { resolved: resolvedBg, hex: bgHex } = resolveBgColor(background, currentTheme);
  const resolvedBorder = resolveColor(borderBottom, currentTheme);
  const isHexBorder = resolvedBorder?.startsWith('#') ?? false;

  /* Scheme: prop explícita → luminancia del fondo → tema activo */
  const effectiveScheme: 'white' | 'black' =
    scheme ??
    pickByLuminance(bgHex, 'white', 'black') ??
    (currentTheme === 'dark' ? 'white' : 'black');
  const sc = SC[effectiveScheme];
  const effectiveNavAlign = navAlign ?? 'right';
  const { cwCls, cwStyle } = resolveContainerWidth(containerWidth);

  /* Logo variant — undefined se trata igual que "auto" */
  const effectiveLogoVariant: 'white' | 'black' =
    !logoVariant || logoVariant === 'auto'
      ? (pickByLuminance(bgHex, 'white', 'black') ?? (currentTheme === 'dark' ? 'white' : 'black'))
      : logoVariant;

  const logo = effectiveLogoVariant === 'black' ? logoBlack : logoWhite;
  const logoDrawer = currentTheme === 'dark' ? logoWhite : logoBlack;

  const navClassName_ = clsx(
    'p-0',
    mica && 'backdrop-blur-[14px] backdrop-saturate-150',
    !bgHex &&
      !resolvedBg &&
      (mica ? 'bg-white/80 dark:bg-ucol_gray_dark-200/10' : 'bg-white dark:bg-ucol_gray_dark-200'),
    !bgHex && resolvedBg,
    !isHexBorder && resolvedBorder && 'border-b-6',
    !isHexBorder && resolvedBorder
  );

  const navStyle: React.CSSProperties = {
    ...(bgHex ? { backgroundColor: mica ? hexToRgba(bgHex, 0.82) : bgHex } : {}),
    ...(isHexBorder ? { borderBottom: `5px solid ${resolvedBorder!}` } : {}),
  };

  function toggleSubmenu(href: string) {
    setOpenSubmenu((prev) => (prev === href ? null : href));
  }

  useOutsideClick(headerRef, () => setOpenSubmenu(null));

  useEffect(() => {
    setOpenSubmenu(null);
    setDrawerOpen(false);
  }, [location.pathname]);

  /*
   * Detecta si nav+acciones caben en el ancho disponible probando dos anchos
   * "medidos" sin wrap: uno completo (labels visibles) y uno compacto (solo
   * íconos + tooltip). Si ni el compacto cabe, se fuerza el modo hamburguesa
   * aunque el viewport sea >= lg.
   */
  useLayoutEffect(() => {
    const container = contentRef.current;
    const full = measureRef.current;
    const compact = measureCompactRef.current;
    if (!container || !full || !compact) return;

    const check = () => {
      const available = container.clientWidth + 1;
      if (full.scrollWidth <= available) {
        setLayoutMode('full');
      } else if (compact.scrollWidth <= available) {
        setLayoutMode('compact');
      } else {
        setLayoutMode('hamburger');
      }
    };

    check();

    const ro = new ResizeObserver(check);
    ro.observe(container);

    return () => ro.disconnect();
  }, [navItems, actions, user, onLogout, onLogin, siteTitle, userDisplay]);

  const isHamburger = layoutMode === 'hamburger';
  const isCompact = layoutMode === 'compact';

  return (
    <>
      <header ref={headerRef} className={clsx('sticky z-40', scrolled ? 'top-4' : 'top-0')}>
        <div
          className={clsx(
            'transition-all duration-300 ease-in-out',
            scrolled ? 'mx-3 mt-2 shadow-2xl rounded-full' : ''
          )}
        >
          <nav className={clsx(navClassName_, scrolled && 'rounded-2xl')} style={navStyle}>
            <div
              ref={contentRef}
              className={clsx(
                'box-border w-full px-4 mx-auto flex items-center flex-nowrap relative',
                cwCls
              )}
              style={cwStyle}
            >
              {/* Medidor invisible: replica brand + nav + acciones sin wrap para detectar overflow real, sin depender solo del breakpoint lg */}
              <div
                ref={measureRef}
                aria-hidden="true"
                inert
                className="absolute inset-0 flex items-center flex-nowrap invisible pointer-events-none whitespace-nowrap overflow-hidden"
              >
                <div className="flex items-center py-3 shrink-0">
                  <img alt="" className="h-8.75 w-auto object-contain shrink-0" src={logo} />
                  {siteTitle && <span className="text-xs whitespace-nowrap">{siteTitle}</span>}
                </div>
                <ul className="flex flex-row list-none p-0 m-0 items-center gap-1 shrink-0">
                  {navItems.map((item) => (
                    <NavMenuItem
                      key={item.href}
                      item={item}
                      siblings={navItems}
                      openSubmenu={null}
                      sc={sc}
                      onToggleSubmenu={() => {}}
                    />
                  ))}
                </ul>
                {(actions || user || onLogout || onLogin) && (
                  <div className="flex items-center gap-2 shrink-0">
                    {actions && (
                      <div className="flex items-center gap-2 px-1">
                        {renderHeaderActions(actions, {
                          textClass: sc.text,
                          hoverClass: sc.itemHover,
                        })}
                      </div>
                    )}
                    {(user || onLogout) && (
                      <div
                        className={`flex items-center gap-2 shrink-0 whitespace-nowrap pl-3 border-l ${sc.divider}`}
                      >
                        {user && (
                          <HeaderUserDisplay
                            avatarBgClass={sc.avatarBg}
                            avatarRingClass={sc.avatarRing}
                            avatarTextClass={sc.avatarText}
                            textClass={sc.text}
                            textMutedClass={sc.textMuted}
                            user={user}
                            userDisplay={userDisplay}
                          />
                        )}
                        {onLogout && (
                          <NavButton
                            title="Cerrar sesión"
                            onClick={() => {}}
                            colorScheme="danger"
                            icon={FaSignOutAlt}
                            label="Salir"
                          />
                        )}
                      </div>
                    )}
                    {onLogin && (
                      <NavButton
                        colorScheme="secondary"
                        icon={FaSignInAlt}
                        label="Iniciar sesión"
                        responsive
                        title="Iniciar sesión"
                        onClick={() => {}}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Medidor invisible (compacto): íconos + tooltip, avatar solo, sin labels — para saber si cabe la versión compacta antes de caer a hamburguesa */}
              <div
                ref={measureCompactRef}
                aria-hidden="true"
                inert
                className="absolute inset-0 flex items-center flex-nowrap invisible pointer-events-none whitespace-nowrap overflow-hidden"
              >
                <div className="flex items-center py-3 shrink-0">
                  <img alt="" className="h-8.75 w-auto object-contain shrink-0" src={logo} />
                  {siteTitle && <span className="text-xs whitespace-nowrap">{siteTitle}</span>}
                </div>
                <ul className="flex flex-row list-none p-0 m-0 items-center gap-1 shrink-0">
                  {navItems.map((item) => (
                    <NavMenuItem
                      key={item.href}
                      item={item}
                      siblings={navItems}
                      openSubmenu={null}
                      sc={sc}
                      compact
                      onToggleSubmenu={() => {}}
                    />
                  ))}
                </ul>
                {(actions || user || onLogout || onLogin) && (
                  <div className="flex items-center gap-2 shrink-0">
                    {actions && (
                      <div className="flex items-center gap-2 px-1">
                        {renderHeaderActions(actions, {
                          textClass: sc.text,
                          hoverClass: sc.itemHover,
                        })}
                      </div>
                    )}
                    {(user || onLogout) && (
                      <div
                        className={`flex items-center gap-2 shrink-0 whitespace-nowrap pl-3 border-l ${sc.divider}`}
                      >
                        {user && (
                          <HeaderUserDisplay
                            avatarBgClass={sc.avatarBg}
                            avatarRingClass={sc.avatarRing}
                            avatarTextClass={sc.avatarText}
                            textClass={sc.text}
                            textMutedClass={sc.textMuted}
                            user={user}
                            userDisplay="avatar"
                          />
                        )}
                        {onLogout && (
                          <NavButton
                            iconOnly
                            title="Cerrar sesión"
                            onClick={() => {}}
                            colorScheme="danger"
                            icon={FaSignOutAlt}
                            label="Salir"
                          />
                        )}
                      </div>
                    )}
                    {onLogin && (
                      <NavButton
                        colorScheme="secondary"
                        icon={FaSignInAlt}
                        iconOnly
                        label="Iniciar sesión"
                        title="Iniciar sesión"
                        onClick={() => {}}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Brand */}
              <Link
                className={clsx(
                  'flex items-center no-underline relative py-3 shrink-0',
                  effectiveNavAlign === 'right' && 'me-auto'
                )}
                to={siteLink}
              >
                <img
                  alt={siteTitle ?? 'UCOL'}
                  className="h-8.75 w-auto object-contain shrink-0"
                  src={logo}
                />
                {siteTitle && (
                  <span
                    className={`absolute left-10.75 bottom-1.25 text-xs whitespace-nowrap ${sc.text}`}
                  >
                    {siteTitle}
                  </span>
                )}
              </Link>

              {/* Hamburger (< lg, o cuando el nav no cabe aunque el viewport sea >= lg) */}
              <Button
                variant="ghost"
                aria-controls="navbar-menu"
                aria-expanded={drawerOpen ? 'true' : 'false'}
                aria-label="Mostrar menú"
                className={clsx(
                  'ms-auto p-2 rounded transition-colors',
                  sc.hamburger,
                  !isHamburger && 'lg:hidden'
                )}
                type="button"
                onClick={() => setDrawerOpen((v) => !v)}
              >
                <HamburgerIcon className="w-5 h-5" />
              </Button>

              {/* Nav desktop (lg+, solo si cabe; en modo compacto solo íconos + tooltip) */}
              <div
                className={clsx(
                  isHamburger ? 'hidden' : 'hidden lg:flex',
                  'lg:items-center shrink-0',
                  effectiveNavAlign === 'center' && 'absolute left-1/2 -translate-x-1/2',
                  effectiveNavAlign === 'left' && 'ms-2'
                )}
                id="navbar-menu"
              >
                <ul className="flex flex-row list-none p-0 m-0 items-center gap-1 shrink-0">
                  {navItems.map((item) => (
                    <NavMenuItem
                      key={item.href}
                      item={item}
                      siblings={navItems}
                      openSubmenu={openSubmenu}
                      sc={sc}
                      compact={isCompact}
                      onToggleSubmenu={toggleSubmenu}
                    />
                  ))}
                </ul>
              </div>

              {/* Derecha: acciones + usuario (lg+, solo si cabe; en modo compacto avatar + botones solo ícono) */}
              {(actions || user || onLogout || onLogin) && (
                <div
                  className={clsx(
                    isHamburger ? 'hidden' : 'hidden lg:flex',
                    'items-center gap-2 shrink-0',
                    effectiveNavAlign !== 'right' && 'ms-auto'
                  )}
                >
                  {actions && (
                    <div className="flex items-center gap-2 px-1">
                      {renderHeaderActions(actions, {
                        textClass: sc.text,
                        hoverClass: sc.itemHover,
                      })}
                    </div>
                  )}

                  {(user || onLogout) && (
                    <div
                      className={`flex items-center gap-2 shrink-0 whitespace-nowrap lg:pl-3 lg:border-l ${sc.divider}`}
                    >
                      {user && (
                        <HeaderUserDisplay
                          avatarBgClass={sc.avatarBg}
                          avatarRingClass={sc.avatarRing}
                          avatarTextClass={sc.avatarText}
                          textClass={sc.text}
                          textMutedClass={sc.textMuted}
                          user={user}
                          userDisplay={isCompact ? 'avatar' : userDisplay}
                        />
                      )}

                      {onLogout && (
                        <NavButton
                          iconOnly={isCompact}
                          title="Cerrar sesión"
                          onClick={onLogout}
                          colorScheme="danger"
                          icon={FaSignOutAlt}
                          label="Salir"
                        />
                      )}
                    </div>
                  )}

                  {onLogin && (
                    <NavButton
                      colorScheme="secondary"
                      icon={FaSignInAlt}
                      iconOnly={isCompact}
                      label="Iniciar sesión"
                      responsive
                      title="Iniciar sesión"
                      onClick={onLogin}
                    />
                  )}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Drawer mobile (< lg) */}
      <MobileDrawer
        actions={actions}
        logoSrc={logoDrawer}
        navItems={navItems}
        open={drawerOpen}
        sc={sc}
        siteTitle={siteTitle}
        user={user}
        onClose={() => setDrawerOpen(false)}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </>
  );
}
