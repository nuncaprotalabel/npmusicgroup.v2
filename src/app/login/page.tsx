"use client";

/**
 * Página de inicio de sesión — /login
 * Pública. Redirige al destino original si autenticación exitosa.
 * Diseño conforme a DESIGN_BRIEF.md: negro, amarillo, tipografía limpia.
 */
import { useState, useEffect, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { login } from "@/services/authService";

export default function LoginPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const from         = searchParams.get("from") ?? "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  // Limpiar error al modificar campos
  useEffect(() => { setError(null); }, [username, password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password) return;

    setLoading(true);
    setError(null);

    const result = await login(username.trim(), password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    // Redirigir al destino original (hard redirect para refrescar el layout)
    window.location.href = from;
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "#000000" }}
    >
      {/* Card */}
      <div
        className="w-full max-w-[400px] rounded-2xl p-8"
        style={{
          background:  "#0A0A0A",
          border:      "1px solid #1E1E1E",
          boxShadow:   "0 8px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-12 h-12 mb-4">
            <Image
              src="/logo-transparent.png"
              alt="NP Music Group"
              fill
              className="object-contain"
              style={{ filter: "drop-shadow(0 0 12px rgba(245,197,24,0.25))" }}
            />
          </div>
          <h1
            className="text-[1.125rem] font-bold text-white tracking-tight"
          >
            NP Music Group
          </h1>
          <p
            className="text-[0.8125rem] mt-1"
            style={{ color: "#737373" }}
          >
            Acceso a la plataforma
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-[0.8125rem] font-medium mb-1.5"
              style={{ color: "#A3A3A3" }}
            >
              Usuario
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={username}
              onChange={e => setUsername(e.target.value)}
              disabled={loading}
              placeholder="Tu nombre de usuario"
              className="w-full rounded-lg px-3.5 py-2.5 text-[0.875rem] text-white outline-none transition-all duration-150 disabled:opacity-50"
              style={{
                background:   "#141414",
                border:       "1px solid #2A2A2A",
                caretColor:   "#F5C518",
              }}
              onFocus={e => { e.currentTarget.style.borderColor = "#F5C518"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,197,24,0.08)"; }}
              onBlur={e  => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[0.8125rem] font-medium mb-1.5"
              style={{ color: "#A3A3A3" }}
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                disabled={loading}
                placeholder="Tu contraseña"
                className="w-full rounded-lg px-3.5 py-2.5 pr-10 text-[0.875rem] text-white outline-none transition-all duration-150 disabled:opacity-50"
                style={{
                  background: "#141414",
                  border:     "1px solid #2A2A2A",
                  caretColor: "#F5C518",
                }}
                onFocus={e => { e.currentTarget.style.borderColor = "#F5C518"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(245,197,24,0.08)"; }}
                onBlur={e  => { e.currentTarget.style.borderColor = "#2A2A2A"; e.currentTarget.style.boxShadow = "none"; }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(v => !v)}
                disabled={loading}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-150"
                style={{ color: "#525252" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#A3A3A3")}
                onMouseLeave={e => (e.currentTarget.style.color = "#525252")}
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPwd
                  ? <EyeOff size={16} strokeWidth={1.75} />
                  : <Eye    size={16} strokeWidth={1.75} />
                }
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2 rounded-lg px-3.5 py-2.5"
              role="alert"
              style={{
                background: "rgba(239,68,68,0.08)",
                border:     "1px solid rgba(239,68,68,0.20)",
              }}
            >
              <AlertCircle size={14} className="shrink-0" style={{ color: "#EF4444" }} />
              <p className="text-[0.8125rem]" style={{ color: "#EF4444" }}>
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !username.trim() || !password}
            className="w-full flex items-center justify-center gap-2 rounded-lg py-2.5 text-[0.875rem] font-semibold text-black transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background:  "linear-gradient(135deg, #F5C518 0%, #E6B300 100%)",
              boxShadow:   loading ? "none" : "0 2px 12px rgba(245,197,24,0.25)",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.boxShadow = "0 4px 20px rgba(245,197,24,0.40)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 2px 12px rgba(245,197,24,0.25)"; }}
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? "Verificando…" : "Iniciar sesión"}
          </button>

        </form>
      </div>

      {/* Footer */}
      <p
        className="mt-6 text-[0.75rem]"
        style={{ color: "#404040" }}
      >
        © {new Date().getFullYear()} NP Music Group. Acceso restringido.
      </p>
    </div>
  );
}
