import type { UserRole } from "@/types/auth";

export type ArtistStatus = "ONBOARDING_PENDIENTE" | "ACTIVO";

export interface ArtistProfile {
  id: string;
  userId: string;
  onboardingId: string;
  username: string;
  email: string;
  nombreArtistico: string;
  pais: string;
  generoPrincipal: string;
  enlacePrincipal: string;
  instagram: string | null;
  tiktok: string | null;
  bio: string | null;
  status: ArtistStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AdminArtistSummary extends ArtistProfile {
  accountRole: UserRole;
  accountActive: boolean;
  releaseCount: number;
}

export interface AdminArtistRelease {
  id: string;
  title: string;
  type: "SINGLE" | "EP" | "ALBUM";
  status: "DRAFT" | "READY" | "RELEASED" | "ARCHIVED";
  releaseDate: string | null;
  trackCount: number;
  createdAt: string;
}

export interface AdminArtistDetail extends AdminArtistSummary {
  releases: AdminArtistRelease[];
}

export type ArtistProfileUpdate = Partial<
  Pick<
    ArtistProfile,
    | "nombreArtistico"
    | "pais"
    | "generoPrincipal"
    | "enlacePrincipal"
    | "instagram"
    | "tiktok"
    | "bio"
  >
>;
