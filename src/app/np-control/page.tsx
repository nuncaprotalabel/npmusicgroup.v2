/**
 * NP Control — Dashboard principal del SUPER_ADMIN.
 * Muestra métricas reales del sistema desde Neon.
 * Sin datos ficticios: solo estados vacíos profesionales si no hay información.
 */
import { query } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Users,
  ShieldCheck,
  Activity,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { AuditLogEntry } from "@/types/auth";

// ─── Server-side data ─────────────────────────────────────────────────────────

async function getSystemStats() {
  const [users, sessions, auditTotal, recentAudit] = await Promise.all([
    query<{ count: string; role: string }>(
      `SELECT role, COUNT(*) as count FROM users WHERE is_active = true GROUP BY role ORDER BY role`
    ),
    query<{ count: string }>(
      `SELECT COUNT(*) as count FROM sessions WHERE is_active = true AND expires_at > NOW()`
    ),
    query<{ count: string }>(
      `SELECT COUNT(*) as count FROM audit_log`
    ),
    query<AuditLogEntry & { username: string | null; action: string; severity: string; created_at: string }>(
      `SELECT username, action, severity, ip_address, created_at
       FROM audit_log
       ORDER BY created_at DESC
       LIMIT 10`
    ),
  ]);

  return {
    users,
    activeSessions: Number(sessions[0]?.count ?? 0),
    auditTotal:     Number(auditTotal[0]?.count ?? 0),
    recentAudit,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default async function NpControlPage() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") redirect("/login");

  const stats = await getSystemStats();
  const totalUsers = stats.users.reduce((s, r) => s + Number(r.count), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Central del Sistema
        </h1>
        <p className="text-sm mt-1" style={{ color: "#737373" }}>
          Vista general del estado de la plataforma.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Usuarios activos"
          value={totalUsers}
          description="en el sistema"
        />
        <StatCard
          icon={ShieldCheck}
          label="Sesiones activas"
          value={stats.activeSessions}
          description="en este momento"
        />
        <StatCard
          icon={Activity}
          label="Registros de auditoría"
          value={stats.auditTotal}
          description="eventos totales"
        />
        <StatCard
          icon={Clock}
          label="Rol activo"
          value="SUPER_ADMIN"
          description={session.username}
          isText
        />
      </div>

      {/* Usuarios por rol */}
      <div
        className="rounded-xl p-6"
        style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}
      >
        <h2 className="text-sm font-semibold text-white mb-4">
          Distribución de roles
        </h2>
        {stats.users.length === 0 ? (
          <EmptyState message="Sin usuarios registrados." />
        ) : (
          <div className="space-y-2">
            {stats.users.map((r) => (
              <div
                key={r.role}
                className="flex items-center justify-between py-2 px-3 rounded-lg"
                style={{ background: "#141414" }}
              >
                <span className="text-sm font-medium" style={{ color: "#A3A3A3" }}>
                  {r.role}
                </span>
                <span
                  className="text-sm font-bold tabular-nums"
                  style={{ color: "#F5C518" }}
                >
                  {r.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auditoría reciente */}
      <div
        className="rounded-xl p-6"
        style={{ background: "#0A0A0A", border: "1px solid #1E1E1E" }}
      >
        <h2 className="text-sm font-semibold text-white mb-4">
          Actividad reciente
        </h2>
        {stats.recentAudit.length === 0 ? (
          <EmptyState message="Sin actividad reciente." />
        ) : (
          <div className="space-y-1">
            {stats.recentAudit.map((entry, i) => (
              <AuditRow key={i} entry={entry} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

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
        <p
          className={isText ? "text-base font-bold text-white" : "text-2xl font-bold tabular-nums text-white"}
        >
          {value}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "#525252" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function AuditRow({
  entry,
}: {
  entry: { username: string | null; action: string; severity: string; ip_address?: string | null; created_at: string };
}) {
  const severityColor: Record<string, string> = {
    INFO:     "#34D399",
    WARN:     "#F5C518",
    ERROR:    "#EF4444",
    CRITICAL: "#EF4444",
  };
  const color = severityColor[entry.severity] ?? "#737373";
  const date  = new Date(entry.created_at).toLocaleString("es", { dateStyle: "short", timeStyle: "short" });

  return (
    <div
      className="flex items-center gap-3 py-2 px-3 rounded-lg text-xs"
      style={{ background: "#0D0D0D" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: color }}
      />
      <span className="font-medium truncate" style={{ color: "#A3A3A3", minWidth: 80 }}>
        {entry.username ?? "—"}
      </span>
      <span className="flex-1 truncate text-white font-medium">
        {entry.action}
      </span>
      <span className="shrink-0 tabular-nums" style={{ color: "#525252" }}>
        {date}
      </span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 py-4" style={{ color: "#525252" }}>
      <AlertCircle size={14} strokeWidth={1.75} />
      <span className="text-sm">{message}</span>
    </div>
  );
}
