import { ThemeProvider } from "@/contexts/ThemeContext";

export function Provider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
