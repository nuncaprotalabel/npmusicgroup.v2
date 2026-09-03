import type { Metadata } from "next";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export const metadata: Metadata = { title: "Ingresos — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminRevenuePage() {
  return <AdminModulePage moduleKey="revenue" />;
}