import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingIndicatorMiniProps {
  label?: string;
  logoSrc?: string;
}

export default function LoadingIndicatorMini({
  label = "Cargando contenido",
  logoSrc,
}: LoadingIndicatorMiniProps) {
  return (
    <div className="w-[300px] h-[300px] flex flex-col justify-center items-center bg-white/50 rounded-lg m-auto absolute inset-0 backdrop-blur-[10px] shadow-md">
      {logoSrc ? (
        <div className="w-20 h-20">
          <img src={logoSrc} alt="Logo" className="w-full h-full object-contain" />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-full bg-tea_green-900 flex items-center justify-center">
          <span className="text-2xl font-black text-tea_green-500">U</span>
        </div>
      )}

      <h2 className="text-lg font-extrabold mt-4 text-center text-dark">
        <span className="text-tea_green-500">UCOL</span>
      </h2>

      <div className="mt-3 text-tea_green-500 text-sm font-medium tracking-wider flex items-center gap-1">
        <span>●</span>
        {label}
        <span>●</span>
      </div>

      <AiOutlineLoading3Quarters className="text-tea_green-500 text-4xl mt-4 animate-spin" />
    </div>
  );
}
