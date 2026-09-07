import type { Metadata } from "next";
import { AdminReleasesView } from "@/components/admin/AdminReleasesView";

export const metadata: Metadata = { title: "Lanzamientos — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminReleasesPage() {
  return <AdminReleasesView />;
}