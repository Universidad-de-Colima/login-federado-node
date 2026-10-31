import { ReactNode } from "react";
import { EmptyState } from "@heroui/react";
import { MdErrorOutline } from "react-icons/md";

interface ErrorStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

/**
 * Estado de error/vacio generico (401, 404, listas sin datos, etc).
 * Reemplaza al custom element <elegant-error>, que dependia del shell
 * institucional externo ya retirado (ver docs/plan-migracion-frontend.md).
 */
export function ErrorState({ icon, title, description, action }: ErrorStateProps) {
  return (
    <EmptyState.Root className="flex flex-col items-center gap-3 py-12 text-center">
      <span className="text-5xl text-gray-400 dark:text-gray-500">
        {icon ?? <MdErrorOutline />}
      </span>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      {description && (
        <p className="max-w-md text-sm text-gray-600 dark:text-gray-300">{description}</p>
      )}
      {action}
    </EmptyState.Root>
  );
}
