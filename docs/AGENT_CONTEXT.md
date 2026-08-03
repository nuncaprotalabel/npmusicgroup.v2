# AGENT_CONTEXT.md

> Contexto general de NP Music Group V2. Este archivo debe leerse antes de cualquier implementación para entender la identidad, misión y restricciones del proyecto.

---

## Identidad

NP Music Group V2 es una **plataforma SaaS profesional para artistas independientes**.

| Lo que ES | Lo que NO ES |
|---|---|
| Software empresarial | Una página promocional |
| Plataforma de gestión real | Una plantilla |
| SaaS para artistas independientes | Una disquera tradicional |

Debe sentirse como un producto desarrollado por una empresa tecnológica especializada.

---

## Misión

Construir una plataforma moderna donde artistas, managers y administradores puedan gestionar toda su operación desde un único lugar.

---

## Objetivo

Crear un software completo para:

- Gestión de artistas
- Lanzamientos
- Contratos
- Splits
- Ingresos
- Analíticas
- Mensajería
- Permisos
- Administración

---

## Documentación Obligatoria

Antes de implementar cualquier funcionalidad, revisar:

| Documento | Contenido |
|---|---|
| [`PROJECT_RULES.md`](./PROJECT_RULES.md) | Reglas obligatorias de desarrollo |
| [`DESIGN_BRIEF.md`](./DESIGN_BRIEF.md) | Identidad visual y sistema de diseño |
| [`SYSTEM_ARCHITECTURE.md`](./SYSTEM_ARCHITECTURE.md) | Arquitectura técnica oficial |
| [`DATABASE_PLAN.md`](./DATABASE_PLAN.md) | Modelo de datos y esquema |
| [`ROADMAP.md`](./ROADMAP.md) | Fases de desarrollo |
| [`COMPONENT_GUIDE.md`](./COMPONENT_GUIDE.md) | Biblioteca de componentes |
| [`API_SPECIFICATION.md`](./API_SPECIFICATION.md) | Contratos de API |
| [`CHANGELOG.md`](./CHANGELOG.md) | Historial de cambios |

Todas las decisiones deben respetar esos documentos. Si existe conflicto entre una implementación y la documentación, **prevalece la documentación**.

---

## Restricciones

- **Nunca** generar datos falsos.
- **Nunca** crear usuarios demo.
- **Nunca** inventar estadísticas.
- **Nunca** mostrar funcionalidades que no existen.
- **Nunca** implementar botones sin funcionalidad real.
- **Nunca** romper la arquitectura definida en `SYSTEM_ARCHITECTURE.md`.

---

## Filosofía

Siempre priorizar en este orden:

1. **Calidad** — que funcione correctamente.
2. **Consistencia** — que se vea y se comporte igual en todos los módulos.
3. **Escalabilidad** — que pueda crecer sin refactor.
4. **Mantenibilidad** — que otro desarrollador pueda entenderlo.
5. **Experiencia de usuario** — que sea fácil y claro de usar.
6. **Código limpio** — sin duplicación ni complejidad innecesaria.

---

## Objetivo Final

Construir una plataforma que cualquier usuario perciba como **software profesional listo para producción**.
