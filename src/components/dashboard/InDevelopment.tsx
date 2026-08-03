/**
 * InDevelopment — estado compartido para módulos en desarrollo.
 * Muestra un mensaje claro y profesional sin romper la pantalla.
 * Conforme a PROJECT_RULES.md: nunca mostrar una pantalla rota.
 */
import { Wrench } from "lucide-react";

interface InDevelopmentProps {
  moduleName: string;
  /** Descripción adicional opcional */
  description?: string;
}

export function InDevelopment({ moduleName, description }: InDevelopmentProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "rgba(245,197,24,0.08)", border: "1px solid rgba(245,197,24,0.12)" }}
      >
        <Wrench size={24} strokeWidth={1.5} style={{ color: "#F5C518" }} />
      </div>

      {/* Badge */}
      <span
        className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.6875rem] font-semibold mb-4"
        style={{
          background: "rgba(245,197,24,0.08)",
          border:     "1px solid rgba(245,197,24,0.15)",
          color:      "#F5C518",
        }}
      >
        Próximamente
      </span>

      <h1 className="text-xl font-bold text-white mb-2 tracking-tight">
        {moduleName}
      </h1>

      <p className="text-sm max-w-sm leading-relaxed" style={{ color: "#737373" }}>
        {description ?? "Este módulo se encuentra en desarrollo y estará disponible próximamente."}
      </p>
    </div>
  );
}
