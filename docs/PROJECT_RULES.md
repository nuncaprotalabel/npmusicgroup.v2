# PROJECT_RULES.md

> Constitución de NP Music Group V2. Define las reglas obligatorias que gobiernan todas las decisiones de desarrollo.
> Si existe un conflicto entre una implementación y este documento, **prevalece este documento**.

---

## Índice

1. [Regla de Oro](#1-regla-de-oro)
2. [Filosofía del Producto](#2-filosofía-del-producto)
3. [Calidad](#3-calidad)
4. [Datos](#4-datos)
5. [Base de Datos](#5-base-de-datos)
6. [Roles y Permisos](#6-roles-y-permisos)
7. [Código](#7-código)
8. [Diseño](#8-diseño)
9. [Arquitectura](#9-arquitectura)
10. [Documentación](#10-documentación)
11. [Objetivo Final](#11-objetivo-final)

---

## 1. Regla de Oro

Ninguna función puede implementarse solo de forma visual.

Si aparece en la interfaz, debe:

- Funcionar realmente.
- Persistir en Neon cuando corresponda.
- Respetar el sistema de permisos.
- Estar conectada al backend.

Si una funcionalidad aún no está lista, debe permanecer **oculta** o mostrar claramente que está en desarrollo.

**Nunca crear botones, formularios o módulos sin funcionalidad real.**

---

## 2. Filosofía del Producto

NP Music Group V2 es una plataforma SaaS profesional para la administración de artistas y distribución musical.

| Lo que ES | Lo que NO ES |
|---|---|
| Software empresarial | Una página promocional |
| Plataforma de gestión real | Una plantilla |
| SaaS para artistas independientes | Una disquera tradicional |

Todas las decisiones deben reforzar la percepción de software empresarial.

---

## 3. Calidad

Priorizar siempre en este orden:

1. **Calidad** — el producto debe funcionar correctamente antes de crecer.
2. **Estabilidad** — sin regresiones ni comportamientos inesperados.
3. **Escalabilidad** — la arquitectura debe soportar crecimiento sin refactor mayor.
4. **Rendimiento** — tiempos de respuesta aceptables en todos los módulos.
5. **Mantenibilidad** — el código debe ser legible y modificable por cualquier desarrollador.

**Nunca implementar soluciones rápidas que comprometan la arquitectura.**

---

## 4. Datos

Está prohibido utilizar:

- Estadísticas falsas.
- Ingresos ficticios.
- Artistas de ejemplo.
- Usuarios ficticios.
- Actividad simulada.
- Gráficos inventados.

Toda la información visible debe provenir de **Neon** o mostrar un **estado vacío profesional**.

---

## 5. Base de Datos

- Toda la información persistente debe almacenarse en **Neon PostgreSQL**.
- No utilizar almacenamiento local (`localStorage`, `sessionStorage`, variables en memoria) para datos críticos.
- No mantener información duplicada entre tablas.
- Toda modificación al esquema debe documentarse en `DATABASE_PLAN.md`.

---

## 6. Roles y Permisos

Todos los módulos deben respetar el sistema de permisos. Los roles oficiales son:

| Rol | Descripción |
|---|---|
| `SUPER_ADMIN` | Acceso total al sistema. |
| `ADMIN` | Administración general de la plataforma. |
| `DISTRIBUTION_MANAGER` | Gestión de distribución y lanzamientos. |
| `MANAGER` | Gestión de artistas asignados. |
| `ARTIST` | Acceso a su propio perfil y contenido. |
| `VIEWER` | Acceso de solo lectura. |

**No crear nuevos roles sin autorización explícita.**

---

## 7. Código

### Mantener

- Componentes reutilizables.
- Código limpio y legible.
- Arquitectura modular.
- Funciones pequeñas con responsabilidad única.
- Nombres claros y descriptivos.

### Evitar

- Duplicación de lógica.
- Componentes con más de una responsabilidad.
- Efectos secundarios no declarados.
- Código comentado o archivos muertos en el repositorio.

---

## 8. Diseño

Toda decisión visual debe respetar [`DESIGN_BRIEF.md`](./DESIGN_BRIEF.md).

No se puede introducir un color, tipografía, espaciado o patrón de UI que contradiga ese documento.

---

## 9. Arquitectura

Toda decisión técnica debe respetar [`SYSTEM_ARCHITECTURE.md`](./SYSTEM_ARCHITECTURE.md).

No se puede añadir una capa, librería o patrón de integración que contradiga ese documento.

---

## 10. Documentación

Antes de implementar cualquier funcionalidad nueva:

1. Revisar todo el contenido de `/docs`.
2. Verificar que la implementación sea consistente con los documentos existentes.
3. Si la implementación requiere un cambio en la arquitectura o el diseño, actualizar primero el documento correspondiente.

---

## 11. Objetivo Final

Cada módulo nuevo debe sentirse como parte del mismo producto profesional.

- No deben existir diferencias de estilo entre módulos.
- No deben existir diferencias de comportamiento entre módulos equivalentes.
- Toda la plataforma debe transmitir **calidad, coherencia y profesionalismo**.
