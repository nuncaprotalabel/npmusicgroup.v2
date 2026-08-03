/**
 * /dashboard — redirige automáticamente a Central.
 */
import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/dashboard/central");
}
