# CHANGELOG.md

> Historial oficial de cambios de NP Music Group V2. Registra versiones, novedades, correcciones y cambios importantes.

---

## Formato de entrada

```
## [vX.Y.Z] — YYYY-MM-DD
### Added
### Changed
### Fixed
### Removed
```

---

## Historial

## [v0.2.0] — 2026-08-03

### Added
- Sistema de internacionalización (i18n) propio sin dependencias externas
  - `src/i18n/translations.ts` — diccionario completo ES/EN
  - `src/i18n/LanguageContext.tsx` — Context API con persistencia en localStorage
  - `src/i18n/useTranslation.ts` — hook de acceso a traducciones
  - `src/app/Providers.tsx` — wrapper de providers para el layout
- Selector de idioma (`LanguageSelector`) visible en Navbar (desktop y móvil)
- Detección automática del idioma del navegador al primer acceso
- Componente `Input` — campo de formulario con soporte de etiqueta, error, hint e iconos
- Componente `LoadingState` — indicador de carga reutilizable (sm, md, lg)
- Componente `LanguageSelector` — botón de cambio ES/EN

### Changed
- `Stats.tsx` — eliminados todos los datos ficticios (+150, +2.000, +10M, 99.9%). Reemplazado por sección de capacidades reales de la plataforma
- `Hero.tsx` — eliminado bloque de prueba social ficticia (+2.000 artistas activos)
- `FinalCTA.tsx` — eliminada referencia a "miles de artistas" (dato ficticio). Reemplazado por copy neutral y honesto
- `Services.tsx` — eliminado número ficticio "150 plataformas" de la descripción
- `DashboardPreviewSection.tsx` — corregido orden en móvil (copy primero, dashboard después)
- `Navbar.tsx` — integrado selector de idioma; traducciones activas
- `Footer.tsx` — integradas traducciones; secciones y enlaces dinámicos por idioma
- Todos los componentes de secciones convertidos a client components para soporte i18n
- Todos los textos del dashboard (`DashboardSidebar`, `ActivityFeed`, `RevenueChart`) traducibles
- `aria-label` y `aria-hidden` añadidos a elementos decorativos para mejorar accesibilidad

### Fixed
- Orden de secciones en `DashboardPreviewSection` mobile: copy ahora aparece primero
- Scroll horizontal eliminado en `PlatformsBar` con `flex-wrap`

### Removed
- Bloque de prueba social ficticia del Hero (avatares generados + contador de artistas)
- Estadísticas inventadas de la sección Stats (streams, uptime, artistas activos)
- Número específico de plataformas en descripción de Services

---

## [v0.1.0] — 2026-08-03

### Added
- Proyecto inicial importado desde GitHub
- Landing page completa: Navbar, Hero, PlatformsBar, Services, HowItWorks, DashboardPreviewSection, Stats, FinalCTA, Footer
- Componentes de dashboard: DashboardPanel, DashboardSidebar, StatsCard, RevenueChart, ActivityFeed
- Componentes UI base: Button, Card, Badge, EmptyState
- Sistema de diseño: tokens de color, tipografía Inter, estados vacíos profesionales
- Carpeta `/docs` con documentación oficial: AGENT_CONTEXT.md, PROJECT_RULES.md, DESIGN_BRIEF.md, SYSTEM_ARCHITECTURE.md, ROADMAP.md, DATABASE_PLAN.md, API_SPECIFICATION.md, COMPONENT_GUIDE.md, CHANGELOG.md
