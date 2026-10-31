import {
  NavButtonProps,
  COLOR_SCHEMES,
  INTERACTION_CLASSES,
  BUTTON_BASE_CLASSES,
} from '@/types/layout.types';
import { HeaderTooltip } from './shared';

/**
 * Componente NavButton mejorado con esquemas de colores predefinidos
 */
export const NavButton = ({
  icon: Icon,
  label,
  onClick,
  colorScheme,
  ariaLabel,
  title,
  iconOnly = false,
  responsive = false,
}: NavButtonProps) => {
  const colors = COLOR_SCHEMES[colorScheme];

  const buttonClasses = [
    BUTTON_BASE_CLASSES,
    INTERACTION_CLASSES,
    colors.base,
    colors.hover,
    colors.focus,
    colors.text,
  ].join(' ');

  const labelClassName = responsive ? 'hidden sm:inline' : undefined;

  const button = (
    <button
      onClick={onClick}
      aria-label={ariaLabel || label}
      className={buttonClasses}
      title={iconOnly ? undefined : title}
    >
      <Icon className="h-4 w-5" />
      {!iconOnly && <span className={labelClassName}>{label}</span>}
    </button>
  );

  if (iconOnly) {
    return (
      <HeaderTooltip label={title ?? label} placement="bottom-end">
        {button}
      </HeaderTooltip>
    );
  }

  return button;
};
