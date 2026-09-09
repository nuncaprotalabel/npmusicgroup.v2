import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/session";
import { CentralPageClient } from "@/components/admin/CentralPageClient";

export const metadata: Metadata = {
  title: "Central — Administración | NP Music Group",
  robots: "noindex, nofollow",
};

export default async function AdminPage() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/admin");
  return <CentralPageClient username={session.username} role={session.role} />;
}