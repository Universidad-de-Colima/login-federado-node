import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";

import { AuthProvider } from "@/contexts/AuthContext";
import { Provider } from "./provider";
import router from "@/router";
import "@/styles/globals.css";
import { initAccentTheme } from "@/hooks/useAccentTheme";

initAccentTheme();

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<Provider>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</Provider>
	</React.StrictMode>,
);
