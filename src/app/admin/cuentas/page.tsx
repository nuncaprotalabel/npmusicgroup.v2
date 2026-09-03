import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/session";
import { hasPermission } from "@/lib/permissions";
import { AccountsView } from "@/components/admin/AccountsView";

export const metadata: Metadata = {
  title: "Cuentas — Administración | NP Music Group",
  robots: "noindex, nofollow",
};

export default async function AdminAccountsPage() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/admin/cuentas");

  const canView = await hasPermission(session.role, "accounts.view");
  if (!canView) redirect("/403");

  const canManage = await hasPermission(session.role, "accounts.manage");
  return <AccountsView canManage={canManage} />;
}