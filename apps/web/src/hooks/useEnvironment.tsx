import { useMemo } from 'react';

/**
 * Configuración extendida del entorno
 */
export interface ExtendedEnvironmentConfig {
  isPre: boolean;
  isDev: boolean;
  isProd: boolean;
  hostname: string;
  bannerColor: string;
  bannerText: string;
  bannerShortText: string;
  bannerIcon: React.ReactElement | null;
}

/**
 * Custom hook para manejar la configuración del entorno
 * @returns Configuración del entorno actual
 */
export const useEnvironment = (): ExtendedEnvironmentConfig => {
  return useMemo(() => {
    const hostname = window.location.hostname;
    const isPre = hostname === "pre-datacenter.ucol.mx";
    const isDev = hostname === "localhost";
    const isProd = !isPre && !isDev;

    const getEnvironmentConfig = () => {
      if (isPre) {
        return {
          bannerColor: "bg-gradient-to-r from-red-700 to-red-500",
          bannerText: "Estás en el servidor de pruebas. Cambios aquí no afectan al entorno real.",
          bannerShortText: "Modo pruebas",
          bannerIcon: (
            <svg 
              className="w-5 h-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
          )
        };
      }

      if (isDev) {
        return {
          bannerColor: "bg-gradient-to-r from-yellow-600 to-yellow-400",
          bannerText: "Estás en modo desarrollo local. Cambios aquí no afectan al entorno real.",
          bannerShortText: "Modo desarrollo",
          bannerIcon: (
            <svg 
              className="w-5 h-5" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" 
              />
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" 
              />
            </svg>
          )
        };
      }

      return {
        bannerColor: "",
        bannerText: "",
        bannerShortText: "",
        bannerIcon: null
      };
    };

    const config = getEnvironmentConfig();

    return {
      isPre,
      isDev,
      isProd,
      hostname,
      bannerColor: config.bannerColor,
      bannerText: config.bannerText,
      bannerShortText: config.bannerShortText,
      bannerIcon: config.bannerIcon
    };
  }, []);
};