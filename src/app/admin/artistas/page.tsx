import type { Metadata } from "next";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export const metadata: Metadata = { title: "Artistas — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminArtistsPage() {
  return <AdminModulePage moduleKey="artists" />;
}