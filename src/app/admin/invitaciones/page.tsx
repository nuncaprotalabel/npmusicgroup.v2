import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { InvitacionesAdminView } from "@/components/admin/InvitacionesAdminView";

export const metadata: Metadata = {
  title: "Invitaciones — Administración | NP Music Group",
  robots: "noindex, nofollow",
};

export default async function AdminInvitacionesPage() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/admin/invitaciones");

  const canView = await hasPermission(session.role, "invitations.view");
  if (!canView) redirect("/403");

  const canManage = await hasPermission(session.role, "invitations.manage");
  return <InvitacionesAdminView canManage={canManage} />;
}