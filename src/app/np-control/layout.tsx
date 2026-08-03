/**
 * Layout de NP Control — panel privado exclusivo del SUPER_ADMIN.
 * Completamente separado de la landing.
 * El middleware ya garantiza que solo SUPER_ADMIN llega aquí.
 */
import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NpControlSidebar } from "@/components/np-control/NpControlSidebar";
import { NpControlHeader } from "@/components/np-control/NpControlHeader";

export const metadata: Metadata = {
  title: "NP Control — NP Music Group",
  robots: "noindex, nofollow",
};

export default async function NpControlLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Doble verificación server-side (el middleware ya protege, esto es defensa en profundidad)
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login?from=/np-control");
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Sidebar */}
      <NpControlSidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <NpControlHeader username={session.username} />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
