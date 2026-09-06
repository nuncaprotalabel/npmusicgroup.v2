import type { Metadata } from "next";
import { AuthorizationError, requirePermission } from "@/lib/authorization";
import { redirect } from "next/navigation";
import { ArtistsAdminView } from "@/components/admin/ArtistsAdminView";

export const metadata: Metadata = { title: "Artistas — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminArtistsPage() {
  return <ArtistsContent />;
}

async function ArtistsContent() {
  try {
    await requirePermission("artists.view");
  } catch (error) {
    if (error instanceof AuthorizationError) {
      if (error.status === 401) redirect("/login?from=/admin/artistas");
      redirect("/403");
    }
    throw error;
  }
  return <ArtistsAdminView />;
}