"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react";
import { useTranslation } from "@/i18n/useTranslation";

interface PublicInfoPageProps {
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  eyebrowEs?: string;
  eyebrowEn?: string;
}

export function PublicInfoPage({
  titleEs,
  titleEn,
  descriptionEs,
  descriptionEn,
  eyebrowEs = "Información",
  eyebrowEn = "Information",
}: PublicInfoPageProps) {
  const { language } = useTranslation();
  const isEs = language === "es";
  return (
    <main className="min-h-screen bg-black px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="mb-16 inline-flex items-center gap-2 text-sm text-[#737373] transition-colors hover:text-[#F5C518]">
          <ArrowLeft size={15} /> {isEs ? "Volver al inicio" : "Back to home"}
        </Link>
        <section className="rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A] p-8 sm:p-14">
          <div className="mb-7 flex h-11 w-11 items-center justify-center rounded-xl bg-[#F5C518]/[0.08]">
            <CircleCheck size={20} className="text-[#F5C518]" />
          </div>
          <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#F5C518]">
            {isEs ? eyebrowEs : eyebrowEn}
          </p>
          <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">{isEs ? titleEs : titleEn}</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-[#A3A3A3]">{isEs ? descriptionEs : descriptionEn}</p>
          <Link href="/aplicar" className="mt-9 inline-flex items-center gap-2 rounded-lg bg-[#F5C518] px-5 py-3 text-sm font-bold text-black transition-colors hover:bg-[#FFD84A]">
            {isEs ? "Solicitar acceso" : "Request access"} <ArrowRight size={15} />
          </Link>
        </section>
      </div>
    </main>
  );
}