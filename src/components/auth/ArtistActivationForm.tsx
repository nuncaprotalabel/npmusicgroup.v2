"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  activateArtistAccount,
  getActivationInfo,
  type ActivationInfo,
} from "@/services/onboardingService";

interface ArtistActivationFormProps {
  token: string;
}

export function ArtistActivationForm({ token }: ArtistActivationFormProps) {
  const [info, setInfo] = useState<ActivationInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void getActivationInfo(token).then((result) => {
      if (cancelled) return;
      setLoadingInfo(false);
      if ("error" in result) setError(result.error);
      else setInfo(result);
    });
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password || !confirmation || saving) return;

    setSaving(true);
    setError(null);
    const result = await activateArtistAccount(token, password, confirmation);
    setSaving(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setActivated(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-10">
      <section className="w-full max-w-[440px] rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A] p-6 shadow-2xl sm:p-9">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="relative mb-4 h-12 w-12">
            <Image
              src="/logo-transparent.png"
              alt="NP Music Group"
              fill
              priority
              className="object-contain"
            />
          </div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">
            NP Music Group
          </p>
          <h1 className="mt-2 text-xl font-bold tracking-tight text-white">
            Activación de cuenta
          </h1>
        </div>

        {loadingInfo ? (
          <div className="flex flex-col items-center py-8 text-sm text-[#737373]">
            <Loader2 className="mb-3 animate-spin text-[#F5C518]" size={22} />
            Validando enlace seguro…
          </div>
        ) : activated ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#34D399]/20 bg-[#34D399]/[0.08]">
              <CheckCircle2 className="text-[#34D399]" size={28} />
            </div>
            <h2 className="mt-5 text-lg font-bold text-white">CUENTA ACTIVADA</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#A3A3A3]">
              Tu contraseña se estableció correctamente. Ya puedes iniciar sesión en la plataforma.
            </p>
            <Link
              href="/login"
              className="mt-7 inline-flex h-10 items-center justify-center rounded-lg bg-[#F5C518] px-5 text-sm font-semibold text-black transition-colors hover:bg-[#FFCF2F]"
            >
              Continuar al login
            </Link>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#EF4444]/20 bg-[#EF4444]/[0.08]">
              <AlertCircle className="text-[#EF4444]" size={28} />
            </div>
            <h2 className="mt-5 text-lg font-bold text-white">Enlace no disponible</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#A3A3A3]">{error}</p>
            <Link
              href="/"
              className="mt-7 inline-flex text-sm font-medium text-[#F5C518] hover:underline"
            >
              Volver al inicio
            </Link>
          </div>
        ) : info ? (
          <>
            <div className="mb-6 rounded-lg border border-[#1E1E1E] bg-[#141414] px-4 py-3">
              <p className="text-xs text-[#737373]">Cuenta preparada para</p>
              <p className="mt-1 text-sm font-semibold text-[#F5C518]">{info.artistName}</p>
              <p className="mt-1 text-xs text-[#525252]">Usuario: {info.username}</p>
            </div>
            <div className="mb-6 flex items-start gap-3 text-sm leading-relaxed text-[#A3A3A3]">
              <LockKeyhole className="mt-0.5 shrink-0 text-[#F5C518]" size={16} />
              <p>Establece una contraseña para activar tu acceso. Este enlace solo puede utilizarse una vez.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="relative">
                <Input
                  id="password"
                  label="Nueva contraseña"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  disabled={saving}
                  error={password && password.length < 12 ? "Usa al menos 12 caracteres." : undefined}
                  hint="Mínimo 12 caracteres."
                  fullWidth
                />
                <button
                  type="button"
                  className="absolute right-3 top-[2.15rem] text-[#525252] hover:text-[#A3A3A3]"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="relative">
                <Input
                  id="confirmation"
                  label="Confirmar contraseña"
                  type={showConfirmation ? "text" : "password"}
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  autoComplete="new-password"
                  disabled={saving}
                  error={confirmation && confirmation !== password ? "Las contraseñas no coinciden." : undefined}
                  fullWidth
                />
                <button
                  type="button"
                  className="absolute right-3 top-[2.15rem] text-[#525252] hover:text-[#A3A3A3]"
                  onClick={() => setShowConfirmation((value) => !value)}
                  aria-label={showConfirmation ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showConfirmation ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={saving}
                disabled={!password || !confirmation || password.length < 12 || password !== confirmation}
              >
                {saving ? "Activando cuenta…" : "Establecer contraseña y activar"}
              </Button>
            </form>
          </>
        ) : null}
      </section>
    </main>
  );
}
