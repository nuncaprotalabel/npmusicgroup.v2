# DATABASE_PLAN.md

> Modelo de datos oficial de NP Music Group V2 sobre Neon (PostgreSQL).
> Toda modificación al esquema debe documentarse aquí antes de implementarse.

---

## 1. Motor de base de datos

**Motor:** PostgreSQL (Replit built-in / Neon compatible)
**ORM/Driver:** `pg` (Pool de conexiones, queries parametrizados)
**Conexión:** Variable de entorno `DATABASE_URL`

---

## 2. Convenciones de nomenclatura

| Elemento          | Convención                         | Ejemplo              |
|-------------------|------------------------------------|----------------------|
| Tablas            | `snake_case`, plural               | `audit_log`          |
| Columnas          | `snake_case`                       | `created_at`         |
| PKs               | `id UUID DEFAULT gen_random_uuid()`| `id UUID PRIMARY KEY`|
| FKs               | `{tabla_ref}_id`                   | `user_id`            |
| Índices           | `idx_{tabla}_{columna}`            | `idx_users_role`     |
| Tipos ENUM        | `{nombre}_tipo` o nombre directo   | `user_role`          |
| Timestamps        | `TIMESTAMPTZ DEFAULT NOW()`        | `created_at`         |

---

## 3. Entidades principales

### 3.1 `users`

Almacena todos los usuarios del sistema.

| Columna        | Tipo           | Restricciones                                | Descripción                      |
|----------------|----------------|----------------------------------------------|----------------------------------|
| `id`           | UUID           | PK, DEFAULT gen_random_uuid()                | Identificador único              |
| `username`     | VARCHAR(50)    | UNIQUE NOT NULL, CHECK(regex alfanumérico)   | Nombre de usuario de acceso      |
| `email`        | VARCHAR(255)   | UNIQUE, NULLABLE                             | Correo electrónico               |
| `password_hash`| VARCHAR(255)   | NOT NULL                                     | Hash bcrypt (12 rondas)          |
| `role`         | user_role ENUM | NOT NULL DEFAULT 'VIEWER'                    | Rol del usuario                  |
| `is_active`    | BOOLEAN        | DEFAULT true                                 | Estado de la cuenta              |
| `created_at`   | TIMESTAMPTZ    | DEFAULT NOW()                                | Fecha de creación                |
| `updated_at`   | TIMESTAMPTZ    | DEFAULT NOW(), auto-trigger                  | Última modificación              |
| `last_login_at`| TIMESTAMPTZ    | NULLABLE                                     | Último inicio de sesión          |
| `created_by`   | UUID           | FK → users(id) ON DELETE SET NULL, NULLABLE  | Usuario que lo creó              |

### 3.2 `permissions`

Catálogo de permisos disponibles en el sistema.

| Columna       | Tipo         | Restricciones       | Descripción                    |
|---------------|--------------|---------------------|--------------------------------|
| `id`          | SERIAL       | PK                  | Identificador numérico         |
| `name`        | VARCHAR(100) | UNIQUE NOT NULL     | Clave del permiso (ej: users.create) |
| `description` | TEXT         | NULLABLE            | Descripción legible            |
| `module`      | VARCHAR(50)  | NOT NULL            | Módulo al que pertenece        |
| `created_at`  | TIMESTAMPTZ  | DEFAULT NOW()       | Fecha de creación              |

### 3.3 `role_permissions`

Tabla de relación N:M entre roles y permisos.

| Columna         | Tipo      | Restricciones                               | Descripción       |
|-----------------|-----------|---------------------------------------------|-------------------|
| `role`          | user_role | NOT NULL, PK compuesto                      | Rol del usuario   |
| `permission_id` | INTEGER   | NOT NULL, FK → permissions(id) ON DELETE CASCADE, PK compuesto | Permiso asignado |

### 3.4 `solicitudes`

Solicitudes públicas de ingreso recibidas desde `/aplicar`.

| Columna              | Tipo         | Restricciones                                      | Descripción                         |
|----------------------|--------------|----------------------------------------------------|-------------------------------------|
| `id`                 | UUID         | PK, DEFAULT gen_random_uuid()                      | Identificador único                 |
| `nombre_artistico`   | VARCHAR(150) | NOT NULL                                           | Nombre artístico                    |
| `email`              | VARCHAR(255) | NOT NULL                                           | Correo de contacto                  |
| `pais`               | VARCHAR(100) | NOT NULL                                           | País                                |
| `genero_principal`   | VARCHAR(100) | NOT NULL                                           | Género musical principal            |
| `enlace_principal`   | TEXT         | NOT NULL                                           | Link musical principal              |
| `instagram`          | VARCHAR(255) | NULLABLE                                           | Usuario o enlace de Instagram      |
| `tiktok`             | VARCHAR(255) | NULLABLE                                           | Usuario o enlace de TikTok          |
| `mensaje`            | TEXT         | NULLABLE                                           | Mensaje de presentación             |
| `estado`             | VARCHAR(20)  | DEFAULT 'PENDIENTE', CHECK de estados válidos      | PENDIENTE / REVISANDO / APROBADA / RECHAZADA |
| `created_at`         | TIMESTAMPTZ  | DEFAULT NOW()                                      | Fecha de solicitud                  |
| `updated_at`         | TIMESTAMPTZ  | DEFAULT NOW()                                      | Última actualización                |

El módulo administrativo solo permite las transiciones `PENDIENTE → APROBADA`
y `PENDIENTE → RECHAZADA`.

### 3.5 `sessions`

Registro de sesiones para auditoría y seguimiento.

| Columna      | Tipo        | Restricciones                            | Descripción                  |
|--------------|-------------|------------------------------------------|------------------------------|
| `id`         | UUID        | PK, DEFAULT gen_random_uuid()            | Identificador de sesión      |
| `user_id`    | UUID        | NOT NULL, FK → users(id) ON DELETE CASCADE | Usuario dueño de la sesión |
| `ip_address` | VARCHAR(45) | NULLABLE                                 | IP del cliente               |
| `user_agent` | TEXT        | NULLABLE                                 | User-agent del navegador     |
| `expires_at` | TIMESTAMPTZ | NOT NULL                                 | Vencimiento de la sesión     |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW()                            | Inicio de la sesión          |
| `ended_at`   | TIMESTAMPTZ | NULLABLE                                 | Fin de la sesión (logout)    |
| `is_active`  | BOOLEAN     | DEFAULT true                             | Sesión activa                |

### 3.6 `invitations`

Invitaciones para nuevos usuarios.

| Columna      | Tipo        | Restricciones                               | Descripción                    |
|--------------|-------------|---------------------------------------------|--------------------------------|
| `id`         | UUID        | PK, DEFAULT gen_random_uuid()               | Identificador único            |
| `email`      | VARCHAR(255)| NOT NULL                                    | Email del invitado             |
| `role`       | user_role   | NOT NULL                                    | Rol asignado al aceptar        |
| `token`      | VARCHAR(255)| UNIQUE NOT NULL                             | Token de invitación (único)    |
| `invited_by` | UUID        | FK → users(id) ON DELETE SET NULL, NULLABLE | Quien envió la invitación      |
| `expires_at` | TIMESTAMPTZ | NOT NULL                                    | Vencimiento de la invitación   |
| `accepted_at`| TIMESTAMPTZ | NULLABLE                                    | Fecha de aceptación            |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW()                               | Fecha de creación              |

### 3.7 `audit_log`

Log inmutable de eventos importantes del sistema.

| Columna       | Tipo         | Restricciones                               | Descripción                     |
|---------------|--------------|---------------------------------------------|---------------------------------|
| `id`          | BIGSERIAL    | PK                                          | Identificador secuencial        |
| `user_id`     | UUID         | FK → users(id) ON DELETE SET NULL, NULLABLE | Usuario que realizó la acción   |
| `username`    | VARCHAR(50)  | NULLABLE                                    | Username en el momento del log  |
| `action`      | VARCHAR(100) | NOT NULL                                    | Código de la acción (ej: LOGIN_SUCCESS) |
| `entity_type` | VARCHAR(50)  | NULLABLE                                    | Tipo de entidad afectada        |
| `entity_id`   | VARCHAR(255) | NULLABLE                                    | ID de la entidad afectada       |
| `metadata`    | JSONB        | NULLABLE                                    | Datos adicionales en JSON       |
| `ip_address`  | VARCHAR(45)  | NULLABLE                                    | IP del cliente                  |
| `user_agent`  | TEXT         | NULLABLE                                    | User-agent                      |
| `severity`    | VARCHAR(20)  | DEFAULT 'INFO'                              | INFO / WARN / ERROR / CRITICAL  |
| `created_at`  | TIMESTAMPTZ  | DEFAULT NOW()                               | Timestamp del evento            |

---

## 4. ENUM types

### `user_role`

```sql
CREATE TYPE user_role AS ENUM (
  'SUPER_ADMIN', 'ADMIN', 'DISTRIBUTION_MANAGER',
  'MANAGER', 'ARTIST', 'VIEWER'
);
```

---

## 5. Relaciones y claves foráneas

```
users ──< sessions        (user_id → users.id CASCADE DELETE)
users ──< invitations     (invited_by → users.id SET NULL)
users ──< audit_log       (user_id → users.id SET NULL)
users ──< users           (created_by → users.id SET NULL)
permissions ──< role_permissions (permission_id → permissions.id CASCADE DELETE)
```

---

## 6. Índices

| Índice                    | Tabla            | Columna(s)              | Tipo    |
|---------------------------|------------------|-------------------------|---------|
| `idx_users_role`          | users            | role                    | BTREE   |
| `idx_users_is_active`     | users            | is_active               | BTREE   |
| `idx_sessions_user_id`    | sessions         | user_id                 | BTREE   |
| `idx_sessions_active`     | sessions         | is_active, expires_at   | BTREE   |
| `idx_audit_user_id`       | audit_log        | user_id                 | BTREE   |
| `idx_audit_action`        | audit_log        | action                  | BTREE   |
| `idx_audit_created_at`    | audit_log        | created_at DESC         | BTREE   |
| `idx_invitations_token`   | invitations      | token                   | BTREE   |

---

## 7. Triggers

### `users_updated_at`

Actualiza automáticamente `updated_at` en cada modificación de un registro en `users`.

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

---

## 8. Datos iniciales (seed)

### Usuario SUPER_ADMIN

| Campo    | Valor         |
|----------|---------------|
| username | `npmusicadmin`|
| role     | `SUPER_ADMIN` |
| is_active| `true`        |

**Contraseña inicial:** Se configura en el proceso de instalación. Hash bcrypt 12 rondas.

### Permisos base

33 permisos distribuidos en 12 módulos:
`system`, `users`, `accounts`, `applications`, `artists`, `releases`, `distribution`, `revenue`, `contracts`, `analytics`, `invitations`, `audit`

### Estado de implementación de Fase 2.1

Para autenticación y RBAC se aplican las tablas `users`, `sessions`, `audit_log`,
`permissions` y `role_permissions`.
El alta del primer `SUPER_ADMIN` se realiza con `npm run auth:bootstrap`, usando
`SUPER_ADMIN_EMAIL`, `SUPER_ADMIN_PASSWORD` y opcionalmente `SUPER_ADMIN_USERNAME` como secretos
del entorno. El proceso es idempotente y no sobrescribe cuentas existentes.

---

## 9. Reglas de integridad

- Toda información persistente **debe** almacenarse en esta base de datos.
- No se permite `localStorage`, `sessionStorage` ni variables en memoria para datos críticos.
- Las contraseñas **nunca** se almacenan en texto plano — siempre bcrypt con ≥12 rondas.
- Los logs de auditoría son **inmutables** — no se permiten UPDATE ni DELETE sobre `audit_log`.
- Los `id` de tipo UUID se generan con `gen_random_uuid()` en PostgreSQL, nunca en la aplicación.
- Toda modificación al esquema debe actualizarse en este documento antes de aplicarse.
