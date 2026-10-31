import { createBrowserRouter } from "react-router";

import { generalRoutes } from "./routes/generalRoutes";
import { adminRoutes } from "./routes/adminRoutes";

import LandingLayout from "@/layouts/LandingLayout";
import LandingPage from "@/pages/LandingPage";
import NotFound from "@/components/errors/NotFound";
import Unauthorized401 from "@/pages/401";

const router = createBrowserRouter(
	[
		// Landing — layout propio, sin AppHeader
		{
			path: "/portal",
			element: (
				<LandingLayout>
					<LandingPage />
				</LandingLayout>
			),
		},
		// Resto de rutas con RootLayout (AppHeader incluido)
		{
			...generalRoutes,
			children: [
				...generalRoutes.children,
				adminRoutes,
				{ path: "401", element: <Unauthorized401 /> },
				{ path: "*", element: <NotFound /> },
			],
		},
	],
	{ basename: BASE_PATH },
);

export default router;
