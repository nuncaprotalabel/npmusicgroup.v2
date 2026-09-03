import type { Metadata } from "next";
import { ArtistActivationForm } from "@/components/auth/ArtistActivationForm";

export const metadata: Metadata = {
  title: "Activar cuenta — NP Music Group",
  robots: "noindex, nofollow",
};

export default async function ArtistActivationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <ArtistActivationForm token={token} />;
}
