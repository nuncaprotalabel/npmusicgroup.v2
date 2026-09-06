import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getActiveSession } from "@/lib/session";
import type { Release, ReleaseStatus, ReleaseType, Track } from "@/types/releases";

export const RELEASE_TYPES = ["SINGLE", "EP", "ALBUM"] as const;
export const RELEASE_STATUSES = ["DRAFT", "READY", "RELEASED", "ARCHIVED"] as const;

export interface ReleaseRow {
  id: string;
  artist_id: string;
  title: string;
  type: ReleaseType;
  status: ReleaseStatus;
  release_date: string | null;
  cover_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrackRow {
  id: string;
  release_id: string;
  title: string;
  track_number: number;
  duration_seconds: number | null;
  audio_url: string | null;
  created_at: string;
  updated_at: string;
}

export function toTrack(row: TrackRow): Track {
  return {
    id: row.id,
    releaseId: row.release_id,
    title: row.title,
    trackNumber: row.track_number,
    durationSeconds: row.duration_seconds,
    audioUrl: row.audio_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toRelease(row: ReleaseRow, tracks: Track[] = []): Release {
  return {
    id: row.id,
    artistId: row.artist_id,
    title: row.title,
    type: row.type,
    status: row.status,
    releaseDate: row.release_date,
    coverUrl: row.cover_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    tracks,
  };
}

export async function requireArtistContext():
  Promise<
    | { session: NonNullable<Awaited<ReturnType<typeof getActiveSession>>>; artistId: string }
    | { error: NextResponse }
  > {
  const session = await getActiveSession();
  if (!session) {
    return { error: NextResponse.json({ error: "No autenticado." }, { status: 401 }) };
  }
  if (session.role !== "ARTIST") {
    return { error: NextResponse.json({ error: "Esta sección es exclusiva para artistas." }, { status: 403 }) };
  }

  const artist = await queryOne<{ id: string }>(
    `SELECT id FROM artists WHERE user_id = $1 AND status = 'ACTIVO'`,
    [session.userId],
  );
  if (!artist) {
    return { error: NextResponse.json({ error: "No existe un perfil ARTIST activo asociado a esta cuenta." }, { status: 404 }) };
  }

  return { session, artistId: artist.id };
}

function asObject(body: unknown): Record<string, unknown> | null {
  return body && typeof body === "object" && !Array.isArray(body)
    ? body as Record<string, unknown>
    : null;
}

function optionalUrl(value: unknown, field: string): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string" || value.length > 2048) {
    throw new Error(`${field} no tiene un formato válido.`);
  }
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error("protocol");
  } catch {
    throw new Error(`${field} debe ser una URL http o https válida.`);
  }
  return value;
}

export function parseReleaseInput(body: unknown, partial = false):
  | { error: string }
  | {
      title?: string;
      type?: ReleaseType;
      status?: ReleaseStatus;
      releaseDate?: string | null;
      coverUrl?: string | null;
    } {
  const values = asObject(body);
  if (!values) return { error: "El release debe enviarse como un objeto." };
  const allowed = new Set(["title", "type", "status", "releaseDate", "coverUrl"]);
  const unknown = Object.keys(values).find((key) => !allowed.has(key));
  if (unknown) return { error: `El campo ${unknown} no pertenece a un release.` };

  const parsed: {
    title?: string;
    type?: ReleaseType;
    status?: ReleaseStatus;
    releaseDate?: string | null;
    coverUrl?: string | null;
  } = {};

  if (!partial || "title" in values) {
    if (typeof values.title !== "string" || !values.title.trim() || values.title.trim().length > 200) {
      return { error: "El título es obligatorio y no puede superar 200 caracteres." };
    }
    parsed.title = values.title.trim();
  }
  if (!partial || "type" in values) {
    if (typeof values.type !== "string" || !RELEASE_TYPES.includes(values.type as ReleaseType)) {
      return { error: "El tipo de release no es válido." };
    }
    parsed.type = values.type as ReleaseType;
  }
  if ("status" in values) {
    if (typeof values.status !== "string" || !RELEASE_STATUSES.includes(values.status as ReleaseStatus)) {
      return { error: "El estado del release no es válido." };
    }
    parsed.status = values.status as ReleaseStatus;
  }
  if ("releaseDate" in values) {
    if (values.releaseDate === null || values.releaseDate === "") {
      parsed.releaseDate = null;
    } else if (
      typeof values.releaseDate !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(values.releaseDate) ||
      Number.isNaN(Date.parse(`${values.releaseDate}T00:00:00Z`))
    ) {
      return { error: "La fecha de lanzamiento no es válida." };
    } else {
      parsed.releaseDate = values.releaseDate;
    }
  }
  try {
    if ("coverUrl" in values) parsed.coverUrl = optionalUrl(values.coverUrl, "La portada");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "La portada no es válida." };
  }

  return parsed;
}

export function parseTrackInput(body: unknown):
  | { error: string }
  | { title: string; trackNumber: number; durationSeconds: number | null; audioUrl: string | null } {
  const values = asObject(body);
  if (!values) return { error: "El track debe enviarse como un objeto." };
  const allowed = new Set(["title", "trackNumber", "durationSeconds", "audioUrl"]);
  const unknown = Object.keys(values).find((key) => !allowed.has(key));
  if (unknown) return { error: `El campo ${unknown} no pertenece a un track.` };

  if (typeof values.title !== "string" || !values.title.trim() || values.title.trim().length > 200) {
    return { error: "El título del track es obligatorio y no puede superar 200 caracteres." };
  }
  const trackNumber = Number(values.trackNumber);
  if (!Number.isInteger(trackNumber) || trackNumber < 1 || trackNumber > 999) {
    return { error: "El número del track debe ser un entero positivo." };
  }
  let durationSeconds: number | null = null;
  if (values.durationSeconds !== undefined && values.durationSeconds !== null && values.durationSeconds !== "") {
    durationSeconds = Number(values.durationSeconds);
    if (!Number.isInteger(durationSeconds) || durationSeconds < 0) {
      return { error: "La duración debe ser un número entero positivo." };
    }
  }
  try {
    const audioUrl = optionalUrl(values.audioUrl, "El audio");
    return { title: values.title.trim(), trackNumber, durationSeconds, audioUrl: audioUrl ?? null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "El audio no es válido." };
  }
}

export const RELEASE_SELECT = `
  SELECT id, artist_id, title, type, status, release_date, cover_url, created_at, updated_at
  FROM releases
`;

export const TRACK_SELECT = `
  SELECT id, release_id, title, track_number, duration_seconds, audio_url, created_at, updated_at
  FROM tracks
`;