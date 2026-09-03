import { getActiveSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { ArtistProfileView } from "@/components/dashboard/ArtistProfileView";

export const metadata = {
  title: "Mi perfil — Dashboard | NP Music Group",
};

export default async function ArtistProfilePage() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/dashboard/perfil");
  if (session.role !== "ARTIST") redirect("/dashboard/central");
  return <ArtistProfileView />;
}
