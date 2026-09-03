import { createHash, randomBytes } from "node:crypto";

export const ACTIVATION_TOKEN_PATTERN = /^[A-Za-z0-9_-]{32,100}$/;
export const ACTIVATION_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_BYTES = 72;

export function createActivationToken() {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: hashActivationToken(token),
    expiresAt: new Date(Date.now() + ACTIVATION_TOKEN_TTL_MS),
  };
}

export function hashActivationToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function isValidActivationToken(token: string): boolean {
  return ACTIVATION_TOKEN_PATTERN.test(token);
}

export function isValidPassword(password: string): boolean {
  return (
    password.length >= MIN_PASSWORD_LENGTH &&
    password.length <= 128 &&
    Buffer.byteLength(password, "utf8") <= MAX_PASSWORD_BYTES
  );
}

export function normalizeUsernameSeed(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9_-]/g, "")
    .slice(0, 44);
}

export function usernameBase(nombreArtistico: string, email: string): string {
  const artistSeed = normalizeUsernameSeed(nombreArtistico);
  const emailSeed = normalizeUsernameSeed(email.split("@")[0] ?? "");
  const seed = artistSeed || emailSeed || "artist";
  return seed.length >= 3 ? seed : `${seed}artist`.slice(0, 50);
}
