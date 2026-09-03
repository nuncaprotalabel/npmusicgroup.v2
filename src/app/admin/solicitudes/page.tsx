import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { SolicitudesAdminView } from "@/components/admin/SolicitudesAdminView";

export const metadata: Metadata = {
  title: "Solicitudes — Administración | NP Music Group",
  robots: "noindex, nofollow",
};

export default async function AdminSolicitudesPage() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/admin/solicitudes");

  const canView = await hasPermission(session.role, "applications.view");
  if (!canView) redirect("/403");

  const canManage = await hasPermission(session.role, "applications.manage");
  return <SolicitudesAdminView canManage={canManage} />;
}