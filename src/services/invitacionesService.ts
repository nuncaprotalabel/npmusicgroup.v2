import type { Invitation, InvitationLinkResult } from "@/types/invitations";

interface InvitationListResult {
  invitaciones?: Invitation[];
  error?: string;
}

export async function getInvitaciones(): Promise<InvitationListResult> {
  try {
    const response = await fetch("/api/admin/invitaciones", { cache: "no-store" });
    const payload = await response.json() as InvitationListResult;
    if (!response.ok) return { error: payload.error || "No se pudieron cargar las invitaciones." };
    return { invitaciones: payload.invitaciones ?? [] };
  } catch {
    return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }
}

export async function revokeInvitation(id: string): Promise<{ invitation?: Invitation; error?: string }> {
  try {
    const response = await fetch(`/api/admin/invitaciones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "revoke" }),
    });
    const payload = await response.json() as { invitation?: Invitation; error?: string };
    if (!response.ok) return { error: payload.error || "No se pudo revocar la invitación." };
    return payload;
  } catch {
    return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }
}

export async function regenerateInvitation(id: string): Promise<InvitationLinkResult> {
  try {
    const response = await fetch(`/api/admin/invitaciones/${id}`, { method: "POST" });
    const payload = await response.json() as InvitationLinkResult;
    if (!response.ok) return { error: payload.error || "No se pudo regenerar la invitación." };
    return payload;
  } catch {
    return { error: "No se pudo conectar con el servidor. Intenta de nuevo." };
  }
}