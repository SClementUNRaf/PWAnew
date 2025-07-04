"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function EmbedPage() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  // Lista de URLs que deben limpiarse
  const requiereLimpieza = useMemo(() => {
    if (!url) return false;

    return [
      "https://www.unraf.edu.ar/cursos-diplomaturas-2/3541-noti3423",
      // Podés agregar más acá si querés
    ].includes(url);
  }, [url]);

  if (!url) return <div className="p-4 text-red-500">Falta la URL</div>;

  return (
    <div className="w-full h-screen overflow-hidden">
      <iframe
        src={
          requiereLimpieza
            ? `http://localhost:4000/api/clean-frame?url=${encodeURIComponent(url)}`
            : url
        }
        className="w-full h-full border-none"
        style={{
          backgroundColor: "white",
        }}
        sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
      />
    </div>
  );
}
