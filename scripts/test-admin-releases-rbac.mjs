import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { SignJWT } from "jose";
import { Pool } from "pg";

const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:5000";
const databaseUrl = process.env.DATABASE_URL;
const sessionSecret = process.env.SESSION_SECRET;

if (!databaseUrl) throw new Error("DATABASE_URL no está definido.");
if (!sessionSecret) throw new Error("SESSION_SECRET no está definido.");

const pool = new Pool({ connectionString: databaseUrl });
let server;
let startedServer = false;

async function request(path, method, cookie, body) {
  const hasBody = body !== undefined && method !== "GET" && method !== "HEAD";
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      cookie: `np_session=${cookie}`,
      ...(hasBody ? { "content-type": "application/json" } : {}),
    },
    ...(hasBody ? { body: JSON.stringify(body) } : {}),
  });
}

async function createSession(user, permissions) {
  const sessionId = randomUUID();
  await pool.query(
    `INSERT INTO sessions (id, user_id, expires_at, is_active)
     VALUES ($1, $2, NOW() + INTERVAL '10 minutes', true)`,
    [sessionId, user.id],
  );
  const token = await new SignJWT({
    userId: user.id,
    username: user.username,
    role: user.role,
    sessionId,
    permissions,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(new TextEncoder().encode(sessionSecret));
  return { sessionId, token };
}

async function ensureServer() {
  try {
    await fetch(`${baseUrl}/api/auth/me`);
    return;
  } catch {
    server = spawn("npm", ["run", "dev"], {
      stdio: ["ignore", "pipe", "pipe"],
      env: process.env,
      detached: true,
    });
    startedServer = true;
    const deadline = Date.now() + 30_000;
    while (Date.now() < deadline) {
      try {
        await fetch(`${baseUrl}/api/auth/me`);
        return;
      } catch {
        await delay(500);
      }
    }
    throw new Error("El servidor de desarrollo no respondió en 30 segundos.");
  }
}

const sessionIds = [];

try {
  await ensureServer();

  const users = await pool.query(
    `SELECT id, username, role
     FROM users
     WHERE is_active = true AND role IN ('ADMIN', 'ARTIST')
     ORDER BY role`,
  );
  const admin = users.rows.find((user) => user.role === "ADMIN");
  const artist = users.rows.find((user) => user.role === "ARTIST");
  assert.ok(admin, "La prueba requiere un usuario ADMIN activo.");
  assert.ok(artist, "La prueba requiere un usuario ARTIST activo.");

  const permissions = await pool.query(
    `SELECT
       EXISTS (
         SELECT 1 FROM role_permissions rp
         JOIN permissions p ON p.id = rp.permission_id
         WHERE rp.role = 'ADMIN' AND p.name = 'releases.view'
       ) AS admin_can_view,
       EXISTS (
         SELECT 1 FROM role_permissions rp
         JOIN permissions p ON p.id = rp.permission_id
         WHERE rp.role = 'ARTIST' AND p.name = 'releases.view'
       ) AS artist_can_view`,
  );
  assert.equal(permissions.rows[0].admin_can_view, true, "ADMIN debe tener releases.view.");
  assert.equal(permissions.rows[0].artist_can_view, false, "ARTIST no debe tener releases.view.");

  const adminSession = await createSession(admin, ["releases.view"]);
  const artistSession = await createSession(artist, []);
  sessionIds.push(adminSession.sessionId, artistSession.sessionId);

  const adminResponse = await request("/api/admin/releases", "GET", adminSession.token);
  assert.equal(adminResponse.status, 200, "ADMIN con releases.view debe recibir 200.");
  const adminBody = await adminResponse.json();
  assert.ok(Array.isArray(adminBody.releases), "La respuesta administrativa debe incluir releases como lista.");

  const artistEndpoints = [
    ["GET", "/api/admin/releases"],
    ["GET", "/api/admin/releases/not-a-release"],
    ["PATCH", "/api/admin/releases/not-a-release"],
    ["GET", "/api/admin/releases/not-a-release/tracks"],
    ["PATCH", "/api/admin/releases/not-a-release/tracks/not-a-track"],
    ["DELETE", "/api/admin/releases/not-a-release/tracks/not-a-track"],
    ["POST", "/api/admin/releases/not-a-release/archive"],
  ];
  for (const [method, path] of artistEndpoints) {
    const response = await request(path, method, artistSession.token, {});
    assert.equal(response.status, 403, `${method} ${path} debe rechazar ARTIST con 403.`);
  }

  console.log(`RBAC releases OK: ADMIN 200, ARTIST ${artistEndpoints.length} endpoints 403.`);
} finally {
  if (sessionIds.length) {
    await pool.query("DELETE FROM sessions WHERE id = ANY($1::uuid[])", [sessionIds]);
  }
  await pool.end();
  if (startedServer && server) {
    try {
      process.kill(-server.pid, "SIGTERM");
    } catch {
      server.kill("SIGTERM");
    }
  }
}