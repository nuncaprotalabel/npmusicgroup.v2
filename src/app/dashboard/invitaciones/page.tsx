import { redirect } from "next/navigation";

export const metadata = { title: "Invitaciones — Administración | NP Music Group" };

export default function InvitacionesPage() {
  redirect("/admin/invitaciones");
}
