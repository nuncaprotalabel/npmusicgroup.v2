import type { Metadata } from "next";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export const metadata: Metadata = { title: "Permisos — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminPermissionsPage() {
  return <AdminModulePage moduleKey="permissions" />;
}