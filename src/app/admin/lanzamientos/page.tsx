import type { Metadata } from "next";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export const metadata: Metadata = { title: "Lanzamientos — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminReleasesPage() {
  return <AdminModulePage moduleKey="releases" />;
}