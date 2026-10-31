import { redirectToSamlLogin } from "@/api/auth.api";

/**
 * Redirige al login institucional (SimpleSAML).
 * @param redirectUrl - URL a la que volver tras iniciar sesión (opcional)
 */
export const handleRedirect = (redirectUrl?: string) => {
  redirectToSamlLogin(redirectUrl);
};
