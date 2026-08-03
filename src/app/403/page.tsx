/**
 * Página 403 — Acceso denegado.
 * Mostrada cuando un usuario no tiene permisos para la ruta solicitada.
 */
import Link from "next/link";
import { ShieldOff } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acceso denegado — NP Music Group",
};

export default function ForbiddenPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#000000" }}
    >
      <div className="flex flex-col items-center text-center max-w-sm">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}
        >
          <ShieldOff size={24} strokeWidth={1.5} style={{ color: "#EF4444" }} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Acceso denegado</h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: "#737373" }}>
          No tienes permisos para acceder a esta sección de la plataforma.
        </p>
        <Link
          href="/login"
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-black transition-all duration-150"
          style={{ background: "#F5C518" }}
        >
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  );
}
