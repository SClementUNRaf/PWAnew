"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Newspaper, Calendar, Rocket } from "lucide-react";

export default function Bienvenida() {
  const router = useRouter();

  const navegarA = (url: string) => {
    router.push(`/ver-limpio?url=${encodeURIComponent(url)}`);
  };

  const login = () => {
    // Esto ahora no es necesario, pero podés usarlo si querés invocar manualmente el login
    console.log("Login manual (no usado ahora)");
  };

  function handleCredentialResponse(response: any) {
    const idToken = response.credential;
    console.log("🧩 ID Token recibido:", idToken);

    fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ token: idToken }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      router.push("/test-login");
    });
  }

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      // @ts-ignore
      google.accounts.id.renderButton(
        document.getElementById("google-button"),
        {
          theme: "outline",
          size: "large",
          type: "standard",
          width: 240,
        }
      );
    };
  }, []);

  

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-900 text-white overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0">
        <img
          src="/welcome/fondo.jpeg"
          alt="Fondo UNRaf"
          className="w-full h-full object-cover brightness-50"
        />
      </div>

      {/* Contenido centrado */}
      <div className="z-10 flex flex-col items-center px-6 py-8 w-full max-w-md">
        <img src="/logo-unraf.png" alt="UNRaf" className="w-24 h-24 mb-4" />
        <h1 className="text-3xl font-bold text-center">Bienvenido a la App UNRaf</h1>
        <p className="text-sm text-gray-200 mt-2 text-center">
          Accedé a contenidos públicos de interés general
        </p>

        {/* Íconos flotantes */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <div
            onClick={() =>
              navegarA("https://www.unraf.edu.ar/index.php/menucontenidos/855-noticia-376")
            }
            className="flex flex-col items-center justify-center p-4 w-28 h-28 rounded-2xl cursor-pointer 
                       bg-white/30 backdrop-blur-md shadow-lg border border-white/20 hover:bg-white/40 transition"
          >
            <Rocket size={52} className="text-white" />
            <span className="mt-2 text-xs text-center text-white">Sueño UNRaf</span>
          </div>

          <div
            onClick={() => navegarA("https://www.unraf.edu.ar/noticias")}
            className="flex flex-col items-center justify-center p-4 w-28 h-28 rounded-2xl cursor-pointer 
                       bg-white/30 backdrop-blur-md shadow-lg border border-white/20 hover:bg-white/40 transition"
          >
            <Newspaper size={52} className="text-white" />
            <span className="mt-2 text-xs text-center text-white">Noticias</span>
          </div>

          <div
            onClick={() => navegarA("https://www.unraf.edu.ar/cursos-diplomaturas")}
            className="flex flex-col items-center justify-center p-4 w-28 h-28 rounded-2xl cursor-pointer 
                       bg-white/30 backdrop-blur-md shadow-lg border border-white/20 hover:bg-white/40 transition"
          >
            <Calendar size={52} className="text-white" />
            <span className="mt-2 text-xs text-center text-white">Agenda</span>
          </div>
        </div>

        {/* Botón de login con Google */}
        <div
          id="google-button"
          className="mt-10 w-full max-w-xs flex justify-center"
        ></div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-2 z-10 text-xs text-white/80 text-center">
        UNRaf · Versión 2.0 · app.unraf.edu.ar
      </div>
    </div>
  );
}
