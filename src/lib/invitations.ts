import { createHash } from "crypto";
import { queryOne } from "@/lib/db";
import type { InvitationStatus } from "@/types/invitations";

export type PublicInvitationStatus = "VALIDA" | "EXPIRADA" | "REVOCADA" | "UTILIZADA" | "INVALIDA";

export interface PublicInvitation {
  status: PublicInvitationStatus;
  nombreArtistico?: string;
  email?: string;
  expiresAt?: string;
}

interface PublicInvitationRow {
  id: string;
  nombre_artistico: string;
  email: string;
  status: InvitationStatus;
  expires_at: string;
}

export function hashInvitationToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export async function validatePublicInvitation(token: string): Promise<PublicInvitation> {
  if (!/^[A-Za-z0-9_-]{32,100}$/.test(token)) return { status: "INVALIDA" };

  const row = await queryOne<PublicInvitationRow>(
    `SELECT i.id, s.nombre_artistico, i.email, i.status, i.expires_at
     FROM invitations i
     INNER JOIN solicitudes s ON s.id = i.solicitud_id
     WHERE i.token_hash = $1
     LIMIT 1`,
    [hashInvitationToken(token)],
  );

  if (!row) return { status: "INVALIDA" };

  if (row.status === "PENDIENTE" && new Date(row.expires_at).getTime() <= Date.now()) {
    await queryOne(
      `UPDATE invitations
       SET status = 'EXPIRADA', updated_at = NOW()
       WHERE id = $1 AND status = 'PENDIENTE'
       RETURNING id`,
      [row.id],
    );
    return { status: "EXPIRADA", nombreArtistico: row.nombre_artistico, email: row.email };
  }

  if (row.status === "PENDIENTE") {
    return {
      status: "VALIDA",
      nombreArtistico: row.nombre_artistico,
      email: row.email,
      expiresAt: row.expires_at,
    };
  }
  if (row.status === "EXPIRADA") return { status: "EXPIRADA", nombreArtistico: row.nombre_artistico };
  if (row.status === "REVOCADA") return { status: "REVOCADA", nombreArtistico: row.nombre_artistico };
  return { status: "UTILIZADA", nombreArtistico: row.nombre_artistico };
}