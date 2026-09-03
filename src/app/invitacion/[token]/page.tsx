import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock3, ExternalLink, ShieldOff, XCircle } from "lucide-react";
import { validatePublicInvitation, type PublicInvitationStatus } from "@/lib/invitations";

export const metadata: Metadata = {
  title: "Invitación — NP Music Group",
  robots: "noindex, nofollow",
};

const STATUS_CONTENT: Record<PublicInvitationStatus, {
  title: string;
  description: string;
  icon: typeof CheckCircle2;
  color: string;
}> = {
  VALIDA: {
    title: "Invitación válida",
    description: "Tu solicitud fue aprobada y este enlace está listo para continuar con el proceso de incorporación.",
    icon: CheckCircle2,
    color: "#F5C518",
  },
  EXPIRADA: {
    title: "Invitación expirada",
    description: "Este enlace ya no está vigente. Solicita al equipo administrativo que genere una nueva invitación.",
    icon: Clock3,
    color: "#A3A3A3",
  },
  REVOCADA: {
    title: "Invitación revocada",
    description: "Este enlace fue revocado y ya no puede utilizarse. Contacta al equipo de NP Music Group.",
    icon: ShieldOff,
    color: "#EF4444",
  },
  UTILIZADA: {
    title: "Invitación ya utilizada",
    description: "Este enlace ya fue utilizado y no puede volver a abrirse.",
    icon: XCircle,
    color: "#A3A3A3",
  },
  INVALIDA: {
    title: "Invitación no válida",
    description: "No encontramos una invitación válida para este enlace. Comprueba que esté completo o solicita uno nuevo.",
    icon: AlertCircle,
    color: "#EF4444",
  },
};

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invitation = await validatePublicInvitation(token);
  const content = STATUS_CONTENT[invitation.status];
  const Icon = content.icon;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-12">
      <section className="w-full max-w-[480px] rounded-2xl border border-[#1E1E1E] bg-[#0A0A0A] p-8 text-center shadow-2xl sm:p-10">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: `${content.color}12`, border: `1px solid ${content.color}30` }}
        >
          <Icon size={30} style={{ color: content.color }} />
        </div>
        <p className="mb-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-[#525252]">
          NP Music Group
        </p>
        <h1 className="text-xl font-bold text-white">{content.title}</h1>
        {invitation.nombreArtistico && (
          <p className="mt-3 text-sm font-medium text-[#F5C518]">{invitation.nombreArtistico}</p>
        )}
        <p className="mt-3 text-sm leading-relaxed text-[#737373]">{content.description}</p>
        {invitation.status === "VALIDA" && invitation.expiresAt && (
          <p className="mt-4 rounded-lg border border-[#1E1E1E] bg-[#141414] px-3 py-2 text-xs text-[#A3A3A3]">
            Vigente hasta el {formatDate(invitation.expiresAt)}.
          </p>
        )}
        {invitation.status === "VALIDA" && (
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-[#525252]">
            <ExternalLink size={13} />
            El siguiente paso se habilitará en una fase posterior.
          </p>
        )}
        <Link href="/" className="mt-8 inline-flex items-center text-sm font-medium text-[#F5C518] hover:underline">
          Volver al inicio
        </Link>
      </section>
      <p className="mt-6 text-center text-xs text-[#333333]">© {new Date().getFullYear()} NP Music Group · Proceso de admisión interno</p>
    </main>
  );
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString("es", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}