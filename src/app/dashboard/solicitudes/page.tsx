/**
 * Solicitudes — módulo administrativo de gestión de solicitudes de artistas.
 * Acceso restringido: SUPER_ADMIN, ADMIN, DISTRIBUTION_MANAGER.
 */
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SolicitudesClient } from "@/components/dashboard/solicitudes/SolicitudesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solicitudes — Dashboard | NP Music Group",
  robots: "noindex, nofollow",
};

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN", "DISTRIBUTION_MANAGER"] as const;
type AllowedRole = typeof ALLOWED_ROLES[number];

function isAllowed(role: string): role is AllowedRole {
  return (ALLOWED_ROLES as readonly string[]).includes(role);
}

export default async function SolicitudesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login?from=/dashboard/solicitudes");
  }

  if (!isAllowed(session.role)) {
    redirect("/403");
  }

  return <SolicitudesClient />;
}
