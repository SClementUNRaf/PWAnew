'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MenuPrincipalSkeleton from "./MenuPrincipalSkeleton";
import Link from "next/link";

export default function MenuPrincipal() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Fondo de pantalla */}
      <div className="absolute inset-0 -z-10 animate-nebulosa bg-[radial-gradient(circle_at_center,_#0e1e2b,_#043e46,_#6a4f0b)] bg-[length:250%_250%]" />

        <style jsx>{`
          .animate-nebulosa {
            animation: nebulosaMove 30s ease-in-out infinite;
          }
          @keyframes nebulosaMove {
            0% { background-position: 40% 0%; }
            50% { background-position: 60% 100%; }
            100% { background-position: 40% 0%; }
          }
        `}</style>

      {/* Contenido */}
      {isLoading ? (
        <MenuPrincipalSkeleton />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <div className="p-4 w-full max-w-md space-y-4">
            <div className="h-40 flex items-center justify-center">
              <div className="p-3 rounded-lg">
                <img
                  src="/menu-principal/unraf_01.png"
                  alt="Logo UNRaf"
                  className="h-20 w-auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <a
                href="https://guarani.unraf.edu.ar/autogestion/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#c7c7c7] h-24 rounded-xl py-6 px-4 text-black hover:bg-blue-950 hover:text-white transition flex items-center justify-center gap-4"
              >
                <div className="flex items-center gap-3">

                  <img
                    src="/menu-principal/guarani.png"
                    alt="Logo UNRaf"
                    className="max-h-16 max-w-[64x] object-contain"
                  />
                  <div className="flex flex-col text-center leading-tight">
                    <span className="text-sm italic font-bold text-gray-700">SIU</span>
                    <span className="text-sm italic font-bold text-gray-700">GUARANI</span>
                  </div>
                </div>

              </a>
              <a
                href="https://tutienda.unraf.edu.ar/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#c7c7c7] h-24 rounded-xl py-6 px-4 text-black hover:bg-blue-950 hover:text-white transition flex items-center justify-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/menu-principal/tienda.png"
                    alt="Logo UNRaf"
                    className="max-h-20 max-w-[80px] object-contain"
                  />
                  <div className="flex flex-col text-center leading-tight">
                    <span className="text-sm italic font-bold text-gray-700">TIENDA</span>
                    <span className="text-sm italic font-bold text-gray-700">UNRAF</span>
                  </div>
                </div>
              </a>

              {/* Internos con <Link> */}
              <Link
                href="/menu/beneficios"
                className="bg-[#c7c7c7] h-24 rounded-xl py-6 px-4 text-black hover:bg-blue-950 hover:text-white transition flex items-center justify-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/menu-principal/calendario.png"
                    alt="Logo UNRaf"
                    className="max-h-16 max-w-[64px] object-contain"
                  />
                  <div className="flex flex-col text-center leading-tight">
                    <span className="text-sm italic font-bold text-gray-700">BENEFICIOS</span>
                  </div>
                </div>
              </Link>

              <Link
                href="/menu/calendario"
                className="bg-[#c7c7c7] h-24 rounded-xl py-6 px-4 text-black hover:bg-blue-950 hover:text-white transition flex items-center justify-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="/menu-principal/calendario.png"
                    alt="Logo UNRaf"
                    className="max-h-16 max-w-[64px] object-contain"
                  />
                  <div className="flex flex-col text-center leading-tight">
                    <span className="text-sm italic font-bold text-gray-700">CALENDARIO</span>
                    <span className="text-sm italic font-bold text-gray-700">ACADÉMICO</span>
                  </div>
                </div>
              </Link>



            </div>
          </div>
        </div>
      )}
    </div>
  );
}
