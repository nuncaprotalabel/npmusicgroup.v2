/**
 * Utilidades de contraseña — bcrypt.
 * Solo usar desde el runtime de Node.js (API Routes, Server Actions).
 * Nunca importar desde middleware (Edge runtime).
 */
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 12;

/** Genera el hash bcrypt de una contraseña en texto plano. */
export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, SALT_ROUNDS);
}

/** Verifica que una contraseña en texto plano coincide con su hash. */
export async function comparePassword(
  plaintext: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}
