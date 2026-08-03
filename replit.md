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
