"use client";

import { useEffect, useState } from "react";
import CompletarPerfil, { ProfileFormData } from "@/components/pantallas/CompletarPerfil";
import { useRouter } from "next/navigation";
import { parse, format } from "date-fns";

export default function CompletarPerfilPage() {
  const router = useRouter()
  const [estado, setEstado] = useState<null | "form" | "menu">(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    const yaCompleto = localStorage.getItem("perfilCompletado");
    if (yaCompleto === "true") {
      router.replace("/menu");
    } else {
      setEstado("form"); // solo mostrar si no hay que redirigir
    }
  }, [router]);

  const manejarConfirmacion = async (data: ProfileFormData, email: string) => {
    console.log("Datos confirmados:", data);
    console.log("Email:", email);
    setIsSubmitting(true); // activa el loading en el botón

    const fechaFormateada = format(
      parse(data.fechaNacimiento, "dd-MM-yyyy", new Date()),
      "yyyy-MM-dd"
    );

    const payload = {
      ...data,
      fecha: fechaFormateada,
      email, // agregamos el email al body
    };

    try {
      const res = await fetch("/api/verificar-alumno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("Resultado de verificación:", result);

      if (!res.ok) {
        console.warn("No se pudo verificar al alumno.");
        // podés mostrar un error al usuario si querés
      }

      // Guardar estado
      localStorage.setItem("perfilCompletado", "true");
      localStorage.setItem("userData", JSON.stringify(payload)); // opcional para usar en el dropdown

      if (result.status === "CONSULT SUCCESS") router.replace("/menu")
      // setTimeout(() => {
      //   router.replace("/menu");
      // }, 2000);
    } catch (error) {
      console.error("Error al verificar alumno:", error);
      // mostrar mensaje de error al usuario si es necesario
    } finally {
      setIsSubmitting(false)
    }
  };

  if (estado === null) return null;

  return (
    <>
      {estado === "form" && <CompletarPerfil onSubmit={manejarConfirmacion} isSubmitting={isSubmitting}/>}
    </>
  );
}