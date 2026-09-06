import type {
  AdminArtistDetail,
  AdminArtistRelease,
  AdminArtistSummary,
  ArtistProfile,
} from "@/types/artists";
import type { UserRole } from "@/types/auth";

export interface ArtistProfileRow {
  id: string;
  user_id: string;
  onboarding_id: string;
  username: string;
  email: string;
  nombre_artistico: string;
  pais: string;
  genero_principal: string;
  enlace_principal: string;
  instagram: string | null;
  tiktok: string | null;
  bio: string | null;
  status: ArtistProfile["status"];
  created_at: string;
  updated_at: string;
}

export interface AdminArtistRow extends ArtistProfileRow {
  role: UserRole;
  is_active: boolean;
  release_count: number;
}

export interface AdminArtistReleaseRow {
  id: string;
  title: AdminArtistRelease["title"];
  type: AdminArtistRelease["type"];
  status: AdminArtistRelease["status"];
  release_date: string | null;
  track_count: number;
  created_at: string;
}

export function toArtistProfile(row: ArtistProfileRow): ArtistProfile {
  return {
    id: row.id,
    userId: row.user_id,
    onboardingId: row.onboarding_id,
    username: row.username,
    email: row.email,
    nombreArtistico: row.nombre_artistico,
    pais: row.pais,
    generoPrincipal: row.genero_principal,
    enlacePrincipal: row.enlace_principal,
    instagram: row.instagram,
    tiktok: row.tiktok,
    bio: row.bio,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toAdminArtistSummary(row: AdminArtistRow): AdminArtistSummary {
  return {
    ...toArtistProfile(row),
    accountRole: row.role,
    accountActive: row.is_active,
    releaseCount: Number(row.release_count ?? 0),
  };
}

export function toAdminArtistRelease(row: AdminArtistReleaseRow): AdminArtistRelease {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    status: row.status,
    releaseDate: row.release_date,
    trackCount: Number(row.track_count ?? 0),
    createdAt: row.created_at,
  };
}

export function toAdminArtistDetail(
  row: AdminArtistRow,
  releases: AdminArtistRelease[],
): AdminArtistDetail {
  return { ...toAdminArtistSummary(row), releases };
}

export const ARTIST_EDITABLE_FIELDS = [
  "nombreArtistico",
  "pais",
  "generoPrincipal",
  "enlacePrincipal",
  "instagram",
  "tiktok",
  "bio",
] as const;

type EditableField = (typeof ARTIST_EDITABLE_FIELDS)[number];

const FIELD_MAP: Record<EditableField, string> = {
  nombreArtistico: "nombre_artistico",
  pais: "pais",
  generoPrincipal: "genero_principal",
  enlacePrincipal: "enlace_principal",
  instagram: "instagram",
  tiktok: "tiktok",
  bio: "bio",
};

const FIELD_LIMITS: Record<EditableField, number> = {
  nombreArtistico: 150,
  pais: 100,
  generoPrincipal: 100,
  enlacePrincipal: 2048,
  instagram: 255,
  tiktok: 255,
  bio: 2000,
};

export function parseArtistProfileUpdate(body: unknown):
  | { error: string }
  | { fields: EditableField[]; values: unknown[] } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { error: "El perfil debe enviarse como un objeto." };
  }

  const entries = Object.entries(body);
  const unknownField = entries.find(([key]) => !ARTIST_EDITABLE_FIELDS.includes(key as EditableField));
  if (unknownField) {
    return { error: `El campo ${unknownField[0]} no se puede modificar desde este módulo.` };
  }
  if (entries.length === 0) return { error: "Debes enviar al menos un campo para actualizar." };

  const fields: EditableField[] = [];
  const values: unknown[] = [];
  for (const [key, rawValue] of entries) {
    const field = key as EditableField;
    if (typeof rawValue !== "string" && !(field === "instagram" || field === "tiktok" || field === "bio") && rawValue !== null) {
      return { error: `El campo ${key} no tiene un formato válido.` };
    }
    if (rawValue !== null && typeof rawValue !== "string") {
      return { error: `El campo ${key} no tiene un formato válido.` };
    }

    const value = typeof rawValue === "string" ? rawValue.trim() : null;
    if (value && value.length > FIELD_LIMITS[field]) {
      return { error: `El campo ${key} supera el límite permitido.` };
    }
    if (field === "nombreArtistico" || field === "pais" || field === "generoPrincipal" || field === "enlacePrincipal") {
      if (!value) return { error: `El campo ${key} es obligatorio.` };
    }
    if (field === "enlacePrincipal" && value) {
      try {
        const url = new URL(value);
        if (!["http:", "https:"].includes(url.protocol)) throw new Error("scheme");
      } catch {
        return { error: "El enlace principal debe ser una URL válida http o https." };
      }
    }

    fields.push(field);
    values.push(value);
  }

  return { fields, values };
}

export function sqlFieldName(field: EditableField): string {
  return FIELD_MAP[field];
}
