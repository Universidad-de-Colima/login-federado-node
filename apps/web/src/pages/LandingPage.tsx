import { Button } from '@heroui/react';
import logoSVG from "@/assets/images/landing.jpg";
import logoWhiteSVG from "@/assets/images/logo_white.svg";
import { handleRedirect } from '@/utils/redirect.utils';
import { FaSignInAlt } from 'react-icons/fa';

export default function LandingPage() {

  return (
    <div
      className="relative overflow-hidden min-h-screen bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${logoSVG})` }}
    >
      {/* Overlay con efecto mica/blur en forma de media luna */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 backdrop-blur-[3px] bg-gradient-to-b from-white/5 via-black/30 to-black/10"
          id='blurLogin'
        />
      </div>

      {/* Contenido directo sin card */}
      <div className="relative z-10 flex items-center min-h-[calc(100vh-81px)] px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-wrap">
            {/* Centrado en móvil, izquierda en desktop */}
            <div className="w-full md:w-1/2 lg:w-5/12 text-center md:text-left">
              <img
                src={logoWhiteSVG}
                alt="Logo UCOL"
                draggable={false}
                className='mb-10 mx-auto lg:mx-0 md:h-12 h-10 object-contain'
              />
              <h1 className="font-black text-white mb-6 mt-10 text-3xl sm:text-4xl leading-tight tracking-wide">
                {PROJ_NAME}
              </h1>
              <p className="text-lg text-gray-100 mb-10 font-semibold">
                Para acceder al sistema, por favor inicie sesión.
              </p>
              <Button
                variant="primary"
                onClick={() => handleRedirect()}
                size="lg"
                className="bg-apple_green-500 hover:bg-apple_green-600 border-none h-16 px-12 text-xl font-bold shadow-2xl hover:shadow-3xl transition-all hover:scale-105 w-full sm:w-auto hover:shadow-[0_0_20px_5px_#a1bc41,0_0_40px_10px_#a1bc41]"
              >
                <FaSignInAlt size={24} />
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}