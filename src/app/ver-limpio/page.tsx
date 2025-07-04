"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import parse, { domToReact, Element, DOMNode } from "html-react-parser";
import type { ReactNode } from "react";

export default function VerLimpio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const [contenido, setContenido] = useState<ReactNode | null>(null);
  const [usarIframe, setUsarIframe] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const parsedUrl = (() => {
      try {
        return new URL(url);
      } catch {
        setError("La URL proporcionada no es válida.");
        setLoading(false);
        return null;
      }
    })();

    if (!parsedUrl) return;

    if (
      parsedUrl.hostname !== "unraf.edu.ar" &&
      !parsedUrl.hostname.endsWith(".unraf.edu.ar")
    ) {
      setError("La URL no pertenece a un dominio permitido.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setContenido(null);
    setError(null);
    setUsarIframe(false);

    fetch(`http://localhost:4000/api/clean-page?url=${encodeURIComponent(url)}`)
      .then((res) => {
        if (res.status === 204) {
          setUsarIframe(true);
          setLoading(false);
          return null;
        }
        if (!res.ok) throw new Error("Respuesta no OK del servidor.");
        return res.text();
      })
      .then((html) => {
        if (!html) return;

        const parsed = parse(html, {
          replace: (domNode: DOMNode) => {
            if (domNode instanceof Element && domNode.name === "a") {
              const href = domNode.attribs?.href;
              if (href?.startsWith("/ver-limpio?url=")) {
                return (
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      router.push(href);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className={domNode.attribs.class}
                  >
                    {domToReact(domNode.children as DOMNode[])}
                  </a>
                );
              }
            }
          },
        });

        setContenido(parsed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error en fetch:", err.message);
        setError("No se pudo cargar el contenido.");
        setLoading(false);
      });
  }, [url, router]);

  if (!url) return <div className="p-4 text-red-500">Falta la URL</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto min-h-[80vh]">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : usarIframe ? (
        <iframe
          src={`http://localhost:4000/api/clean-frame?url=${encodeURIComponent(url)}`}
          className="w-full h-[85vh] border-none"
          sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
        />
      ) : (
        <div className="prose prose-invert max-w-none">{contenido}</div>
      )}
    </div>
  );
}
