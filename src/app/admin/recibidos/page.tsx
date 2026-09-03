import type { Metadata } from "next";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export const metadata: Metadata = { title: "Recibidos / Pendientes — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminReceivedPage() {
  return <AdminModulePage moduleKey="releasesReceived" />;
}