/**
 * Dashboard Central — vista general del panel.
 * Muestra el estado real de la plataforma sin datos ficticios.
 * Si no hay datos, muestra estados vacíos profesionales.
 */
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Users,
  Music,
  TrendingUp,
  Clock,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Central — Dashboard | NP Music Group",
};

async function getStats(role: string) {
  // Solo SUPER_ADMIN y ADMIN acceden a stats del sistema
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    return null;
  }
  try {
    const { query } = await import("@/lib/db");
    const [users, sessions] = await Promise.all([
      query<{ count: string }>(
        `SELECT COUNT(*) as count FROM users WHERE is_active = true`
      ),
      query<{ count: string }>(
        `SELECT COUNT(*) as count FROM sessions WHERE is_active = true AND expires_at > NOW()`
      ),
    ]);
    return {
      totalUsers:     Number(users[0]?.count ?? 0),
      activeSessions: Number(sessions[0]?.count ?? 0),
    };
  } catch {
    return null;
  }
}

export default async function CentralPage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/dashboard/central");

  const stats = await getStats(session.role);

  const isSuperAdminOrAdmin = session.role === "SUPER_ADMIN" || session.role === "ADMIN";

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Central
        </h1>
        <p className="text-sm mt-1" style={{ color: "#737373" }}>
          Vista general de tu plataforma.
        </p>
      </div>

      {/* Stats cards */}
      {isSuperAdminOrAdmin && stats !== null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users}      label="Usuarios activos"    value={stats.totalUsers}     description="en el sistema" />
          <StatCard icon={Clock}      label="Sesiones activas"    value={stats.activeSessions} description="en este momento" />
          <StatCard icon={Music}      label="Artistas"            value={0}                    description="registrados" />
          <StatCard icon={TrendingUp} label="Lanzamientos"        value={0}                    description="publicados" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Music}      label="Artistas"   value={0} description="registrados" />
          <StatCard icon={TrendingUp} label="Lanzamientos" value={0} description="publicados" />
          <StatCard icon={TrendingUp} label="Ingresos"   value="—" description="sin datos aún" isText />
          <StatCard icon={Clock}      label="Actividad"  value="—" description="sin actividad" isText />
        </div>
      )}

      {/* Bienvenida */}
      <div
        className="rounded-xl p-6"
        style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(245,197,24,0.08)" }}
          >
            <span
              className="text-[0.75rem] font-bold"
              style={{ color: "#F5C518" }}
            >
              {session.username.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-white mb-1">
              Bienvenido, {session.username}
            </h2>
            <p className="text-sm" style={{ color: "#737373" }}>
              Accediste como <span className="font-medium" style={{ color: "#A3A3A3" }}>{session.role}</span>.
              Usa el menú lateral para navegar por los módulos disponibles.
            </p>
          </div>
        </div>
      </div>

      {/* Módulos disponibles */}
      <div
        className="rounded-xl p-6"
        style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}
      >
        <h2 className="text-sm font-semibold text-white mb-4">
          Módulos disponibles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MODULES.map(({ label, description, href }) => (
            <a
              key={href}
              href={href}
              className="flex flex-col gap-1 p-4 rounded-lg border border-transparent transition-all duration-150 hover:border-[#2A2A2A]"
              style={{ background: "#141414" }}
            >
              <span className="text-sm font-medium text-white">{label}</span>
              <span className="text-xs" style={{ color: "#525252" }}>{description}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Actividad reciente */}
      <div
        className="rounded-xl p-6"
        style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}
      >
        <h2 className="text-sm font-semibold text-white mb-4">
          Actividad reciente
        </h2>
        <div className="flex items-center gap-2 py-4" style={{ color: "#525252" }}>
          <AlertCircle size={14} strokeWidth={1.75} />
          <span className="text-sm">Sin actividad reciente.</span>
        </div>
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const MODULES = [
  { label: "Artistas",              description: "Gestión de artistas y perfiles",     href: "/dashboard/artistas" },
  { label: "Lanzamientos",          description: "Publicaciones y releases",           href: "/dashboard/lanzamientos" },
  { label: "Contratos",             description: "Contratos y acuerdos digitales",     href: "/dashboard/contratos" },
  { label: "Ingresos",              description: "Ingresos y distribución de royalties",href: "/dashboard/ingresos" },
  { label: "Analíticas",            description: "Estadísticas y métricas",            href: "/dashboard/analiticas" },
  { label: "Mensajes",              description: "Comunicación interna",               href: "/dashboard/mensajes" },
];

function StatCard({
  icon: Icon,
  label,
  value,
  description,
  isText = false,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
  label: string;
  value: number | string;
  description: string;
  isText?: boolean;
}) {
  return (
    <div
      className="rounded-xl p-5 flex flex-col gap-3"
      style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: "#737373" }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "rgba(245,197,24,0.08)" }}
        >
          <Icon size={15} strokeWidth={1.75} style={{ color: "#F5C518" }} />
        </div>
      </div>
      <div>
        <p className={isText ? "text-base font-bold text-white" : "text-2xl font-bold tabular-nums text-white"}>
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#525252" }}>
          {description}
        </p>
      </div>
    </div>
  );
}
