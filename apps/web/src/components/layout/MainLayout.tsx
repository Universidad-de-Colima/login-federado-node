import type { ReactNode } from "react";
import { Link } from "react-router";
import type { IconType } from "react-icons";
import { MdArrowBack } from "react-icons/md";

interface MainLayoutProps {
  title: string;
  description?: string;
  icon?: IconType;
  /** Ruta del botón "volver" */
  backTo?: string;
  /** Color de acento (hex) del ícono */
  color?: string;
  children: ReactNode;
}

export function MainLayout({ title, description, icon: Icon, backTo, color, children }: MainLayoutProps) {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      {backTo && (
        <Link to={backTo} className="mb-4 inline-flex items-center gap-1 text-sm opacity-70 hover:opacity-100">
          <MdArrowBack aria-hidden /> Volver
        </Link>
      )}
      <header className="mb-6 flex items-center gap-3">
        {Icon && <Icon className="size-8" style={{ color }} aria-hidden />}
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm opacity-70">{description}</p>}
        </div>
      </header>
      {children}
    </main>
  );
}
