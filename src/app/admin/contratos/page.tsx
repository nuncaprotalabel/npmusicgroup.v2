import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { ContratosAdminView } from "@/components/admin/ContratosAdminView";

export const metadata: Metadata = {
  title: "Contratos — Administración | NP Music Group",
  robots: "noindex, nofollow",
};

export default async function AdminContratosPage() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/admin/contratos");
  const canView = await hasPermission(session.role, "contracts.view");
  if (!canView) redirect("/403");
  const canManage = await hasPermission(session.role, "contracts.manage");
  return <ContratosAdminView canManage={canManage} />;
}