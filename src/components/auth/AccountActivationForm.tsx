"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type State = "loading" | "ready" | "invalid" | "success";

export function AccountActivationForm({ token }: { token: string }) {
  const [state, setState] = useState<State>("loading");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch(`/api/activar-cuenta/${encodeURIComponent(token)}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (cancelled) return;
        if (!response.ok) {
          setError(payload?.error ?? "El enlace no está disponible.");
          setState("invalid");
          return;
        }
        setUsername(payload.username ?? "");
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setError("No se pudo validar el enlace.");
          setState("invalid");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setBusy(true);
    const response = await fetch(`/api/activar-cuenta/${encodeURIComponent(token)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, confirmation }),
    }).catch(() => null);
    const payload = await response?.json().catch(() => null);
    setBusy(false);
    if (!response?.ok) {
      setError(payload?.error ?? "No se pudo activar la cuenta.");
      return;
    }
    setState("success");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] px-4 py-12 text-white">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="relative h-10 w-10">
            <Image src="/logo-transparent.png" alt="NP Music Group" fill className="object-contain" priority />
          </div>
          <span className="font-bold">NP Music Group</span>
        </div>

        <section className="rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A] p-6 sm:p-8">
          {state === "loading" && (
            <div className="flex min-h-40 items-center justify-center text-sm text-[#737373]">
              <Loader2 className="mr-2 animate-spin" size={18} /> Validando enlace…
            </div>
          )}
          {state === "invalid" && (
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 text-[#EF4444]" size={28} />
              <h1 className="text-xl font-semibold">Enlace no disponible</h1>
              <p className="mt-2 text-sm text-[#737373]">{error}</p>
              <Link href="/login" className="mt-6 inline-block text-sm text-[#F5C518] hover:underline">Ir al inicio de sesión</Link>
            </div>
          )}
          {state === "success" && (
            <div className="text-center">
              <CheckCircle2 className="mx-auto mb-4 text-[#34D399]" size={28} />
              <h1 className="text-xl font-semibold">Cuenta activada</h1>
              <p className="mt-2 text-sm text-[#737373]">Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <Link href="/login" className="mt-6 inline-block rounded-lg bg-[#F5C518] px-5 py-3 text-sm font-semibold text-black hover:bg-[#FFD84A]">Iniciar sesión</Link>
            </div>
          )}
          {state === "ready" && (
            <>
              <h1 className="text-xl font-semibold">Activa tu cuenta</h1>
              <p className="mt-2 text-sm text-[#737373]">
                Establece una contraseña para completar la activación de <strong className="text-[#A3A3A3]">{username}</strong>.
              </p>
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="relative">
                  <Input id="activation-password" label="Contraseña" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} minLength={12} required fullWidth />
                  <button type="button" className="absolute right-3 top-9 text-[#525252] hover:text-white" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <div className="relative">
                  <Input id="activation-confirmation" label="Confirmar contraseña" type={showConfirmation ? "text" : "password"} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} minLength={12} required fullWidth />
                  <button type="button" className="absolute right-3 top-9 text-[#525252] hover:text-white" onClick={() => setShowConfirmation((value) => !value)} aria-label={showConfirmation ? "Ocultar contraseña" : "Mostrar contraseña"}>
                    {showConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] px-3 py-2.5 text-sm text-[#EF4444]" role="alert"><AlertCircle size={15} className="mt-0.5 shrink-0" />{error}</p>}
                <Button type="submit" variant="primary" fullWidth loading={busy}>Activar cuenta</Button>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}