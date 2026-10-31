import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// env-cmd inyecta VITE_* en process.env antes de que corra Vite
const BASE_PATH = process.env.VITE_BASE_PATH ?? "/";
const API_URL   = process.env.VITE_API_URL   ?? "/api";
const PROJ_NAME = process.env.VITE_PROJ_NAME ?? "Universidad de Colima";

const PERIOD = process.env.VITE_PERIOD ?? "2025-2029";

export default defineConfig({
  plugins: [react(), tailwindcss()],

  base: BASE_PATH,

  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  define: {
    PROJ_NAME: JSON.stringify(PROJ_NAME),
    BASE_PATH: JSON.stringify(BASE_PATH),
    API_URL:   JSON.stringify(API_URL),
    PERIOD:    JSON.stringify(PERIOD),
  },

  server: {
    port: 3000,
    host: "0.0.0.0",
    proxy: {
      /* La API NestJS pasa por el gateway de Docker (4006, origen registrado en el IdP) */
      [API_URL]: {
        target: "http://localhost:4006",
        changeOrigin: true,
      },
    },
  },
});
