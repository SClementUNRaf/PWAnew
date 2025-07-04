// src/app/completar-perfil/CompletarPerfil.tsx
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { parse, isValid, format, isAfter } from "date-fns";
import { useEffect } from "react";
import MultiSelectDropdown from "@/components/comunes/MultiSelectDropdown";
import FechaNacimientoInput from "@/components/comunes/FechaNacimientoInput";

const schema = z.object({
  nombre: z.string().min(1, "Requerido"),
  apellido: z.string().min(1, "Requerido"),
  dni: z.string().min(7, "Debe tener al menos 7 digitos"),
  fechaNacimiento: z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/, "Formato inválido. Usá dd-mm-yyyy")
    .refine((fecha) => {
      const parsed = parse(fecha, "dd-MM-yyyy", new Date());
      return isValid(parsed);
    }, { message: "Fecha inválida" })
    .refine((fecha) => {
      const parsed = parse(fecha, "dd-MM-yyyy", new Date());
      return !isAfter(parsed, new Date());
    }, { message: "La fecha no puede ser futura" }),
  roles: z.array(z.string()).min(1, "Seleccioná al menos un rol"),
  telefono: z
    .string()
    .regex(/^\d{10}$/, "Debe tener exactamente 10 dígitos (sin +54 ni espacios)"),
});

export type ProfileFormData = z.infer<typeof schema>;

const mockUserData = {
  email: "teoorivero15@gmail.com",
  nombre: "Mateo",
  apellido: "Rivero",
  dni: "43283359",
  fechaNacimiento: "2001-11-26",
  roles: ["Alumno"],
  imagen: "https://api.dicebear.com/7.x/initials/svg?seed=JP",
  telefono: "3492611395"
};

function isoToInputFormat(isoDate: string): string {
  const [yyyy, mm, dd] = isoDate.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

interface CompletarPerfilProps {
  onSubmit: (data: ProfileFormData, email: string) => void;
  isSubmitting: boolean;
}

export default function CompletarPerfil({ onSubmit, isSubmitting }: CompletarPerfilProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      roles: [],
    },
  });

  useEffect(() => {
    setValue("nombre", mockUserData.nombre);
    setValue("apellido", mockUserData.apellido);
    setValue("dni", mockUserData.dni);
    setValue("fechaNacimiento", isoToInputFormat(mockUserData.fechaNacimiento));
    setValue("telefono", mockUserData.telefono);
    const yaTieneRoles = watch("roles")?.length > 0;
    if (!yaTieneRoles) {
      setValue("roles", mockUserData.roles);
    }
  }, [setValue, watch]);

  const rolesSeleccionados = watch("roles");
  const roles = ["Alumno", "Docente", "No docente", "Superior"];

  const onSubmitForm = (data: ProfileFormData) => {
    onSubmit(data, mockUserData.email)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10">
        <img
          src="/completar-perfil/completar-perfil.jpeg"
          alt="Fondo UNRaf"
          className="w-full h-full object-cover blur-xs brightness-50 contrast-125 saturate-150"
        />
      </div>
      <div className="max-w-xl mx-auto backdrop-brightness-50 p-6 rounded-4xl z-10 w-full">
        <div className="text-center mb-6">
          <img
            src={mockUserData.imagen}
            alt="avatar"
            className="w-24 h-24 mx-auto rounded-full border"
          />
          <p className="text-lg font-semibold mt-2 text-white">{mockUserData.email}</p>
        </div>


        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-2">

          <div className="flex flex-row justify-between items-start gap-4">
            <div className="w-1/2">
              <label className="block font-medium">Nombre</label>
              <input
                {...register("nombre")} 
                className="w-full border p-2 rounded"
                inputMode="text"
                maxLength={50}
                onInput={(e)=>{
                  e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, "")
                }}
                />
              {errors.nombre && <p className="absolute text-red-600 text-sm">{errors.nombre.message}</p>}
            </div>
            <div className="w-1/2">
              <label className="block font-medium">Apellido</label>
              <input 
                {...register("apellido")} 
                className="w-full border p-2 rounded" 
                inputMode="text"
                maxLength={50}
                onInput={(e) => {
                  // Permite solo letras y espacios
                  e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-ZÁÉÍÓÚáéíóúÑñ\s]/g, "");
                }}/>
              {errors.apellido && <p className="absolute text-red-600 text-sm">{errors.apellido.message}</p>}
            </div>
          </div>

          

          <div className="flex flex-row justify-between items-start gap-4">
            <div className="w-1/2 mt-6">
              <label className="block font-medium">DNI / Pasaporte</label>
              <input 
                {...register("dni")} 
                className="w-full border p-2 rounded" 
                inputMode="numeric" 
                pattern="[0-9]*" 
                maxLength={8} 
                onInput={(e) => {
                  // Elimina cualquier carácter no numérico
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                }}/>
              {errors.dni && <p className="absolute text-red-600 text-sm">{errors.dni.message}</p>}
            </div>

            <div className="w-1/2 mt-6">
              <label className="block font-medium">Teléfono</label>
              <input
                type="tel"
                {...register("telefono")}
                className="w-full border p-2 rounded"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                onInput={(e) => {
                  // Elimina cualquier carácter no numérico
                  e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
                }}
              />
              {errors.telefono && (
                <p className="absolute text-red-600 text-sm">{errors.telefono.message}</p>
              )}
            </div>
          </div>


          <div className="mt-6">
            <label className="block font-medium text-white">Fecha de nacimiento</label>
              <Controller
                name="fechaNacimiento"
                control={control}
                render={({ field }) => (
                  <FechaNacimientoInput
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                    onBlur={field.onBlur}
                  />
                )}
              />
              {errors.fechaNacimiento && (
                <p className="absolute text-red-600 text-sm mt-1">{errors.fechaNacimiento.message}</p>
              )}
          </div>

          <MultiSelectDropdown
            formFieldName="roles"
            options={roles}
            register={register}
            selectedValues={rolesSeleccionados}
            setValue={setValue}
          />
          {errors.roles && <p className="absolute text-red-600 text-sm">{errors.roles.message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full mt-10 py-2 font-semibold rounded transition ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Guardando...
              </div>
            ) : (
              "Confirmar y continuar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
