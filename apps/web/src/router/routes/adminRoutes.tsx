import { lazy } from "react";
import { type RouteObject } from "react-router";

import { ProtectedRoute } from "@/contexts/ProtectedRoute";

const UsersPage = lazy(() => import("@/pages/admin/UsersPage"));

export const adminRoutes: RouteObject = {
	path: "admin",
	element: <ProtectedRoute allRoles />,
	children: [
		{
			path: "users",
			element: <UsersPage />,
			handle: { breadcrumb: "Usuarios" },
		},
	],
};
