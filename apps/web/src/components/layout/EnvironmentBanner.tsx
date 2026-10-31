import { useEnvironment } from '@/hooks/useEnvironment';
/**
 * Banner de información del entorno (desarrollo/pruebas)
*/
export const EnvironmentBanner = () => {
  const config = useEnvironment();
  if (config.isProd) return null;

  return (
    <div className={`w-full ${config.bannerColor} text-white text-sm py-2 px-3 flex items-center justify-center gap-3 shadow-md`}>
      <span className="shrink-0">{config.bannerIcon}</span>
      <span className="hidden md:inline font-semibold min-w-0 text-center">
        {config.bannerText}
      </span>
      <span className="inline md:hidden font-medium min-w-0 text-center">
        {config.bannerShortText}
      </span>
    </div>
  );
};
