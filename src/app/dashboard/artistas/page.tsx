import { ArtistsAdminView } from "@/components/admin/ArtistsAdminView";
import { AuthorizationError, requirePermission } from "@/lib/authorization";
import { redirect } from "next/navigation";
export const metadata = { title: "Artistas — Dashboard | NP Music Group" };
export default async function ArtistasPage() {
  try {
    await requirePermission("artists.view");
  } catch (error) {
    if (error instanceof AuthorizationError) {
      if (error.status === 401) redirect("/login?from=/dashboard/artistas");
      redirect("/403");
    }
    throw error;
  }
  return <ArtistsAdminView />;
}
