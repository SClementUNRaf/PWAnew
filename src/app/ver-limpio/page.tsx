"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import parse, { domToReact, Element, DOMNode } from "html-react-parser";
import type { ReactNode } from "react";

export default function VerLimpio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  const [contenido, setContenido] = useState<ReactNode>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

useEffect(() => {
  if (!url) return;

  try {
    const parsedUrl = new URL(url);
    const hostValido = parsedUrl.hostname === "www.unraf.edu.ar" || parsedUrl.hostname === "unraf.edu.ar";

    if (!hostValido) {
      setError("La URL no pertenece a un dominio permitido.");
      setLoading(false);
      return;
    }
  } catch {
    setError("La URL proporcionada no es válida.");
    setLoading(false);
    return;
  }

  setLoading(true);
  fetch(`http://localhost:4000/api/clean-page?url=${encodeURIComponent(url)}`)
    .then((res) => res.text())
    .then((html) => {
      const parsed = parse(html, {
        replace: (domNode: DOMNode, _index: number) => {
          // 🎯 Paginación
          if (domNode instanceof Element) {
            if (domNode.name === "ul" && domNode.attribs?.class?.includes("pagination")) {
              const newClass = `${domNode.attribs.class} flex justify-center flex-wrap gap-2 my-8 list-none`;
              const nuevosLi: ReactNode[] = [];

              domNode.children.forEach((liNode, index) => {
                if (liNode instanceof Element && liNode.name === "li") {
                  const liClass = liNode.attribs.class || "";
                  const base =
                    "bg-white text-black rounded px-3 py-1 text-sm shadow hover:bg-gray-100 transition";
                  const fullClass = `${liClass} ${base}` + (liClass.includes("active") ? " bg-blue-600 text-white" : "");

                  const isEmpty =
                    !liNode.children ||
                    liNode.children.length === 0 ||
                    (liNode.children.length === 1 &&
                      liNode.children[0].type === "text" &&
                      (liNode.children[0] as any).data.trim() === "");

                  nuevosLi.push(
                    <li key={index} className={fullClass}>
                      {isEmpty ? "..." : domToReact(liNode.children as DOMNode[])}
                    </li>
                  );
                }
              });

              return <ul className={newClass}>{nuevosLi}</ul>;
            }

            // 🔗 Navegación limpia sin recarga
            if (domNode.name === "a") {
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
          }
        },
      });

      setContenido(parsed);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    })
    .catch(() => {
      setError("No se pudo cargar el contenido.");
      setLoading(false);
    });
}, [url, router]);


  if (!url) return <div className="p-4 text-red-500">Falta la URL</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <div className="prose prose-invert max-w-none">{contenido}</div>
      )}
    </div>
  );
}
