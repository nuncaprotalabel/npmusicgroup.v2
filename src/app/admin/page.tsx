import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Central — Administración | NP Music Group",
  robots: "noindex, nofollow",
};

export default async function AdminPage() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/admin");
  redirect("/dashboard/central");
}