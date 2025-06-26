"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserData {
  nombre: string;
  cargo: string;
}

export default function DropdownMenu({ userData }: { userData: UserData | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const navegarInterno = (ruta: string) => {
    setIsOpen(false);
    router.push(ruta);
  };

  const navegarExterno = (url: string) => {
    setIsOpen(false);
    router.push(`/ver-limpio?url=${encodeURIComponent(url)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    location.href = "/";
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div
        className={`flex flex-col items-center rounded-full backdrop-blur-md bg-white/30 shadow-xl border border-white/50 overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[700px] px-3 py-4 gap-3 w-[72px]" : "max-h-[56px] w-14 h-14"
        }`}
      >
        {/* Botón molino (siempre visible) */}
        <button
          onClick={toggleMenu}
          className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-105 transition"
        >
          <Image src="/icons/molino.png" alt="Logo" width={48} height={48} />
        </button>

        {/* Menú interno con fade y slide */}
        <div
          className={`flex flex-col items-center transition-opacity duration-500 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {isOpen && (
            <>
              <button onClick={() => navegarInterno("/")} className="menu-btn">
                <Image src="/icons/home.png" width={28} height={28} alt="Inicio" />
              </button>
              <button
                onClick={() =>
                  navegarExterno("https://www.unraf.edu.ar/index.php/menucontenidos/855-noticia-376")
                }
                className="menu-btn"
              >
                <Image src="/icons/sueno.png" width={28} height={28} alt="Sueño" />
              </button>
              <button
                onClick={() => navegarExterno("https://www.unraf.edu.ar/noticias")}
                className="menu-btn"
              >
                <Image src="/icons/noticias.png" width={28} height={28} alt="Noticias" />
              </button>
              <button
                onClick={() => navegarExterno("https://www.unraf.edu.ar/cursos-diplomaturas")}
                className="menu-btn"
              >
                <Image src="/icons/agenda.png" width={28} height={28} alt="Agenda" />
              </button>

              {userData && (
                <>
                  {(userData.cargo === "ALUMNO" ||
                    userData.cargo === "DOCENTE" ||
                    userData.cargo === "NO DOCENTE" ||
                    userData.cargo === "SUPERIOR") && (
                    <button onClick={() => navegarInterno("/credencial")} className="menu-btn">
                      <Image src="/icons/badge.svg" width={28} height={28} alt="Credencial" />
                    </button>
                  )}
                  <button onClick={() => navegarInterno("/perfil")} className="menu-btn">
                    <Image src="/icons/usuario.png" width={28} height={28} alt="Perfil" />
                  </button>
                  <button onClick={handleLogout} className="menu-btn">
                    <Image src="/icons/salida.png" width={28} height={28} alt="Salir" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .menu-btn {
          background-color: white;
          border-radius: 9999px;
          padding: 0.5rem;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
          transition: all 0.2s;
        }
        .menu-btn:hover {
          transform: scale(1.05);
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
}
