import { createContext, useContext, type ReactNode } from "react";

import { useSyncedTheme } from "@/hooks/useSyncedTheme";

type Theme = "light" | "dark";

interface ThemeContextType {
	theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Expone el tema resuelto (light/dark). El estado real lo gestiona HeroUI
 * (`useTheme`) y se refleja en <html>; aquí solo se observa para que
 * cualquier componente (p. ej. el Loader) pueda leerlo con `useTheme()`.
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const theme = useSyncedTheme();
	return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme debe ser usado dentro de ThemeProvider");
	}
	return context;
};
