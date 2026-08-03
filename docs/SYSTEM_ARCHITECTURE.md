# SYSTEM_ARCHITECTURE.md

> Arquitectura oficial de NP Music Group V2.
> Toda implementación futura debe respetar esta estructura.
> Si existe un conflicto entre una implementación y este documento, **prevalece este documento**.

---

## Índice

1. [Arquitectura General](#1-arquitectura-general)
2. [Frontend](#2-frontend)
3. [Backend](#3-backend)
4. [Base de Datos](#4-base-de-datos)
5. [API](#5-api)
6. [Autenticación](#6-autenticación)
7. [Sistema de Roles](#7-sistema-de-roles)
8. [Dashboard y Módulos](#8-dashboard-y-módulos)
9. [Componentes](#9-componentes)
10. [Servicios](#10-servicios)
11. [Estados](#11-estados)
12. [Tiempo Real](#12-tiempo-real)
13. [Auditoría](#13-auditoría)
14. [Escalabilidad](#14-escalabilidad)
15. [Objetivo Final](#15-objetivo-final)

---

## 1. Arquitectura General

La plataforma está dividida en cuatro capas principales con responsabilidades claramente separadas:

```
┌─────────────────────────────────────────────┐
│                  FRONTEND                   │
│         Next.js 15 — App Router             │
│   Interfaz · Navegación · Componentes       │
└─────────────────┬───────────────────────────┘
                  │ API (HTTP / Server Actions)
┌─────────────────▼───────────────────────────┐
│                  BACKEND                    │
│       Autenticación · Autorización          │
│       Validaciones · Reglas de negocio      │
└─────────────────┬───────────────────────────┘
                  │ Queries / ORM
┌─────────────────▼───────────────────────────┐
│               BASE DE DATOS                 │
│            Neon PostgreSQL                  │
└─────────────────────────────────────────────┘
         ┌────────────────────────┐
         │   SERVICIOS COMPARTIDOS│
         │  Auth · Storage · Real │
         │  Time · Audit · Email  │
         └────────────────────────┘
```

| Capa | Responsabilidad |
|---|---|
| Frontend | Interfaz, navegación, componentes, UX |
| Backend | Autenticación, autorización, lógica de negocio |
| Base de Datos | Persistencia oficial de todos los datos |
| Servicios Compartidos | Auth, almacenamiento, tiempo real, auditoría |

---

## 2. Frontend

**Tecnología:** Next.js 15 con App Router, TypeScript, Tailwind CSS v4.

### Responsabilidades

- Interfaz de usuario y navegación.
- Composición de componentes reutilizables.
- Validaciones visuales (no de seguridad).
- Experiencia de usuario y estados de carga/error/vacío.

### Restricciones

- **Nunca** contener lógica de negocio compleja.
- **Nunca** acceder directamente a la base de datos.
- Toda comunicación con datos debe realizarse mediante la API o Server Actions.

### Estructura de carpetas

```
src/
  app/              # Rutas y layouts (Next.js App Router)
  components/
    ui/             # Primitivos reutilizables (Button, Card, Badge…)
    layout/         # Navbar, Footer
    sections/       # Secciones del landing
    dashboard/      # Módulos del dashboard
  hooks/            # Hooks personalizados
  services/         # Clientes de API (nunca HTTP directo en componentes)
  api/              # Utilidades de comunicación con el backend
  types/            # Tipos TypeScript compartidos
  utils/            # Funciones utilitarias puras
public/             # Assets estáticos
docs/               # Documentación oficial del proyecto
```

---

## 3. Backend

**Tecnología:** Next.js API Routes / Server Actions.

### Responsabilidades

- Autenticación y gestión de sesiones.
- Autorización y verificación de permisos por rol.
- Validación de datos de entrada.
- Aplicación de reglas de negocio.
- Comunicación exclusiva con Neon.

### Restricciones

- Todo dato persistente debe pasar por el backend — nunca acceder a Neon desde el cliente.
- Las validaciones de seguridad deben ejecutarse siempre en el servidor, no solo en el cliente.

---

## 4. Base de Datos

**Motor oficial:** Neon PostgreSQL.

### Reglas

- Neon es la **única** fuente de verdad para información persistente.
- No utilizar `localStorage`, `sessionStorage` ni variables en memoria para datos críticos.
- Toda modificación al esquema debe documentarse en [`DATABASE_PLAN.md`](./DATABASE_PLAN.md) antes de implementarse.
- No mantener información duplicada entre tablas.

---

## 5. API

### Principios

- Toda comunicación entre frontend y backend se realiza mediante la API interna.
- **Nunca** acceder directamente a Neon desde el frontend.
- Las llamadas HTTP deben concentrarse en la capa de servicios (`src/services/`), nunca dispersarse en componentes visuales.

### Convenciones

- Rutas en `src/app/api/` para endpoints REST.
- Server Actions para operaciones de formulario y mutaciones directas.
- Formato de respuesta estándar definido en [`API_SPECIFICATION.md`](./API_SPECIFICATION.md).

---

## 6. Autenticación

- Toda autenticación debe centralizarse en un **único módulo**.
- El módulo de autenticación debe poder reemplazarse o ampliarse sin modificar el resto del proyecto.
- Las sesiones deben gestionarse de forma segura en el servidor.
- Ninguna ruta protegida debe ser accesible sin verificación válida de sesión.

---

## 7. Sistema de Roles

Todo módulo debe consultar permisos antes de permitir cualquier acción.

| Rol | Nivel | Descripción |
|---|---|---|
| `SUPER_ADMIN` | 1 | Acceso total al sistema sin restricciones. |
| `ADMIN` | 2 | Administración general de la plataforma. |
| `DISTRIBUTION_MANAGER` | 3 | Gestión de distribución y lanzamientos. |
| `MANAGER` | 4 | Gestión de artistas asignados. |
| `ARTIST` | 5 | Acceso a su propio perfil y contenido. |
| `VIEWER` | 6 | Solo lectura. Sin capacidad de modificación. |

- **No crear nuevos roles sin autorización explícita.**
- La verificación de permisos debe realizarse siempre en el backend, no solo en el frontend.

---

## 8. Dashboard y Módulos

- Cada sección del dashboard debe funcionar como un **módulo independiente**.
- Los módulos no deben depender entre sí innecesariamente.
- Cada módulo tiene su propia ruta, sus propios servicios y sus propios tipos.
- Un módulo que falla no debe romper los demás.

### Módulos planificados

- Central (overview)
- Artistas
- Lanzamientos
- Distribución
- Ingresos
- Analíticas
- Contratos
- Mensajería
- Invitaciones
- Permisos
- Actividad

---

## 9. Componentes

- Todos los componentes deben ser **reutilizables**.
- Nunca duplicar un componente — si se necesita una variante, usar props.
- Los componentes de `src/components/ui/` son los únicos primitivos permitidos. No crear alternativas paralelas.
- Un componente no debe conocer detalles de negocio — eso pertenece al módulo que lo consume.

---

## 10. Servicios

- Toda comunicación con la API debe concentrarse en `src/services/`.
- **No realizar llamadas HTTP directamente desde componentes visuales.**
- Cada módulo tendrá su propio servicio (ej: `artistService.ts`, `releaseService.ts`).
- Los servicios son la única capa que conoce las rutas de API.

---

## 11. Estados

Cada módulo debe manejar correctamente los cuatro estados posibles:

| Estado | Comportamiento esperado |
|---|---|
| **Carga** | Indicador visual de progreso. |
| **Éxito** | Mostrar datos reales provenientes de Neon. |
| **Error** | Mensaje específico con contexto. Nunca silencioso. |
| **Vacío** | Estado vacío profesional (ver `DESIGN_BRIEF.md`). |

**Nunca mostrar errores sin contexto ni suprimir errores silenciosamente.**

---

## 12. Tiempo Real

- Las funcionalidades en tiempo real deben implementarse en una **capa independiente**.
- No mezclar lógica de tiempo real con lógica de presentación.
- La capa de tiempo real no debe bloquear la carga inicial de ningún módulo.

---

## 13. Auditoría

- Toda acción importante del sistema debe poder registrarse (quién, qué, cuándo).
- La auditoría debe ser un módulo **independiente** que no afecta el flujo principal.
- Las acciones auditables incluyen: cambios de permisos, contratos, lanzamientos, ingresos y administración de artistas.

---

## 14. Escalabilidad

- La arquitectura debe permitir agregar nuevos módulos **sin modificar los existentes**.
- Nuevas integraciones externas deben añadirse como servicios independientes.
- El esquema de base de datos debe diseñarse para crecer sin migraciones destructivas.
- Los tipos TypeScript compartidos deben mantenerse en `src/types/` para evitar inconsistencias.

---

## 15. Objetivo Final

Construir una plataforma profesional capaz de crecer durante años sin necesidad de rehacer su arquitectura.

Cada capa tiene responsabilidades claras. Cada módulo es independiente. Cada decisión técnica prioriza la estabilidad y el mantenimiento a largo plazo sobre la velocidad de implementación a corto plazo.
