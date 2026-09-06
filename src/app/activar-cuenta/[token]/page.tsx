import type { Metadata } from "next";
import { AccountActivationForm } from "@/components/auth/AccountActivationForm";

export const metadata: Metadata = {
  title: "Activar cuenta — NP Music Group",
  robots: "noindex, nofollow",
};

export default async function AccountActivationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <AccountActivationForm token={token} />;
}