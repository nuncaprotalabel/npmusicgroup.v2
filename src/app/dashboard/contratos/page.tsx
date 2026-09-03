import { redirect } from "next/navigation";

export const metadata = { title: "Contratos — Administración | NP Music Group" };

export default function ContratosPage() {
  redirect("/admin/contratos");
}
