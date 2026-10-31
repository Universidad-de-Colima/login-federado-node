import { createContext, useContext, useState, useEffect } from "react";
import {
  getSession,
  redirectToSamlLogin,
  redirectToSamlLogout,
  type SamlUser,
} from "@/api/auth.api";

interface AuthContextValue {
  user:            SamlUser | null;
  isAuthenticated: boolean;
  /** Cargando sesión inicial */
  loading:         boolean;
  /** Redirige al IdP UCOL vía SAML 2.0 */
  login:           (returnTo?: string) => void;
  /** Cierra sesión en SimpleSAML y redirige al landing */
  logout:          () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<SamlUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* Al montar, verifica si ya existe sesión SAML activa */
  useEffect(() => {
    getSession()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login  = (returnTo?: string) => redirectToSamlLogin(returnTo);
  const logout = ()                  => redirectToSamlLogout();

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
