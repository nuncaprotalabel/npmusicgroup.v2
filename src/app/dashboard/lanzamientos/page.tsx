import { InDevelopment } from "@/components/dashboard/InDevelopment";
import { getActiveSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Lanzamientos — Dashboard | NP Music Group" };
export default async function LanzamientosPage() {
  const session = await getActiveSession();
  if (session?.role === "ARTIST") redirect("/dashboard/releases");
  return <InDevelopment moduleName="Lanzamientos" description="Publicación y gestión de releases con control total. Disponible próximamente." />;
}
