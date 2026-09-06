import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/session";
import { ReleasesView } from "@/components/releases/ReleasesView";

export const metadata: Metadata = {
  title: "Mi catálogo — Dashboard | NP Music Group",
  robots: "noindex, nofollow",
};

export default async function ReleasesPage() {
  const session = await getActiveSession();
  if (!session) redirect("/login?from=/dashboard/releases");
  if (session.role !== "ARTIST") redirect("/dashboard/central");
  return <ReleasesView />;
}