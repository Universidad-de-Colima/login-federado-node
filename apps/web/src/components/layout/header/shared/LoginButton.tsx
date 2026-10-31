import { FaSignInAlt } from 'react-icons/fa';

import { NavButton } from '../NavButton';

/** Botón "Iniciar sesión", wrapper delgado de NavButton. */
export function HeaderLoginButton({ onClick, responsive }: { onClick: () => void; responsive?: boolean }) {
  return (
    <NavButton
      colorScheme="secondary"
      icon={FaSignInAlt}
      label="Iniciar sesión"
      responsive={responsive}
      title="Iniciar sesión"
      onClick={onClick}
    />
  );
}
