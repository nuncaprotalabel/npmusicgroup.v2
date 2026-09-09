import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

export function NpControlPendingPage({ module }: { module: "users" | "permissions" | "activity" | "settings" }) {
  const { t } = useTranslation();
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A] p-8">
      <ShieldAlert className="mb-5 text-[#F5C518]" size={24} />
      <p className="text-[0.6875rem] uppercase tracking-[0.18em] text-[#F5C518]">
        {t.dashboard.modulePage.status}
      </p>
      <h1 className="mt-2 text-2xl font-bold text-white">{t.dashboard.modules[module]}</h1>
      <p className="mt-3 text-sm leading-7 text-[#737373]">
        {t.dashboard.modulePage.description}
      </p>
      <Link href="/np-control" className="mt-7 inline-flex items-center gap-2 text-sm text-[#F5C518]">
        <ArrowLeft size={15} />
        {t.dashboard.modulePage.backToCentral}
      </Link>
    </div>
  );
}