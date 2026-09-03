"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  FileText,
  Loader2,
  Save,
  Send,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getContracts, submitContract, updateContract } from "@/services/contratosService";
import {
  SECTION_LABELS,
  validateContractForSubmission,
} from "@/lib/contracts";
import type { Contract, ContractSections, ContractStatus } from "@/types/contracts";

const STATUS_CONFIG: Record<ContractStatus, {
  label: string;
  color: string;
  background: string;
  border: string;
}> = {
  BORRADOR: { label: "Borrador", color: "#F5C518", background: "rgba(245,197,24,0.1)", border: "rgba(245,197,24,0.2)" },
  PENDIENTE_FIRMA: { label: "Pendiente de firma", color: "#A3A3A3", background: "rgba(163,163,163,0.08)", border: "#2A2A2A" },
  FIRMADO: { label: "Firmado", color: "#34D399", background: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)" },
  RECHAZADO: { label: "Rechazado", color: "#EF4444", background: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
  CANCELADO: { label: "Cancelado", color: "#EF4444", background: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
};

export function ContratosAdminView({ canManage }: { canManage: boolean }) {
  const [contracts, setContracts] = useState<Contract[] | null>(null);
  const [selected, setSelected] = useState<Contract | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    const result = await getContracts();
    if (result.error) setError(result.error);
    else setContracts(result.contracts ?? []);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveDraft() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    const result = await updateContract(selected.id, {
      title: selected.title,
      version: selected.version,
      content: selected.content,
      sections: selected.sections,
    });
    setSaving(false);
    if (result.error || !result.contract) {
      setError(result.error || "No se pudo guardar el borrador.");
      return;
    }
    setSelected(result.contract);
    setContracts((current) => current?.map((item) => item.id === result.contract!.id ? result.contract! : item) ?? current);
  }

  async function sendToSignature() {
    if (!selected) return;
    const validation = validateContractForSubmission(selected);
    if (validation.length) {
      setMissing(validation);
      setError("Completa los requisitos indicados antes de enviar el contrato.");
      return;
    }
    if (!window.confirm("¿Enviar este contrato a pendiente de firma? Después no podrá editarse.")) return;
    setSaving(true);
    setError(null);
    setMissing([]);
    const result = await submitContract(selected.id);
    setSaving(false);
    if (result.error || !result.contract) {
      setError(result.error || "No se pudo enviar el contrato.");
      setMissing(result.missing ?? []);
      return;
    }
    setSelected(result.contract);
    setContracts((current) => current?.map((item) => item.id === result.contract!.id ? result.contract! : item) ?? current);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <header>
        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">Administración</p>
        <h1 className="text-2xl font-bold tracking-tight text-white">Contratos</h1>
        <p className="mt-1 text-sm text-[#737373]">
          Gestiona borradores contractuales de invitaciones válidas sin iniciar todavía la firma electrónica.
        </p>
      </header>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-[#EF4444]" role="alert">
          <AlertCircle className="mt-0.5 shrink-0" size={15} />
          <span className="flex-1">{error}</span>
          <button type="button" className="font-medium underline underline-offset-2" onClick={() => void load()}>Reintentar</button>
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]" aria-label="Contratos">
        <div className="border-b border-[#141414] px-5 py-4">
          <p className="text-sm font-semibold text-white">
            {contracts === null ? "Cargando contratos…" : `${contracts.length} contrato${contracts.length === 1 ? "" : "s"}`}
          </p>
        </div>
        {contracts === null ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-[#525252]"><Loader2 className="mb-3 animate-spin" size={22} />Consultando PostgreSQL…</div>
        ) : contracts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <FileText className="mb-3 text-[#333333]" size={28} strokeWidth={1.5} />
            <p className="text-sm font-medium text-white">No hay contratos creados</p>
            <p className="mt-1 text-sm text-[#525252]">Crea un borrador desde una invitación válida.</p>
          </div>
        ) : (
          <>
            <div className="hidden grid-cols-[1.4fr_1.15fr_1fr_90px_110px_130px] gap-4 border-b border-[#141414] px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040] md:grid">
              <span>Contrato / Artista</span><span>Email</span><span>Estado</span><span>Versión</span><span>Distribución</span><span>Firma / actualización</span>
            </div>
            <div className="divide-y divide-[#141414]">
              {contracts.map((contract) => (
                <button key={contract.id} type="button" onClick={() => { setSelected({ ...contract, sections: { ...contract.sections } }); setMissing([]); setError(null); }} className="group block w-full px-5 py-4 text-left transition-colors hover:bg-[#0D0D0D]">
                  <div className="flex items-start justify-between gap-3 md:hidden">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{contract.title}</p>
                      <p className="mt-1 truncate text-xs text-[#737373]">{contract.nombreArtistico} · {contract.email}</p>
                      <p className="mt-1 text-xs text-[#525252]">v{contract.version} · 85% / 15%</p>
                    </div>
                    <StatusBadge status={contract.status} />
                  </div>
                  <div className="hidden grid-cols-[1.4fr_1.15fr_1fr_90px_110px_130px] items-center gap-4 md:grid">
                    <div className="min-w-0"><p className="truncate text-sm font-medium text-white">{contract.title}</p><p className="mt-1 truncate text-xs text-[#525252]">{contract.nombreArtistico}</p></div>
                    <span className="truncate text-sm text-[#A3A3A3]">{contract.email}</span>
                    <StatusBadge status={contract.status} />
                    <span className="text-sm text-[#A3A3A3]">v{contract.version}</span>
                    <span className="text-xs text-[#A3A3A3]">{contract.artistPercentage}% / {contract.companyPercentage}%</span>
                    <span className="text-xs text-[#525252]">{contract.signedAt ? formatDate(contract.signedAt) : formatDate(contract.updatedAt)}</span>
                  </div>
                  <ChevronRight size={15} className="absolute right-3 hidden text-[#333333] group-hover:text-[#737373] md:block" />
                </button>
              ))}
            </div>
          </>
        )}
      </section>

      {selected && (
        <ContractDetail
          contract={selected}
          canManage={canManage}
          saving={saving}
          missing={missing}
          onClose={() => setSelected(null)}
          onChange={setSelected}
          onSave={() => void saveDraft()}
          onSubmit={() => void sendToSignature()}
        />
      )}
    </div>
  );
}

function ContractDetail({
  contract,
  canManage,
  saving,
  missing,
  onClose,
  onChange,
  onSave,
  onSubmit,
}: {
  contract: Contract;
  canManage: boolean;
  saving: boolean;
  missing: string[];
  onClose: () => void;
  onChange: (contract: Contract) => void;
  onSave: () => void;
  onSubmit: () => void;
}) {
  const editable = canManage && contract.status === "BORRADOR";
  const inputClass = "w-full rounded-lg border border-[#2A2A2A] bg-[#141414] px-3 py-2.5 text-sm text-white outline-none transition-colors focus:border-[#F5C518] disabled:cursor-not-allowed disabled:opacity-60";
  function updateField(field: "title" | "version" | "content", value: string) {
    onChange({ ...contract, [field]: value });
  }
  function updateSection(key: string, value: string) {
    onChange({ ...contract, sections: { ...contract.sections, [key]: value } });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Cerrar detalle" />
      <article className="relative max-h-[94vh] w-full max-w-[760px] overflow-y-auto rounded-t-2xl border border-[#1E1E1E] bg-[#0A0A0A] shadow-2xl sm:rounded-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-[#141414] bg-[#0A0A0A] px-6 py-4">
          <div className="flex min-w-0 items-center gap-2.5"><h2 className="truncate text-base font-semibold text-white">{contract.title}</h2><StatusBadge status={contract.status} /></div>
          <button type="button" onClick={onClose} className="text-[#525252] hover:text-white" aria-label="Cerrar"><X size={18} /></button>
        </header>
        <div className="space-y-6 p-6">
          {missing.length > 0 && (
            <div className="rounded-lg border border-red-500/20 bg-red-500/[0.06] p-4 text-sm text-[#EF4444]">
              <p className="font-medium">Faltan requisitos:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">{missing.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
            <Info label="Artista / solicitud" value={`${contract.nombreArtistico} · ${contract.email}`} />
            <Info label="Tipo" value={contract.type} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_120px]">
            <label className="block"><span className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">Título</span><input className={inputClass} value={contract.title} disabled={!editable} onChange={(event) => updateField("title", event.target.value)} /></label>
            <label className="block"><span className="mb-1.5 block text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">Versión</span><input className={inputClass} value={contract.version} disabled={!editable} onChange={(event) => updateField("version", event.target.value)} /></label>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:max-w-[300px]">
            <Info label="Artista" value={`${contract.artistPercentage}%`} />
            <Info label="NP Music Group" value={`${contract.companyPercentage}%`} />
          </div>
          <div>
            <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">Contenido contractual</p>
            <textarea className={`${inputClass} min-h-[140px] resize-y`} value={contract.content} disabled={!editable} placeholder="Añade aquí el contenido aprobado por NP Music Group. No se ha inventado texto legal." onChange={(event) => updateField("content", event.target.value)} />
          </div>
          <div>
            <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">Secciones</p>
            <div className="space-y-4">
              {Object.entries(SECTION_LABELS).map(([key, label]) => (
                <label key={key} className="block"><span className="mb-1.5 block text-sm font-medium text-[#A3A3A3]">{label}{(key === "rights" || key === "termination" || key === "economics") && <span className="ml-1 text-[#F5C518]">*</span>}</span><textarea className={`${inputClass} min-h-[84px] resize-y`} value={sectionValue(contract.sections, key)} disabled={!editable} onChange={(event) => updateSection(key, event.target.value)} placeholder={key === "rights" || key === "termination" || key === "economics" ? "Contenido aprobado pendiente de incorporar." : ""} /></label>
              ))}
            </div>
          </div>
          <div className="border-t border-[#141414] pt-5 text-xs text-[#525252]">
            <p>Creado por {contract.createdBy || "Usuario eliminado"} el {formatDateTime(contract.createdAt)}.</p>
            <p className="mt-1">Última actualización: {formatDateTime(contract.updatedAt)}.</p>
            {contract.status === "FIRMADO" && contract.signedAt && (
              <p className="mt-1 text-[#34D399]">Firmado el {formatDateTime(contract.signedAt)} · versión {contract.signedVersion || contract.version}.</p>
            )}
          </div>
          {editable && (
            <div className="flex flex-col gap-2 border-t border-[#141414] pt-5 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" disabled={saving} icon={<Save size={15} />} onClick={onSave}>Guardar borrador</Button>
              <Button type="button" variant="primary" loading={saving} icon={!saving ? <Send size={15} /> : undefined} onClick={onSubmit}>Enviar a firma</Button>
            </div>
          )}
          {!editable && contract.status === "PENDIENTE_FIRMA" && <p className="flex items-center gap-2 border-t border-[#141414] pt-5 text-xs text-[#A3A3A3]"><CheckCircle2 size={14} className="text-[#F5C518]" />Contrato bloqueado y disponible para aceptación mediante la invitación.</p>}
          {!editable && contract.status === "FIRMADO" && <p className="flex items-center gap-2 border-t border-[#141414] pt-5 text-xs text-[#A3A3A3]"><CheckCircle2 size={14} className="text-[#34D399]" />CONTRATO FIRMADO — ONBOARDING PENDIENTE.</p>}
        </div>
      </article>
    </div>
  );
}

function StatusBadge({ status }: { status: ContractStatus }) {
  const config = STATUS_CONFIG[status];
  return <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2 py-1 text-[0.6875rem] font-semibold" style={{ color: config.color, background: config.background, borderColor: config.border }}><span className="h-1.5 w-1.5 rounded-full bg-current" />{config.label}</span>;
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040]">{label}</p><p className="break-words text-sm text-[#A3A3A3]">{value}</p></div>;
}

function sectionValue(sections: ContractSections, key: string): string {
  const value = sections[key];
  return typeof value === "string" ? value : "";
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("es", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}