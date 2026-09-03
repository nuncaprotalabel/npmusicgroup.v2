"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle2, FileSignature, Loader2, ShieldCheck } from "lucide-react";
import type { ContractSections } from "@/types/contracts";
import type { PublicInvitationContract } from "@/lib/invitations";
import { SECTION_LABELS } from "@/lib/contracts";

export function PublicContractReview({
  token,
  contract,
  artistName,
}: {
  token: string;
  contract: PublicInvitationContract;
  artistName?: string;
}) {
  const [readConfirmed, setReadConfirmed] = useState(false);
  const [acceptConfirmed, setAcceptConfirmed] = useState(false);
  const [intentConfirmed, setIntentConfirmed] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "signed" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function signContract() {
    if (!readConfirmed || !acceptConfirmed || !intentConfirmed) {
      setError("Confirma las tres casillas antes de firmar y aceptar.");
      return;
    }
    setStatus("submitting");
    setError(null);
    try {
      const response = await fetch(`/api/invitacion/${token}/aceptar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readConfirmed, acceptConfirmed, intentConfirmed }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) {
        setStatus("error");
        setError(payload.error || "No se pudo registrar la aceptación.");
        return;
      }
      setStatus("signed");
    } catch {
      setStatus("error");
      setError("No se pudo conectar con el servidor. Intenta de nuevo.");
    }
  }

  if (status === "signed") {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
        <section className="w-full max-w-[560px] rounded-2xl border border-[#F5C518]/30 bg-[#0A0A0A] p-8 text-center shadow-2xl sm:p-10">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#34D399]/25 bg-[#34D399]/10"><CheckCircle2 size={30} className="text-[#34D399]" /></div>
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">NP Music Group</p>
          <h1 className="text-2xl font-bold text-white">Contrato firmado y aceptado</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#A3A3A3]">Tu aceptación quedó registrada para la versión {contract.version}.</p>
          <div className="mt-6 rounded-lg border border-[#1E1E1E] bg-[#141414] px-4 py-3 text-sm text-[#F5C518]">CONTRATO FIRMADO — ONBOARDING PENDIENTE</div>
          <p className="mt-5 text-xs leading-relaxed text-[#525252]">El siguiente paso de creación y activación de cuenta se realizará en una fase posterior.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black px-4 py-8 text-white sm:px-6 sm:py-12">
      <div className="mx-auto max-w-[820px]">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#F5C518]/25 bg-[#F5C518]/10"><FileSignature size={25} className="text-[#F5C518]" /></div>
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">NP Music Group presenta</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Revisión de contrato</h1>
          {artistName && <p className="mt-2 text-sm text-[#A3A3A3]">Preparado para {artistName}</p>}
        </header>

        <section className="overflow-hidden rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A] shadow-2xl">
          <div className="border-b border-[#1E1E1E] px-5 py-5 sm:px-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
              <div><p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-[#525252]">Documento</p><h2 className="mt-1 text-xl font-semibold text-white">{contract.title}</h2></div>
              <div className="flex gap-5 text-left sm:text-right"><div><p className="text-[0.6875rem] uppercase tracking-wider text-[#525252]">Tipo</p><p className="mt-1 text-sm text-[#A3A3A3]">{contract.type}</p></div><div><p className="text-[0.6875rem] uppercase tracking-wider text-[#525252]">Versión</p><p className="mt-1 text-sm font-medium text-[#F5C518]">{contract.version}</p></div></div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:max-w-[360px]"><EconomicCard label="Artista" value={`${contract.artistPercentage}%`} /><EconomicCard label="NP Music Group" value={`${contract.companyPercentage}%`} /></div>
          </div>

          <div className="space-y-8 px-5 py-7 sm:px-8">
            <section><h3 className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#F5C518]">Contenido del contrato</h3><div className="whitespace-pre-wrap rounded-lg border border-[#1E1E1E] bg-[#050505] px-4 py-4 text-sm leading-7 text-[#D4D4D4]">{contract.content || "Contenido no disponible."}</div></section>
            <section><h3 className="mb-4 text-[0.6875rem] font-semibold uppercase tracking-[0.15em] text-[#F5C518]">Secciones</h3><div className="space-y-6">{Object.entries(SECTION_LABELS).map(([key, label]) => <ContractSection key={key} label={label} value={sectionValue(contract.sections, key)} />)}</div></section>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A] p-5 sm:p-7">
          <div className="mb-5 flex gap-3"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-[#F5C518]" /><div><h2 className="text-base font-semibold text-white">Aceptación expresa</h2><p className="mt-1 text-sm leading-relaxed text-[#737373]">Revisa el documento completo antes de confirmar. La aceptación será registrada para esta versión exacta.</p></div></div>
          <div className="space-y-3 text-sm text-[#A3A3A3]">
            <ConfirmBox checked={readConfirmed} onChange={setReadConfirmed}>He leído y revisado el contrato completo, incluyendo sus secciones y condiciones económicas.</ConfirmBox>
            <ConfirmBox checked={acceptConfirmed} onChange={setAcceptConfirmed}>Acepto expresamente el contenido del contrato y sus condiciones.</ConfirmBox>
            <ConfirmBox checked={intentConfirmed} onChange={setIntentConfirmed}>Confirmo que deseo firmar y aceptar este contrato.</ConfirmBox>
          </div>
          {error && <p className="mt-4 flex items-start gap-2 text-sm text-[#EF4444]" role="alert"><AlertCircle size={15} className="mt-0.5 shrink-0" />{error}</p>}
          <button type="button" disabled={status === "submitting"} onClick={() => void signContract()} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#F5C518] px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#FFD84D] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
            {status === "submitting" && <Loader2 size={16} className="animate-spin" />}Firmar y aceptar contrato
          </button>
          <p className="mt-4 text-xs leading-relaxed text-[#525252]">Esta aceptación interna es auditable y no utiliza proveedores externos de firma electrónica.</p>
        </section>
      </div>
    </main>
  );
}

function ConfirmBox({ checked, onChange, children }: { checked: boolean; onChange: (value: boolean) => void; children: React.ReactNode }) {
  return <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#1E1E1E] bg-[#050505] px-3 py-3 transition-colors has-[:checked]:border-[#F5C518]/40"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="mt-0.5 h-4 w-4 accent-[#F5C518]" /><span>{children}</span></label>;
}

function ContractSection({ label, value }: { label: string; value: string }) {
  return <div><h4 className="mb-2 text-sm font-semibold text-white">{label}</h4><div className="whitespace-pre-wrap text-sm leading-7 text-[#A3A3A3]">{value || "Sin contenido disponible."}</div></div>;
}

function EconomicCard({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg border border-[#1E1E1E] bg-[#141414] px-4 py-3"><p className="text-[0.6875rem] uppercase tracking-wider text-[#525252]">{label}</p><p className="mt-1 text-lg font-semibold text-[#F5C518]">{value}</p></div>;
}

function sectionValue(sections: ContractSections, key: string): string {
  const value = sections[key];
  return typeof value === "string" ? value : "";
}