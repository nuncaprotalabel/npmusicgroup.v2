import { NextResponse } from "next/server";
import { queryOne } from "@/lib/db";
import { getActiveSession } from "@/lib/session";
import type { CreditRole, Release, ReleaseStatus, ReleaseType, Track, TrackCredit } from "@/types/releases";

export const RELEASE_TYPES = ["SINGLE", "EP", "ALBUM"] as const;
export const RELEASE_STATUSES = ["DRAFT", "READY", "RELEASED", "ARCHIVED"] as const;
export const CREDIT_ROLES = ["COMPOSER", "LYRICIST", "PRODUCER", "PERFORMER"] as const;

export interface ReleaseRow {
  id: string;
  artist_id: string;
  title: string;
  type: ReleaseType;
  status: ReleaseStatus;
  release_date: string | null;
  cover_url: string | null;
  upc: string | null;
  catalog_number: string | null;
  genre: string | null;
  subgenre: string | null;
  language: string | null;
  version: string | null;
  label: string | null;
  copyright_text: string | null;
  phonographic_copyright_text: string | null;
  explicit: boolean;
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
  isrc: string | null;
  version: string | null;
  language: string | null;
  explicit: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreditRow {
  id: string;
  track_id: string;
  name: string;
  role: CreditRole;
  created_at: string;
  updated_at: string;
}

export function toCredit(row: CreditRow): TrackCredit {
  return { id: row.id, trackId: row.track_id, name: row.name, role: row.role, createdAt: row.created_at, updatedAt: row.updated_at };
}

export function toTrack(row: TrackRow): Track {
  return {
    id: row.id,
    releaseId: row.release_id,
    title: row.title,
    trackNumber: row.track_number,
    durationSeconds: row.duration_seconds,
    audioUrl: row.audio_url,
    isrc: row.isrc,
    version: row.version,
    language: row.language,
    explicit: row.explicit,
    credits: [],
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
    upc: row.upc,
    catalogNumber: row.catalog_number,
    genre: row.genre,
    subgenre: row.subgenre,
    language: row.language,
    version: row.version,
    label: row.label,
    copyrightText: row.copyright_text,
    phonographicCopyrightText: row.phonographic_copyright_text,
    explicit: row.explicit,
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

function optionalText(value: unknown, field: string, max: number): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string" || value.trim().length > max || /[\u0000-\u001F\u007F]/.test(value)) {
    throw new Error(`${field} no es válido.`);
  }
  return value.trim();
}

function optionalCode(value: unknown, field: string, pattern: RegExp, max: number): string | null | undefined {
  const text = optionalText(value, field, max);
  if (text !== undefined && text !== null && !pattern.test(text)) throw new Error(`${field} no tiene un formato válido.`);
  return text;
}

export function parseReleaseInput(body: unknown, partial = false):
  | { error: string }
  | {
      title?: string;
      type?: ReleaseType;
      status?: ReleaseStatus;
      releaseDate?: string | null;
      coverUrl?: string | null;
      upc?: string | null; catalogNumber?: string | null; genre?: string | null; subgenre?: string | null;
      language?: string | null; version?: string | null; label?: string | null; copyrightText?: string | null;
      phonographicCopyrightText?: string | null; explicit?: boolean;
    } {
  const values = asObject(body);
  if (!values) return { error: "El release debe enviarse como un objeto." };
  const allowed = new Set(["title", "type", "status", "releaseDate", "coverUrl", "upc", "catalogNumber", "genre", "subgenre", "language", "version", "label", "copyrightText", "phonographicCopyrightText", "explicit"]);
  const unknown = Object.keys(values).find((key) => !allowed.has(key));
  if (unknown) return { error: `El campo ${unknown} no pertenece a un release.` };

  const parsed: {
    title?: string;
    type?: ReleaseType;
    status?: ReleaseStatus;
    releaseDate?: string | null;
    coverUrl?: string | null; upc?: string | null; catalogNumber?: string | null; genre?: string | null; subgenre?: string | null;
    language?: string | null; version?: string | null; label?: string | null; copyrightText?: string | null;
    phonographicCopyrightText?: string | null; explicit?: boolean;
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
    if ("upc" in values) parsed.upc = optionalCode(values.upc, "El UPC/EAN", /^\d{8,14}$/, 20);
    for (const [key, label, max] of [["catalogNumber","El número de catálogo",100],["genre","El género",100],["subgenre","El subgénero",100],["language","El idioma",20],["version","La versión",100],["label","El sello",150],["copyrightText","El copyright",1000],["phonographicCopyrightText","El copyright fonográfico",1000]] as const) {
      if (key in values) parsed[key] = optionalText(values[key], label, max) as never;
    }
    if ("explicit" in values) {
      if (typeof values.explicit !== "boolean") return { error: "El campo explícito debe ser booleano." };
      parsed.explicit = values.explicit;
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "La portada no es válida." };
  }

  return parsed;
}

export function parseTrackInput(body: unknown):
  | { error: string }
  | { title: string; trackNumber: number; durationSeconds: number | null; audioUrl: string | null; isrc?: string | null; version?: string | null; language?: string | null; explicit?: boolean } {
  const values = asObject(body);
  if (!values) return { error: "El track debe enviarse como un objeto." };
  const allowed = new Set(["title", "trackNumber", "durationSeconds", "audioUrl", "isrc", "version", "language", "explicit"]);
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
    const isrc = optionalCode(values.isrc, "El ISRC", /^[A-Za-z]{2}[A-Za-z0-9]{3}\d{7}$/, 30);
    const version = optionalText(values.version, "La versión", 100);
    const language = optionalText(values.language, "El idioma", 20);
    if (values.explicit !== undefined && typeof values.explicit !== "boolean") return { error: "El campo explícito debe ser booleano." };
    return { title: values.title.trim(), trackNumber, durationSeconds, audioUrl: audioUrl ?? null, isrc, version, language, explicit: values.explicit };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "El audio no es válido." };
  }
}

export function parseCreditInput(body: unknown):
  | { error: string }
  | { name: string; role: CreditRole } {
  const values = asObject(body);
  if (!values) return { error: "El crédito debe enviarse como un objeto." };
  const unknown = Object.keys(values).find((key) => !["name", "role"].includes(key));
  if (unknown) return { error: `El campo ${unknown} no pertenece a un crédito.` };
  if (typeof values.name !== "string" || !values.name.trim() || values.name.trim().length > 200 || /[\u0000-\u001F\u007F]/.test(values.name)) {
    return { error: "El nombre del crédito es obligatorio y no puede superar 200 caracteres." };
  }
  if (typeof values.role !== "string" || !CREDIT_ROLES.includes(values.role as CreditRole)) {
    return { error: "El rol del crédito no es válido." };
  }
  return { name: values.name.trim(), role: values.role as CreditRole };
}

export const RELEASE_SELECT = `
  SELECT id, artist_id, title, type, status, release_date, cover_url, upc, catalog_number, genre, subgenre, language, version, label, copyright_text, phonographic_copyright_text, explicit, created_at, updated_at
  FROM releases
`;

export const TRACK_SELECT = `
  SELECT id, release_id, title, track_number, duration_seconds, audio_url, isrc, version, language, explicit, created_at, updated_at
  FROM tracks
`;

export const CREDIT_SELECT = `
  SELECT id, track_id, name, role, created_at, updated_at
  FROM track_credits
`;