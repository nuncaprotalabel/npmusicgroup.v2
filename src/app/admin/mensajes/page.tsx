import type { Metadata } from "next";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export const metadata: Metadata = { title: "Mensajes — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminMessagesPage() {
  return <AdminModulePage moduleKey="messaging" />;
}