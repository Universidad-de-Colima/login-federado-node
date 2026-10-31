import { IconType } from "react-icons";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import clsx from "clsx";
import React from "react";

// Interfaz de las propiedades del componente.
// Se ha refactorizado para que la ruta sea una string o un objeto Location.
export interface CardExpProps {
  icon: IconType;
  title: string;
  description: string;
  badge?: string;
  gradient: string; // Color hexadecimal (#039BE5) o clase de Tailwind (bg-gradient-to-br from-blue-500...)
  color?: string; // Color hexadecimal explícito; tiene prioridad sobre `gradient` para el acento
  to: string;
  external?: boolean;
}

const CardExp: React.FC<CardExpProps> = ({
  icon: Icon,
  title,
  description,
  gradient,
  color,
  to,
  external = false,
  badge = '',
}) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (external) {
      window.location.href = to;
    } else {
      navigate(to);
    }
  };

  // El acento (icono, título, bordes) usa `color` si viene explícito; si no,
  // se intenta con `gradient` cuando es un hex directo; si nada aplica
  // (ej. clase de Tailwind heredada), se usa el verde de marca.
  const isHexColor = gradient.startsWith('#');
  const accent = color || (isHexColor ? gradient : undefined);

  return (
    <motion.a
      href={to}
      onClick={handleClick}
      className={clsx(
        'relative group block p-5 sm:p-6 rounded-2xl overflow-hidden cursor-pointer h-full',
        'bg-white dark:bg-ucol_gray_dark-300',
        'transition-all duration-300 ease-out',
        'shadow-sm hover:shadow-xl hover:-translate-y-0.5',
        !accent && 'text-ucol_green-500'
      )}
      style={accent ? ({ '--accent': accent } as React.CSSProperties) : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icono decorativo de fondo, muy sutil */}
      <div
        className={clsx(
          'absolute -top-4 -right-4 text-[120px] opacity-[0.06] dark:opacity-[0.2]',
          'transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-6',
          !accent && 'text-ucol_green-500'
        )}
        style={accent ? { color: 'var(--accent)' } : undefined}
      >
        <Icon />
      </div>

      {/* -- Contenido Principal -- */}
      <div className="relative z-10 flex items-start gap-x-4">
        <div
          className={clsx(
            'w-14 h-14 rounded-full flex items-center justify-center shrink-0',
            'transition-colors duration-300',
            !accent && 'bg-ucol_green-500/10 group-hover:bg-ucol_green-500/15'
          )}
          style={
            accent
              ? { backgroundColor: 'color-mix(in srgb, var(--accent) 12%, transparent)' }
              : undefined
          }
        >
          <Icon
            className={clsx('text-4xl', !accent && 'text-ucol_green-500')}
            style={accent ? { color: 'var(--accent)' } : undefined}
          />
        </div>

        <h2
          className={clsx(
            'flex-1 text-xl tracking-tight mb-2 font-extrabold transition-colors duration-300',
                        'text-accent dark:text-white',
            !accent && 'text-ucol_green-500'
          )}
        >
          {title}
        </h2>
      </div>
      <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</span>
      {badge && (
        <div className="mt-3">
          <span className="px-2 py-1 text-xs font-semibold text-white bg-accent rounded-full shadow-sm">
            {badge}
          </span>
        </div>
      )}
    </motion.a>
  );
};

export default CardExp;
