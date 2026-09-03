/**
 * Dashboard Layout — estructura base del panel principal.
 * Protegido: requiere sesión activa (el middleware ya verifica, esto es defensa en profundidad).
 * Todos los roles autenticados tienen acceso.
 */
import type { Metadata } from "next";
import { getActiveSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeaderWrapper } from "@/components/dashboard/DashboardHeaderWrapper";

export const metadata: Metadata = {
  title: "Dashboard — NP Music Group",
  robots: "noindex, nofollow",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Verificación server-side (defensa en profundidad — el middleware ya protege esta ruta)
  const session = await getActiveSession();
  if (!session) {
    redirect("/login?from=/dashboard");
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Sidebar */}
      <DashboardSidebar role={session.role} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeaderWrapper username={session.username} role={session.role} />
        <main className="flex-1 overflow-y-auto p-5 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
