export type ReleaseType = "SINGLE" | "EP" | "ALBUM";
export type ReleaseStatus = "DRAFT" | "READY" | "RELEASED" | "ARCHIVED";
export type CreditRole = "COMPOSER" | "LYRICIST" | "PRODUCER" | "PERFORMER";

export interface TrackCredit {
  id: string;
  trackId: string;
  name: string;
  role: CreditRole;
  createdAt: string;
  updatedAt: string;
}

export interface Track {
  id: string;
  releaseId: string;
  title: string;
  trackNumber: number;
  durationSeconds: number | null;
  audioUrl: string | null;
  isrc: string | null;
  version: string | null;
  language: string | null;
  explicit: boolean;
  credits: TrackCredit[];
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
  upc: string | null;
  catalogNumber: string | null;
  genre: string | null;
  subgenre: string | null;
  language: string | null;
  version: string | null;
  label: string | null;
  copyrightText: string | null;
  phonographicCopyrightText: string | null;
  explicit: boolean;
  createdAt: string;
  updatedAt: string;
  tracks: Track[];
}