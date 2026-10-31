import { Link, Outlet, useLocation } from "react-router";
import type { IconType } from "react-icons";
import clsx from "clsx";
import type { MenuItem } from "./Sidebar";

interface SidebarLandingProps {
  items: MenuItem[];
  pageTitle: string;
  pageDescription?: string;
  pageIcon?: IconType;
  basePath: string;
}

/**
 * Landing de módulos: muestra la cuadrícula de tarjetas en `basePath`
 * y delega en <Outlet /> cuando se navega a una subruta.
 */
export function SidebarLanding({ items, pageTitle, pageDescription, pageIcon: PageIcon, basePath }: SidebarLandingProps) {
  const { pathname } = useLocation();
  const isRoot = pathname.replace(/\/$/, "") === basePath.replace(/\/$/, "");

  if (!isRoot) return <Outlet />;

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <header className="mb-6 flex items-center gap-3">
        {PageIcon && <PageIcon className="size-8" aria-hidden />}
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          {pageDescription && <p className="text-sm opacity-70">{pageDescription}</p>}
        </div>
      </header>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map(({ icon: Icon, title, description, gradient, to }) => (
          <Link
            key={to}
            to={`${basePath}/${to}`}
            className={clsx("flex flex-col gap-2 rounded-3xl p-5 text-white shadow-sm transition hover:scale-[1.02]", gradient)}
          >
            <Icon className="size-7" aria-hidden />
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm opacity-90">{description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
