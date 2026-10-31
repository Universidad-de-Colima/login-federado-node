import type { ReactNode } from "react";

import { Navigate, Outlet, useLocation } from "react-router";

import { useAuth } from "./AuthContext";
import LoaderFull from "@/components/loaders/Loader";

interface ProtectedRouteProps {
	/**
	 * "public"  → renderiza siempre, sin importar si el usuario está autenticado.
	 * Cualquier otro string → requiere autenticación y que user.uTipo coincida.
	 */
	requiredRole?: string;
	/** Cualquier usuario autenticado, sin importar su rol. */
	allRoles?: boolean;
	children?: ReactNode;
}

export function ProtectedRoute({
	requiredRole,
	allRoles,
	children,
}: ProtectedRouteProps) {
	const { user, isAuthenticated, loading, login } = useAuth();
	const location = useLocation();

	if (loading) return <LoaderFull />;

	// Rutas públicas: siempre renderizar
	if (requiredRole === "public") {
		return children ? <>{children}</> : <Outlet />;
	}

	// Sin sesión → redirige al IdP
	if (!isAuthenticated) {
		const returnTo = window.location.origin + BASE_PATH + location.pathname;
		login(returnTo);
		return <Navigate to="/" replace />;
	}

	// Cualquier rol autenticado
	if (allRoles) {
		return children ? <>{children}</> : <Outlet />;
	}

	// Rol específico requerido — compara contra el rol de BD (user.role)
	if (requiredRole && user?.role !== requiredRole) {
		return <Navigate to="/401" replace />;
	}

	return children ? <>{children}</> : <Outlet />;
}
