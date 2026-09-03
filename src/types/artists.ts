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
