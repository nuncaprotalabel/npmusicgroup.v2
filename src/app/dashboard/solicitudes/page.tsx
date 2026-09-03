import { redirect } from "next/navigation";

export const metadata = { title: "Solicitudes — Administración | NP Music Group" };

export default function SolicitudesPage() {
  redirect("/admin/solicitudes");
}
