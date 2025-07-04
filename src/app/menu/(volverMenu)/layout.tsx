// app/menu/(con-layout)/layout.tsx
import Link from "next/link";
import { ReactNode } from "react";

export default function LayoutConVolver({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#000000] p-4">
      <div className="mb-4">
        <Link
          href="/menu"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ← Volver al menú
        </Link>
      </div>
      {children}
    </div>
  );
}
