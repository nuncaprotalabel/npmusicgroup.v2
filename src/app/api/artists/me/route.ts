import { NextRequest, NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { getClientIp, logAudit } from "@/lib/audit";
import { getActiveSession } from "@/lib/session";
import {
  parseArtistProfileUpdate,
  sqlFieldName,
  toArtistProfile,
  type ArtistProfileRow,
} from "@/lib/artists";

const PROFILE_SELECT = `
  SELECT a.id, a.user_id, a.onboarding_id, u.username, u.email,
         a.nombre_artistico, a.pais, a.genero_principal, a.enlace_principal,
         a.instagram, a.tiktok, a.bio, a.status, a.created_at, a.updated_at
  FROM artists a
  INNER JOIN users u ON u.id = a.user_id
  WHERE a.user_id = $1
    AND u.role = 'ARTIST'
`;

async function requireArtist() {
  const session = await getActiveSession();
  if (!session) return { error: NextResponse.json({ error: "No autenticado." }, { status: 401 }) };
  if (session.role !== "ARTIST") {
    return { error: NextResponse.json({ error: "Esta sección es exclusiva para artistas." }, { status: 403 }) };
  }
  return { session };
}

export async function GET(): Promise<NextResponse> {
  try {
    const auth = await requireArtist();
    if (auth.error) return auth.error;

    const row = await queryOne<ArtistProfileRow>(`${PROFILE_SELECT} LIMIT 1`, [auth.session.userId]);
    if (!row) {
      return NextResponse.json({ error: "No existe un perfil ARTIST asociado a esta cuenta." }, { status: 404 });
    }
    return NextResponse.json({ artist: toArtistProfile(row) });
  } catch (error) {
    console.error("[GET /api/artists/me]", error);
    return NextResponse.json({ error: "No se pudo consultar el perfil." }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const auth = await requireArtist();
    if (auth.error) return auth.error;

    const parsed = parseArtistProfileUpdate(await request.json().catch(() => null));
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const setClause = parsed.fields
      .map((field, index) => `${sqlFieldName(field)} = $${index + 2}`)
      .concat("updated_at = NOW()")
      .join(", ");
    const updated = await queryOne<ArtistProfileRow>(
      `UPDATE artists a
       SET ${setClause}
       FROM users u
       WHERE a.user_id = $1
         AND u.id = a.user_id
         AND u.role = 'ARTIST'
         AND u.is_active = true
       RETURNING a.id, a.user_id, a.onboarding_id, u.username, u.email,
                 a.nombre_artistico, a.pais, a.genero_principal, a.enlace_principal,
                 a.instagram, a.tiktok, a.bio, a.status, a.created_at, a.updated_at`,
      [auth.session.userId, ...parsed.values],
    );
    if (!updated) {
      return NextResponse.json({ error: "No existe un perfil ARTIST activo asociado a esta cuenta." }, { status: 404 });
    }

    await logAudit({
      userId: auth.session.userId,
      username: auth.session.username,
      action: "ARTIST_PROFILE_UPDATED",
      entityType: "artist",
      entityId: updated.id,
      metadata: { fields: parsed.fields },
      ipAddress: getClientIp(request.headers),
      userAgent: request.headers.get("user-agent") ?? undefined,
      severity: "INFO",
    });
    return NextResponse.json({ artist: toArtistProfile(updated) });
  } catch (error) {
    console.error("[PATCH /api/artists/me]", error);
    return NextResponse.json({ error: "No se pudo actualizar el perfil." }, { status: 500 });
  }
}
