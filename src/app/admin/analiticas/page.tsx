import type { Metadata } from "next";
import { AdminModulePage } from "@/components/admin/AdminModulePage";

export const metadata: Metadata = { title: "Analíticas — Administración | NP Music Group", robots: "noindex, nofollow" };
export default function AdminAnalyticsPage() {
  return <AdminModulePage moduleKey="analytics" />;
}