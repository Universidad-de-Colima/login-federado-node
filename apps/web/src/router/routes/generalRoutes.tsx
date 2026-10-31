import { lazy } from "react";

import { ProtectedRoute } from "@/contexts/ProtectedRoute";
import RootLayout from "@/layouts/RootLayout";
import NotFound from "@/components/errors/NotFound";

const PublicPage = lazy(() => import("@/pages/PublicPage"));

export const generalRoutes = {
	path: "/",
	element: (
		<ProtectedRoute requiredRole="public">
			<RootLayout />
		</ProtectedRoute>
	),
	errorElement: <NotFound />,
	children: [
		{
			path: "",
			element: <PublicPage />,
			handle: { breadcrumb: "Panel" },
		},
	],
};
