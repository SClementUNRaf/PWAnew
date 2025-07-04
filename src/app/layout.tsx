import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DropdownMenu from "@/components/comunes/DropdownMenu";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "App UNRaf",
  description: "Aplicacion UNRaf para facilitar el acceso rapido a diferentes sistemas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <DropdownMenu userData={null} /> {/* modo no logueado */}
        {children}
      </body>
    </html>
  );
}
