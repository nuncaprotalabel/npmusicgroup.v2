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

Invitaciones seguras relacionadas con solicitudes aprobadas. La tabla existente
se amplió sin crear una tabla duplicada; conserva columnas legadas para
compatibilidad con el flujo de cuentas.

| Columna      | Tipo        | Restricciones                               | Descripción                    |
|--------------|-------------|---------------------------------------------|--------------------------------|
| `id`         | UUID        | PK, DEFAULT gen_random_uuid()               | Identificador único            |
| `solicitud_id`| UUID       | FK → solicitudes(id), NULLABLE              | Solicitud aprobada relacionada |
| `email`      | VARCHAR(255)| NOT NULL                                    | Email del invitado             |
| `role`       | user_role   | NULLABLE, legado                            | Rol asignado al aceptar        |
| `token_hash` | VARCHAR(128)| UNIQUE cuando existe, NULLABLE              | Hash del token seguro           |
| `token`      | VARCHAR(255)| UNIQUE, NULLABLE, legado                    | Columna de compatibilidad       |
| `invited_by` | UUID        | FK → users(id) ON DELETE SET NULL, NULLABLE | Quien envió la invitación      |
| `expires_at` | TIMESTAMPTZ | NOT NULL                                    | Vencimiento de la invitación   |
| `status`     | VARCHAR(20) | NOT NULL, CHECK de estados válidos           | PENDIENTE / UTILIZADA / EXPIRADA / REVOCADA |
| `created_by` | UUID        | FK → users(id) ON DELETE SET NULL, NULLABLE | Usuario administrativo creador |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW()                               | Última actualización            |
| `accepted_at`| TIMESTAMPTZ | NULLABLE                                    | Fecha de aceptación            |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW()                               | Fecha de creación              |

Las invitaciones vinculadas a solicitudes nuevas guardan únicamente
`token_hash`; el token plano existe solo al generar el enlace y no se registra
en `audit_log`.

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

### 3.8 `contracts`

Contratos de artista en borrador o pendientes de firma, relacionados con una
solicitud aprobada y una invitación vigente.

| Columna              | Tipo          | Restricciones                                      | Descripción                         |
|----------------------|---------------|----------------------------------------------------|-------------------------------------|
| `id`                 | UUID          | PK, DEFAULT gen_random_uuid()                      | Identificador único                 |
| `solicitud_id`       | UUID          | FK → solicitudes(id), NOT NULL                     | Solicitud relacionada               |
| `invitation_id`      | UUID          | FK → invitations(id), NOT NULL                     | Invitación relacionada              |
| `type`               | VARCHAR(50)   | NOT NULL, CHECK `CONTRATO_ARTISTA`                 | Tipo de contrato                    |
| `title`              | VARCHAR(255)  | NOT NULL                                           | Título editable del contrato       |
| `version`            | VARCHAR(20)   | NOT NULL                                           | Versión persistente                 |
| `content`            | TEXT          | NOT NULL                                           | Contenido editable                  |
| `sections`           | JSONB         | NOT NULL                                           | Secciones estructuradas             |
| `status`             | VARCHAR(20)   | NOT NULL, CHECK de estados contractuales           | Estado del contrato                 |
| `artist_percentage`  | NUMERIC(5,2)  | NOT NULL, CHECK 85.00                              | Porcentaje del artista              |
| `company_percentage` | NUMERIC(5,2)  | NOT NULL, CHECK 15.00                              | Porcentaje de NP Music Group        |
| `created_by`         | UUID          | FK → users(id) ON DELETE SET NULL, NULLABLE        | Usuario creador                     |
| `created_at`         | TIMESTAMPTZ   | DEFAULT NOW()                                      | Fecha de creación                   |
| `updated_at`         | TIMESTAMPTZ   | DEFAULT NOW()                                      | Última actualización                |

La base de datos impide porcentajes distintos de 85% para el artista y 15%
para NP Music Group. Solo puede existir un contrato activo
(`BORRADOR` o `PENDIENTE_FIRMA`) por invitación.

### 3.9 `contract_signatures`

Registro mínimo de aceptación interna del contrato. No almacena credenciales ni
tokens. La combinación de contrato e invitación es única para impedir una
segunda aceptación.

| Columna            | Tipo          | Restricciones                                  | Descripción                    |
|--------------------|---------------|------------------------------------------------|--------------------------------|
| `id`               | UUID          | PK, DEFAULT gen_random_uuid()                  | Identificador de la aceptación |
| `contract_id`      | UUID          | FK → contracts(id), UNIQUE, NOT NULL           | Contrato aceptado              |
| `invitation_id`    | UUID          | FK → invitations(id), UNIQUE, NOT NULL         | Invitación utilizada           |
| `contract_version` | VARCHAR(20)   | NOT NULL                                       | Versión exacta firmada         |
| `accepted_at`      | TIMESTAMPTZ   | NOT NULL, DEFAULT NOW()                        | Momento de aceptación          |
| `method`           | VARCHAR(50)   | `INTERNAL_ACCEPTANCE`                          | Método interno auditable       |
| `status`           | VARCHAR(20)   | `FIRMADO`                                      | Estado de la aceptación        |
| `ip_address`       | INET          | NULLABLE                                       | IP válida, si está disponible  |
| `user_agent`       | TEXT          | NULLABLE                                       | Navegador, si está disponible  |
| `created_at`       | TIMESTAMPTZ   | DEFAULT NOW()                                  | Fecha de registro              |

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
solicitudes ──< invitations (solicitud_id → solicitudes.id CASCADE DELETE)
solicitudes ──< contracts   (solicitud_id → solicitudes.id RESTRICT DELETE)
invitations ──< contracts   (invitation_id → invitations.id RESTRICT DELETE)
users ──< audit_log       (user_id → users.id SET NULL)
users ──< contracts        (created_by → users.id SET NULL)
contracts ──< contract_signatures (contract_id → contracts.id RESTRICT DELETE)
invitations ──< contract_signatures (invitation_id → invitations.id RESTRICT DELETE)
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
| `idx_invitations_token_hash` | invitations    | token_hash              | UNIQUE parcial |
| `idx_contracts_active_invitation` | contracts | invitation_id       | UNIQUE parcial |
| `idx_contracts_status`    | contracts        | status                  | BTREE   |
| `idx_contracts_solicitud_id` | contracts      | solicitud_id             | BTREE   |
| `idx_contracts_created_at` | contracts       | created_at DESC          | BTREE   |
| `idx_contract_signatures_accepted_at` | contract_signatures | accepted_at DESC | BTREE |

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
