import type { IconType } from "react-icons";

export interface MenuItem {
  icon: IconType;
  title: string;
  description: string;
  /** Clases de gradiente de Tailwind para la tarjeta */
  gradient: string;
  /** Ruta relativa a `basePath` */
  to: string;
}
