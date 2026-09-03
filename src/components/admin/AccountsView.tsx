"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clipboard,
  Edit3,
  KeyRound,
  Loader2,
  Plus,
  Shield,
  UserCheck,
  UserX,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  ACCOUNT_ROLE_LABELS,
  ACCOUNT_ROLES,
  type Account,
  type CreateAccountResult,
} from "@/types/accounts";
import {
  createAccount,
  getAccounts,
  invalidateAccountSessions,
  updateAccount,
} from "@/services/accountService";
import type { UserRole } from "@/types/auth";

type ModalMode = "create" | "edit" | null;
type FormState = { username: string; email: string; role: UserRole };

const EMPTY_FORM: FormState = {
  username: "",
  email: "",
  role: "ARTIST",
};

export function AccountsView({ canManage }: { canManage: boolean }) {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalMode>(null);
  const [editing, setEditing] = useState<Account | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [setup, setSetup] = useState<CreateAccountResult | null>(null);
  const [copied, setCopied] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoadError(null);
    const result = await getAccounts();
    if (result.error) setLoadError(result.error);
    else setAccounts(result.accounts ?? []);
  }, []);

  useEffect(() => {
    void loadAccounts();
  }, [loadAccounts]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setEditing(null);
    setFormError(null);
    setModal("create");
  }

  function openEdit(account: Account) {
    setForm({
      username: account.username,
      email: account.email ?? "",
      role: account.role,
    });
    setEditing(account);
    setFormError(null);
    setModal("edit");
  }

  function closeModal() {
    if (!busy) {
      setModal(null);
      setEditing(null);
      setFormError(null);
    }
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.username.trim() || !form.email.trim()) {
      setFormError("Username y correo son requeridos.");
      return;
    }

    setBusy(true);
    const wasCreate = modal === "create";
    if (wasCreate) {
      const result = await createAccount({
        username: form.username.trim(),
        email: form.email.trim(),
        role: form.role,
      });
      setBusy(false);

      if (result.error) {
        setFormError(result.error);
        return;
      }

      closeModal();
      await loadAccounts();
      setSetup(result);
      return;
    }

    const result = editing
      ? await updateAccount(editing.id, {
          username: form.username.trim(),
          email: form.email.trim(),
          role: form.role,
        })
      : { error: "No se encontró la cuenta a editar." };
    setBusy(false);

    if (result.error) {
      setFormError(result.error);
      return;
    }

    closeModal();
    await loadAccounts();
  }

  async function toggleAccount(account: Account) {
    const action = account.isActive ? "desactivar" : "activar";
    if (!window.confirm(`¿Quieres ${action} la cuenta ${account.username}?`)) return;

    setActionId(account.id);
    const result = await updateAccount(account.id, { isActive: !account.isActive });
    setActionId(null);
    if (result.error) setLoadError(result.error);
    else await loadAccounts();
  }

  async function invalidateSessions(account: Account) {
    if (!window.confirm(`¿Invalidar todas las sesiones de ${account.username}?`)) return;

    setActionId(account.id);
    const result = await invalidateAccountSessions(account.id);
    setActionId(null);
    if (result.error) setLoadError(result.error);
    else {
      setLoadError(null);
      window.alert(`${result.invalidated ?? 0} sesión(es) invalidada(s).`);
    }
  }

  async function copySetupUrl() {
    if (!setup?.setupUrl) return;
    await navigator.clipboard.writeText(setup.setupUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">
            Administración
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-white">Cuentas</h1>
          <p className="mt-1 text-sm text-[#737373]">
            Gestiona los usuarios y sus permisos de acceso a la plataforma.
          </p>
        </div>
        {canManage && (
          <Button
            variant="primary"
            size="md"
            icon={<Plus size={16} strokeWidth={2} />}
            onClick={openCreate}
          >
            Crear cuenta
          </Button>
        )}
      </div>

      {setup?.setupUrl && (
        <div
          className="rounded-xl p-4"
          style={{
            background: "rgba(52,211,153,0.06)",
            border: "1px solid rgba(52,211,153,0.2)",
          }}
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 shrink-0 text-[#34D399]" size={17} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-[#34D399]">Cuenta creada</p>
              <p className="mt-1 text-xs leading-relaxed text-[#737373]">
                La cuenta quedó desactivada hasta que el usuario establezca su contraseña.
                Comparte este enlace una sola vez; vence en 7 días.
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#1E1E1E] bg-[#080808] p-2">
                <code className="min-w-0 flex-1 truncate text-xs text-[#A3A3A3]">
                  {setup.setupUrl}
                </code>
                <button
                  type="button"
                  onClick={() => void copySetupUrl()}
                  className="flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2 text-xs text-[#A3A3A3] transition-colors hover:text-white"
                >
                  {copied ? <Check size={13} /> : <Clipboard size={13} />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
              <p className="mt-2 text-[0.6875rem] text-[#404040]">
                El enlace no se almacena en los registros de auditoría.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSetup(null)}
              className="shrink-0 text-[#525252] transition-colors hover:text-white"
              aria-label="Cerrar aviso"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {loadError && (
        <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-[#EF4444]">
          <AlertCircle className="mt-0.5 shrink-0" size={15} />
          <span className="flex-1">{loadError}</span>
          <button
            type="button"
            className="font-medium underline underline-offset-2"
            onClick={() => void loadAccounts()}
          >
            Reintentar
          </button>
        </div>
      )}

      <section
        className="overflow-hidden rounded-xl border border-[#1E1E1E] bg-[#0A0A0A]"
        aria-label="Listado de cuentas"
      >
        <div className="border-b border-[#141414] px-5 py-4">
          <p className="text-sm font-semibold text-white">
            {accounts === null ? "Cargando cuentas…" : `${accounts.length} cuenta${accounts.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {accounts === null ? (
          <div className="flex flex-col items-center justify-center py-16 text-sm text-[#525252]">
            <Loader2 className="mb-3 animate-spin" size={22} />
            Consultando cuentas reales…
          </div>
        ) : accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <Shield className="mb-3 text-[#333333]" size={28} strokeWidth={1.5} />
            <p className="text-sm font-medium text-white">No hay cuentas registradas</p>
            {canManage && (
              <p className="mt-1 text-sm text-[#525252]">Crea la primera cuenta desde este módulo.</p>
            )}
          </div>
        ) : (
          <div>
            <div className="hidden grid-cols-[1.2fr_1.3fr_1.2fr_120px_170px] gap-4 border-b border-[#141414] px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-wider text-[#404040] md:grid">
              <span>Usuario</span>
              <span>Correo</span>
              <span>Rol</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>
            <div className="divide-y divide-[#141414]">
              {accounts.map((account) => (
                <AccountRow
                  key={account.id}
                  account={account}
                  canManage={canManage}
                  busy={actionId === account.id}
                  onEdit={openEdit}
                  onToggle={() => void toggleAccount(account)}
                  onInvalidate={() => void invalidateSessions(account)}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {modal && (
        <AccountModal
          mode={modal}
          form={form}
          busy={busy}
          error={formError}
          onChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
          onSubmit={submitForm}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

function AccountRow({
  account,
  canManage,
  busy,
  onEdit,
  onToggle,
  onInvalidate,
}: {
  account: Account;
  canManage: boolean;
  busy: boolean;
  onEdit: (account: Account) => void;
  onToggle: () => void;
  onInvalidate: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 px-5 py-4 md:grid md:grid-cols-[1.2fr_1.3fr_1.2fr_120px_170px] md:items-center md:gap-4">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-white">{account.username}</p>
        <p className="mt-1 text-xs text-[#525252] md:hidden">
          Creada {formatDate(account.createdAt)}
        </p>
      </div>
      <p className="truncate text-sm text-[#A3A3A3]">{account.email ?? "—"}</p>
      <p className="flex items-center gap-2 text-sm text-[#A3A3A3]">
        <span className="md:hidden text-xs text-[#525252]">Rol:</span>
        {ACCOUNT_ROLE_LABELS[account.role]}
      </p>
      <div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[0.6875rem] font-semibold"
          style={
            account.isActive
              ? { color: "#34D399", background: "rgba(52,211,153,0.08)", borderColor: "rgba(52,211,153,0.2)" }
              : { color: "#737373", background: "rgba(115,115,115,0.08)", borderColor: "#2A2A2A" }
          }
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {account.isActive ? "Activa" : "Desactivada"}
        </span>
      </div>
      {canManage ? (
        <div className="flex flex-wrap items-center gap-2 border-t border-[#141414] pt-3 md:border-0 md:pt-0">
          <button
            type="button"
            onClick={() => onEdit(account)}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#262626] px-2.5 py-1.5 text-xs text-[#A3A3A3] transition-colors hover:border-[#555] hover:text-white disabled:opacity-50"
          >
            <Edit3 size={13} />
            Editar
          </button>
          <button
            type="button"
            onClick={onToggle}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#262626] px-2.5 py-1.5 text-xs text-[#737373] transition-colors hover:border-[#F5C518]/50 hover:text-[#F5C518] disabled:opacity-50"
          >
            {busy ? <Loader2 size={13} className="animate-spin" /> : account.isActive ? <UserX size={13} /> : <UserCheck size={13} />}
            {account.isActive ? "Desactivar" : "Activar"}
          </button>
          <button
            type="button"
            onClick={onInvalidate}
            disabled={busy}
            title="Invalidar sesiones activas"
            className="inline-flex items-center gap-1.5 rounded-md border border-[#262626] px-2.5 py-1.5 text-xs text-[#737373] transition-colors hover:border-[#555] hover:text-white disabled:opacity-50"
          >
            <KeyRound size={13} />
            <span className="hidden xl:inline">Sesiones</span>
          </button>
        </div>
      ) : (
        <span className="text-xs text-[#404040]">Solo lectura</span>
      )}
    </div>
  );
}

function AccountModal({
  mode,
  form,
  busy,
  error,
  onChange,
  onSubmit,
  onClose,
}: {
  mode: Exclude<ModalMode, null>;
  form: FormState;
  busy: boolean;
  error: string | null;
  onChange: (field: keyof FormState, value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Cerrar formulario"
      />
      <div className="relative w-full max-w-[500px] rounded-t-2xl border border-[#1E1E1E] bg-[#0A0A0A] p-6 shadow-2xl sm:rounded-2xl">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              {mode === "create" ? "Crear cuenta" : "Editar cuenta"}
            </h2>
            <p className="mt-1 text-sm text-[#737373]">
              {mode === "create"
                ? "La cuenta se activará después de establecer una contraseña."
                : "Los cambios se guardarán en la base de datos."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#525252] transition-colors hover:text-white"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            id="account-username"
            label="Username"
            value={form.username}
            onChange={(event) => onChange("username", event.target.value)}
            placeholder="ej. artistaurbano"
            autoComplete="off"
            disabled={busy}
            fullWidth
          />
          <Input
            id="account-email"
            label="Correo electrónico"
            type="email"
            value={form.email}
            onChange={(event) => onChange("email", event.target.value)}
            placeholder="correo@ejemplo.com"
            autoComplete="email"
            disabled={busy}
            fullWidth
          />
          <label className="flex flex-col gap-1.5 text-sm font-medium text-[#A3A3A3]" htmlFor="account-role">
            Rol
            <select
              id="account-role"
              value={form.role}
              onChange={(event) => onChange("role", event.target.value)}
              disabled={busy}
              className="h-10 w-full rounded-lg border border-[#1E1E1E] bg-[#0A0A0A] px-4 text-sm text-white outline-none transition-colors focus:border-[#F5C518]/50 focus:ring-1 focus:ring-[#F5C518]/30 disabled:opacity-50"
            >
              {ACCOUNT_ROLES.map((role) => (
                <option key={role} value={role}>
                  {ACCOUNT_ROLE_LABELS[role]}
                </option>
              ))}
            </select>
          </label>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-sm text-[#EF4444]" role="alert">
              <AlertCircle className="mt-0.5 shrink-0" size={14} />
              {error}
            </div>
          )}

          <div className="flex gap-2 border-t border-[#141414] pt-5">
            <Button type="button" variant="outline" fullWidth onClick={onClose} disabled={busy}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" fullWidth loading={busy}>
              {mode === "create" ? "Crear cuenta" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}