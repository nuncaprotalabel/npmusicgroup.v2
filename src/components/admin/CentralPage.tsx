import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AlertCircle, BarChart2, DollarSign, FileText, MessageSquare, Send, Users } from "lucide-react";

const MODULES = [
  { label: "Artistas", description: "Gestión de artistas y perfiles", href: "/admin/artistas", icon: Users },
  { label: "Lanzamientos", description: "Publicaciones y releases", href: "/admin/lanzamientos", icon: Send },
  { label: "Contratos", description: "Contratos y acuerdos digitales", href: "/admin/contratos", icon: FileText },
  { label: "Ingresos", description: "Ingresos y distribución de royalties", href: "/admin/ingresos", icon: DollarSign },
  { label: "Analíticas", description: "Estadísticas y métricas", href: "/admin/analiticas", icon: BarChart2 },
  { label: "Mensajes", description: "Comunicación interna", href: "/admin/mensajes", icon: MessageSquare },
];

export async function CentralPage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/admin");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Central</h1>
        <p className="text-sm mt-1" style={{ color: "#737373" }}>
          Vista general de tu plataforma.
        </p>
      </div>

      <div className="rounded-xl p-6" style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(245,197,24,0.08)" }}>
            <span className="text-[0.75rem] font-bold" style={{ color: "#F5C518" }}>
              {session.username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white mb-1">Bienvenido, {session.username}</h2>
            <p className="text-sm" style={{ color: "#737373" }}>
              Accediste como <span className="font-medium" style={{ color: "#A3A3A3" }}>{session.role}</span>.
              Usa el menú lateral para navegar por los módulos disponibles.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-6" style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}>
        <h2 className="text-sm font-semibold text-white mb-4">Módulos disponibles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map(({ label, description, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 p-4 rounded-lg border border-transparent transition-all duration-150 hover:border-[#2A2A2A] hover:bg-[#1A1A1A]"
              style={{ background: "#141414" }}
            >
              <Icon size={17} strokeWidth={1.75} style={{ color: "#F5C518" }} />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-white">{label}</span>
                <span className="block text-xs mt-0.5" style={{ color: "#525252" }}>{description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-xl p-6" style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}>
        <h2 className="text-sm font-semibold text-white mb-4">Actividad reciente</h2>
        <div className="flex items-center gap-2 py-4" style={{ color: "#525252" }}>
          <AlertCircle size={14} strokeWidth={1.75} />
          <span className="text-sm">Sin actividad reciente.</span>
        </div>
      </div>
    </div>
  );
}