import type { NavItem } from "@/types/layout.types";
import type { HeaderUser } from "@/components/layout/header/AppHeader";
import type { SamlUser } from "@/api/auth.api";

import { useMemo } from "react";
import { Outlet } from "react-router";

import { AppHeader } from "@/components/layout/header/AppHeader";
import { useAuth } from "@/contexts/AuthContext";
import { FaHome, FaUsers } from "react-icons/fa";
import { ThemeAccentToggle } from "@/components/ui/ThemeAccentToggle";
import { ACCENT_PRESETS, useAccentTheme } from "@/hooks/useAccentTheme";
import { useSyncedTheme } from "@/hooks/useSyncedTheme";
import { pickByLuminance } from "@/components/layout/header/shared";
import { EnvironmentBanner } from "./EnvironmentBanner";

function samlToHeaderUser(user: SamlUser | null): HeaderUser | undefined {
  if (!user) return undefined;
  return {
    name: user.uNombre,
    role: user.role ?? undefined,
    email: user.uCorreo,
  };
}

function filterNavItems(
  items: NavItem[],
  isAuthenticated: boolean,
  userRole?: string,
): NavItem[] {
  return items.reduce<NavItem[]>((acc, item) => {
    if (item.private && !isAuthenticated) return acc;

    if (item.role) {
      const allowed = Array.isArray(item.role) ? item.role : [item.role];
      if (!userRole || !allowed.includes(userRole)) return acc;
    }

    const filtered: NavItem = item.children?.length
      ? {
        ...item,
        children: filterNavItems(item.children, isAuthenticated, userRole),
      }
      : item;

    acc.push(filtered);
    return acc;
  }, []);
}

const NAV_ITEMS: NavItem[] = [
  { label: "Inicio", href: "/", icon: FaHome },
  { label: "Usuarios", href: "/admin/users", icon: FaUsers, private: true },
];

export default function RootLayout({ children }: { children?: React.ReactNode }) {
  const { accent, setAccent } = useAccentTheme();
  const currentTheme = useSyncedTheme();
  // El acento "default" es blanco (negro en dark): scheme/logo se derivan de su luminancia
  const headerBgHex = currentTheme === 'dark' ? accent.dark : accent.light;
  const headerScheme = pickByLuminance(headerBgHex, 'white', 'black') ?? 'white';
  const { user, isAuthenticated, login, logout } = useAuth();

  const visibleNavItems = useMemo(
    () => filterNavItems(NAV_ITEMS, isAuthenticated, user?.role ?? undefined),
    [isAuthenticated, user?.role],
  );

  return (
    <>
      <main className="bg-gray-50 dark:bg-ucol_gray_dark-200 min-h-screen">
        <div className="sticky z-40">
          <EnvironmentBanner />
          <AppHeader
            actions={
              <ThemeAccentToggle
                accent={accent}
                accentPresets={ACCENT_PRESETS}
                onAccentChange={setAccent}
                onlyWhite={headerScheme === 'white'}
              />
            }
            background={
              accent.name === 'default'
                ? 'bg-white dark:bg-ucol_gray_dark-300'
                : 'bg-accent/70 dark:bg-accent/20'
            }
            scheme={headerScheme}
            logoVariant={headerScheme}
            navAlign="center"
            borderBottom={[accent.border?.light ?? accent.light, accent.border?.dark ?? accent.dark]}
            mica
            userDisplay="avatar"
            // variant="compact"
            // position="left"
            // containerWidth="xl"
            navItems={visibleNavItems}
            siteTitle={PROJ_NAME}
            user={samlToHeaderUser(user)}
            onLogin={!user ? () => login() : undefined}
            onLogout={user ? logout : undefined}
          />
          {children ?? <Outlet />}
        </div>
      </main>
      <footer className="w-full border-t bg-gray-800 py-3 text-center text-white">
        © Derechos Reservados {PERIOD} Universidad de Colima
      </footer>
    </>
  );
}
