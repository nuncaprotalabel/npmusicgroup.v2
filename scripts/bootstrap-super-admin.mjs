import { Pool } from "pg";
import bcrypt from "bcryptjs";

const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.SUPER_ADMIN_PASSWORD;
const username = process.env.SUPER_ADMIN_USERNAME?.trim() || "npmusicadmin";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL no está definido.");
}

if (!email || !email.includes("@") || email.length > 255) {
  throw new Error("SUPER_ADMIN_EMAIL debe ser un correo válido.");
}

if (!password || password.length < 12) {
  throw new Error("SUPER_ADMIN_PASSWORD debe tener al menos 12 caracteres.");
}

if (!/^[A-Za-z0-9_-]{3,50}$/.test(username)) {
  throw new Error("SUPER_ADMIN_USERNAME no cumple el formato permitido.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

try {
  const existing = await pool.query(
    "SELECT id FROM users WHERE LOWER(email) = $1 OR username = $2 LIMIT 1",
    [email, username],
  );

  if (existing.rowCount > 0) {
    console.log("La cuenta SUPER_ADMIN ya existe; no se modificó.");
    process.exitCode = 0;
  } else {
    const passwordHash = await bcrypt.hash(password, 12);
    await pool.query(
      `INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, 'SUPER_ADMIN')`,
      [username, email, passwordHash],
    );
    console.log("Cuenta SUPER_ADMIN creada mediante bootstrap seguro.");
  }
} finally {
  await pool.end();
}