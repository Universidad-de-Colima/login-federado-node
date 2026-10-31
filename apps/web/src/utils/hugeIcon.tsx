import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";
import type { IconType, IconBaseProps } from "react-icons";

// Adapta un icono de Hugeicons (IconSvgElement) al contrato `IconType` de
// react-icons que consumen CardExp/AdminMenu, para poder usarlos sin tocar
// esos componentes. `size="1em"` replica el comportamiento por defecto de
// react-icons (escala junto con el font-size heredado, ej. clases text-2xl).
export function hugeIcon(icon: IconSvgElement): IconType {
  const Adapted: IconType = ({ className, style, size, color }: IconBaseProps) => (
    <HugeiconsIcon
      icon={icon}
      size={size ?? "1em"}
      color={color}
      className={className}
      style={style}
    />
  );
  return Adapted;
}
