import { getActiveSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata = { title: "Lanzamientos — Dashboard | NP Music Group" };
export default async function LanzamientosPage() {
  const session = await getActiveSession();
  if (session?.role === "ARTIST") redirect("/dashboard/releases");
  redirect("/admin/lanzamientos");
}
