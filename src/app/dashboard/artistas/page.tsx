import { InDevelopment } from "@/components/dashboard/InDevelopment";
import { getActiveSession } from "@/lib/session";
import { redirect } from "next/navigation";
export const metadata = { title: "Artistas — Dashboard | NP Music Group" };
export default async function ArtistasPage() {
  const session = await getActiveSession();
  if (session?.role === "ARTIST") redirect("/dashboard/perfil");
  return <InDevelopment moduleName="Artistas" description="Gestión de artistas, perfiles y roles. Disponible próximamente." />;
}
