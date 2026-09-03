import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/session";
import { CentralPage } from "@/components/admin/CentralPage";

export const metadata: Metadata = {
  title: "Central — Administración | NP Music Group",
  robots: "noindex, nofollow",
};

export default async function AdminPage() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/admin");
  return <CentralPage />;
}