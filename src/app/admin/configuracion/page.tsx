import type { Metadata } from "next";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export const metadata: Metadata = { title: "Configuración — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminSettingsPage() {
  return <AdminModulePage moduleKey="settings" />;
}