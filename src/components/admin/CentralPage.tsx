import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CentralPageClient } from "./CentralPageClient";

export async function CentralPage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/admin");

  return <CentralPageClient username={session.username} role={session.role} />;
}