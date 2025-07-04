"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserData {
  nombre: string;
  cargo: string;
}

export default function DropdownMenu({ userData }: { userData: UserData | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);
  const router = useRouter();
  const dropdownDiv = useRef<HTMLDivElement>(null)
  const [isMolinoRotating, setIsMolinoRotating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRenderContent(false);
      }, 500); // Coincide con la duración de la transición del menú interno
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Nuevo useEffect para sincronizar el giro del molino con la apertura/cierre del menú
  useEffect(() => {
    setIsMolinoRotating(isOpen); // El molino gira si el menú está abierto, y deja de girar si se cierra
  }, [isOpen]); // Este efecto se ejecuta cada vez que 'isOpen' cambia

  useEffect(()=>{
    function handleClickOutside(event:MouseEvent) {
      if (isOpen && dropdownDiv.current && !dropdownDiv.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return()=> {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

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
    <div className="fixed bottom-4 left-4 z-50" ref={dropdownDiv}>
      {/* Contenedor externo para manejar la altura y el overflow general */}
      <div
        className={`rounded-full backdrop-blur-md bg-white/30 shadow-xl border border-white/50 overflow-hidden transition-all duration-500 ${
          isOpen ? "max-h-[700px] w-[72px]" : "max-h-[56px] w-14"
        }`}
      >
        {/* Contenedor INTERNO que envuelve el botón molino y el contenido del menú. */}
        {/* Aquí es donde ajustaremos el padding para que el botón molino quede centrado. */}
        <div
          className={`flex flex-col items-center px-3 transition-all duration-500 ${
            isOpen ? "py-4" : "py-0" // Ajusta el padding vertical. py-1 para que el molino quede centrado
          }`}
        >
          {/* Botón molino (siempre visible) */}
          <button
            onClick={toggleMenu}
            className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center transition"
          >
            <Image src="/icons/molino.png" alt="Logo" width={48} height={48} className={`${isMolinoRotating ? "rotate-180" : ""} transition-transform duration-500`} />
          </button>

          {/* Menú interno con fade y slide */}
          {shouldRenderContent && (
            <div
              className={`flex flex-col items-center transition-all duration-500 ${
                isOpen
                  ? "opacity-100 max-h-[600px] mt-3 gap-3" // Añadimos gap aquí
                  : "opacity-0 max-h-0 pointer-events-none mt-0 gap-0" // Quitamos gap aquí
              }`}
            >
              {/* Contenido del menú */}
              <button onClick={() => navegarInterno("/")} className="menu-btn">
                <Image src="/icons/home.png" width={28} height={28} alt="Inicio" />
              </button>
              <button
                onClick={() =>
                  navegarExterno(
                    "https://www.unraf.edu.ar/index.php/menucontenidos/855-noticia-376"
                  )
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
                onClick={() =>
                  navegarExterno("https://www.unraf.edu.ar/cursos-diplomaturas")
                }
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
                    <button
                      onClick={() => navegarInterno("/credencial")}
                      className="menu-btn"
                    >
                      <Image
                        src="/icons/badge.svg"
                        width={28}
                        height={28}
                        alt="Credencial"
                      />
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
            </div>
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