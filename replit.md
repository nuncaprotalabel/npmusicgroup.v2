# NP Music Group V2

Plataforma SaaS todo-en-uno para artistas musicales independientes.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Iconos:** Lucide React
- **Runtime:** Node.js 20
- **Tipografía:** Plus Jakarta Sans (Google Fonts) — seleccionada por su estética SaaS premium, legibilidad técnica y carácter empresarial. Reemplaza a Inter.

## Cómo correr

```bash
npm run dev     # Desarrollo en puerto 5000
npm run build   # Build de producción
npm run start   # Producción en puerto 5000
```

El workflow "Start application" arranca automáticamente con `npm run dev`.

## Arquitectura

```
src/
  app/             # Next.js App Router (layout, page, globals.css)
  components/
    ui/            # Componentes base: Button, Card, Badge, EmptyState
    layout/        # Navbar, Footer
    sections/      # Secciones del landing: Hero, Services, HowItWorks, etc.
    dashboard/     # Componentes del dashboard: StatsCard, RevenueChart, ActivityFeed, Sidebar, Panel
  hooks/           # Hooks reutilizables (vacío, listo para crecer)
  services/        # Servicios de negocio (vacío, listo para crecer)
  api/             # Clientes API (vacío, listo para crecer)
  types/           # Tipos TypeScript compartidos
  utils/           # Utilidades: cn() para clases Tailwind
  styles/          # Estilos globales adicionales (vacío, listo para crecer)
public/
  logo.png         # Logo oficial NP Music Group (Nunca Prota turntable)
```

## Branding

| Token       | Valor     |
|-------------|-----------|
| Negro       | `#000000` |
| Blanco      | `#FFFFFF` |
| Amarillo    | `#F5C518` |
| Rojo        | `#EF4444` |
| Superficie  | `#0A0A0A` |
| Borde       | `#1E1E1E` |

## Sprint 3 — Navegación y Dashboard (completado)

### Implementado

**Login**
- Botón "Iniciar sesión" en el Navbar (landing) — habilitado, navega a `/login`
- Formulario de login real conectado al backend (`POST /api/auth/login`)
- Redirección automática al dashboard tras login exitoso
- Errores de autenticación mostrados correctamente
- Redirect por defecto: `/dashboard`

**Logout**
- Botón "Cerrar sesión" en el header del dashboard
- Llama a `POST /api/auth/logout` y redirige a la landing (`/`)
- Estado de carga visual durante el proceso

**Dashboard — Estructura base**
- Layout: `src/app/dashboard/layout.tsx` — sidebar + header + área principal
- Sidebar fija en desktop, drawer lateral en mobile
- Header con breadcrumb, perfil de usuario (iniciales), selector de idioma y logout
- Protección doble: middleware + verificación server-side en layout

**Sidebar — Navegación**
- Rutas: Central, Artistas, Solicitudes, Invitaciones, Contratos, Lanzamientos (+ sub-ruta Recibidos/Pendientes), Analíticas, Ingresos, Mensajes, Cuentas, Permisos, Configuración
- NP Control visible solo para `SUPER_ADMIN`
- Ítem activo resaltado en amarillo institucional

**Módulos**
- Central: muestra stats reales del sistema (para SUPER_ADMIN/ADMIN) o estado vacío profesional
- Todos los módulos no implementados: muestran pantalla clara "Módulo en desarrollo"
- Nunca pantalla rota — siempre responde correctamente

**Idioma**
- Selector ES/EN funcional en landing y dashboard
- Preferencia guardada en `localStorage` y persistida entre sesiones

**Rutas protegidas**
- `/dashboard/*`: requiere cualquier sesión activa
- `/np-control/*`: requiere rol `SUPER_ADMIN`
- Middleware en Edge runtime, verificación server-side en layouts

### Archivos clave (Sprint 3)
- `src/app/dashboard/layout.tsx` — layout protegido del dashboard
- `src/app/dashboard/central/page.tsx` — vista general real
- `src/components/dashboard/DashboardSidebar.tsx` — navegación desktop
- `src/components/dashboard/DashboardMobileSidebar.tsx` — drawer móvil
- `src/components/dashboard/DashboardHeader.tsx` — header con perfil y logout
- `src/components/dashboard/DashboardHeaderWrapper.tsx` — gestión de estado mobile
- `src/components/dashboard/InDevelopment.tsx` — estado compartido para módulos pendientes
- `src/components/dashboard/DashboardPreviewSidebar.tsx` — sidebar decorativo para preview landing

### Requisito de entorno
Para que el login funcione, se requiere `DATABASE_URL` (conexión a Neon PostgreSQL).
Conectar la base de datos desde el panel de Replit o agregar la variable de entorno.

---

## Sprint 2 — Autenticación y Permisos (completado)

### Infraestructura implementada

**Base de datos (PostgreSQL)**
- Tablas: `users`, `permissions`, `role_permissions`, `sessions`, `invitations`, `audit_log`
- ENUM `user_role`: SUPER_ADMIN, ADMIN, DISTRIBUTION_MANAGER, MANAGER, ARTIST, VIEWER
- 29 permisos distribuidos en 9 módulos con asignación correcta por rol
- Trigger `updated_at` automático en `users`

**Autenticación**
- JWT firmado con SESSION_SECRET via `jose` (Edge-compatible)
- Cookies HTTP-only seguras (sameSite: lax, httpOnly: true)
- Sesión de 7 días, registro en DB de cada sesión
- Bcrypt 12 rondas para contraseñas

**Rutas**
- `POST /api/auth/login` — autenticación real contra Neon
- `POST /api/auth/logout` — cierre de sesión + borrado de cookie
- `GET /api/auth/me` — verificación de sesión activa
- `/login` — página pública de inicio de sesión
- `/np-control` — panel privado, solo SUPER_ADMIN

**Middleware**
- Protege `/np-control`, `/dashboard`, `/admin` en Edge runtime
- Verifica JWT antes de permitir acceso
- Redirige a `/login?from=...` si no autenticado
- Redirige a `/403` si rol insuficiente

**SUPER_ADMIN**
- Cuenta inicial creada mediante bootstrap seguro con secretos del entorno.
- El repositorio no contiene contraseñas ni credenciales iniciales.
- Bootstrap idempotente: no duplica una cuenta existente.

**Auditoría**
- Registra: LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT en `audit_log`
- Módulo independiente que no bloquea el flujo principal

**Archivos clave**
- `src/lib/db.ts` — pool de conexión PostgreSQL
- `src/lib/auth.ts` — JWT + session cookies
- `src/lib/password.ts` — bcrypt utilities
- `src/lib/permissions.ts` — rol/permiso constants
- `src/lib/audit.ts` — log de auditoría
- `src/middleware.ts` — protección de rutas
- `src/services/authService.ts` — cliente de la API de auth
- `src/components/np-control/` — componentes del panel
- `docs/DATABASE_PLAN.md` — esquema documentado

## Cambios recientes

- **Logo**: convertido a PNG con canal alpha (`logo-transparent.png`) — sin fondo negro.
- **i18n**: todos los textos del Hero usan claves de traducción (`t.hero.cta1`, `t.hero.cta2`, `t.hero.description`).
- **PlatformsBar**: reescrita como carrusel infinito CSS (`marquee` keyframe). Al hover, la animación se ralentiza de 32s → 90s. Borde-fade a los costados. Glow amarillo en cada plataforma al hover.
- **Services**: cards con `translate-y` + `box-shadow` amarillo suave en hover + icono `scale-110` + borde izquierdo amarillo.
- **HowItWorks**: línea conectora con gradiente amarillo. Íconos con `translate-y` + glow al hover.
- **Footer**: links con subrayado amarillo animado al hover. Redes sociales con glow amarillo.
- **CSS**: nuevos keyframes `marquee`, `fade-left`, `fade-right`, `counter-glow`, `border-glow`, `icon-float`. Clases `.carousel-track` y `.carousel-wrapper`.

## Secciones del landing

1. **Navbar** — sticky, con dropdown y menú móvil
2. **Hero** — headline + dashboard preview real
3. **PlatformsBar** — Spotify, Apple Music, YouTube, TikTok, Amazon Music, TIDAL
4. **Services** — 6 tarjetas de características
5. **HowItWorks** — 4 pasos con iconos
6. **DashboardPreviewSection** — panel real con estados vacíos profesionales
7. **Stats** — métricas + segunda barra de plataformas
8. **FinalCTA** — fondo amarillo con CTA
9. **Footer** — links, redes sociales, newsletter

## Dashboard (componentes reutilizables)

- `DashboardPanel` — contenedor principal
- `DashboardSidebar` — navegación lateral con todos los módulos
- `StatsCard` — tarjeta de métrica individual
- `RevenueChart` — gráfico SVG con estado vacío profesional
- `ActivityFeed` — feed de actividad reciente

## Estado de los botones

Todos los botones están presentes y funcionales en UX. Los que requieren autenticación o funcionalidad backend muestran `disabled` con `cursor-not-allowed`. Ningún botón hace una acción falsa.

## Fases futuras preparadas

La arquitectura soporta agregar sin refactor:
- Autenticación (Clerk/NextAuth)
- Base de datos Neon (PostgreSQL)
- Artistas, contratos, lanzamientos, splits
- Ingresos y analíticas en tiempo real
- Mensajería
- NP Control

## User preferences

- Idioma del proyecto: Español
- Branding estricto: negro, blanco, amarillo (#F5C518), rojo solo para errores
- Sin datos falsos — siempre estados vacíos profesionales
- Mobile-first (Android primero)
- Calidad sobre velocidad
- Antes de cualquier implementación: leer toda la documentación en /docs, especialmente PROJECT_RULES.md. Si hay conflicto entre una implementación y PROJECT_RULES.md, prevalece el documento.
