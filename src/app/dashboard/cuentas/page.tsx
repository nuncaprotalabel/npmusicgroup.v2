import { redirect } from "next/navigation";

export const metadata = { title: "Cuentas — Administración | NP Music Group" };

export default function CuentasPage() {
  redirect("/admin/cuentas");
}
