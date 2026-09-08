import type { Metadata } from "next";
import { AdminReleasesView } from "@/components/admin/AdminReleasesView";
import { requireAdminModulePermission } from "@/components/admin/AdminModulePage";

export const metadata: Metadata = { title: "Lanzamientos — Administración | NP Music Group", robots: "noindex, nofollow" };
export default async function AdminReleasesPage() {
  await requireAdminModulePermission("releases.view", "/admin/lanzamientos");
  return <AdminReleasesView />;
}