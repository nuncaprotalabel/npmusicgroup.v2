import type { Metadata } from "next";
import { getActiveSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ArtistsAdminView } from "@/components/admin/ArtistsAdminView";

export const metadata: Metadata = { title: "Artistas — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminArtistsPage() {
  return <ArtistsContent />;
}

async function ArtistsContent() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/admin/artistas");
  return <ArtistsAdminView />;
}