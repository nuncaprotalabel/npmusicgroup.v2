export type ReleaseType = "SINGLE" | "EP" | "ALBUM";
export type ReleaseStatus = "DRAFT" | "READY" | "RELEASED" | "ARCHIVED";

export interface Track {
  id: string;
  releaseId: string;
  title: string;
  trackNumber: number;
  durationSeconds: number | null;
  audioUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Release {
  id: string;
  artistId: string;
  title: string;
  type: ReleaseType;
  status: ReleaseStatus;
  releaseDate: string | null;
  coverUrl: string | null;
  createdAt: string;
  updatedAt: string;
  tracks: Track[];
}