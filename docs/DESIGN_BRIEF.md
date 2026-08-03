# DESIGN_BRIEF.md

> Identidad visual, experiencia de usuario y sistema de diseño oficial de NP Music Group V2.
> Todas las interfaces del proyecto deben respetar este documento.
> Si existe un conflicto entre una implementación y este documento, **prevalece este documento**.

---

## Índice

1. [Filosofía](#1-filosofía)
2. [Identidad Visual](#2-identidad-visual)
3. [Estilo Visual](#3-estilo-visual)
4. [Mobile First](#4-mobile-first)
5. [Espaciado](#5-espaciado)
6. [Tipografía](#6-tipografía)
7. [Componentes](#7-componentes)
8. [Botones](#8-botones)
9. [Formularios](#9-formularios)
10. [Tablas](#10-tablas)
11. [Tarjetas](#11-tarjetas)
12. [Dashboard](#12-dashboard)
13. [Landing](#13-landing)
14. [Responsive](#14-responsive)
15. [Accesibilidad](#15-accesibilidad)
16. [Animaciones](#16-animaciones)
17. [Información](#17-información)
18. [Consistencia](#18-consistencia)
19. [Objetivo Final](#19-objetivo-final)

---

## 1. Filosofía

NP Music Group **no** es una página web de música. **No** es una disquera. **No** es una landing promocional.

Es una **plataforma SaaS profesional** desarrollada para administrar artistas, lanzamientos, contratos y distribución musical.

Toda decisión de diseño debe reforzar esa percepción. El usuario debe sentir que está utilizando **software empresarial**.

---

## 2. Identidad Visual

### Colores oficiales

| Token | Descripción | Uso |
|---|---|---|
| **Negro** | Fondo principal | Fondo de toda la plataforma |
| **Negro claro** | Superficies | Cards, paneles, sidebars |
| **Blanco** | Texto principal | Títulos, contenido principal |
| **Gris** | Texto secundario | Subtítulos, metadatos, placeholders |
| **Amarillo `#F5C518`** | Color institucional | Botones principales, enlaces importantes, elementos activos, indicadores destacados |
| **Rojo `#EF4444`** | Error | Únicamente para errores y alertas críticas |
| **Verde discreto** | Éxito | Confirmaciones y estados positivos |

**Nunca utilizar colores adicionales sin autorización explícita.**

El amarillo institucional debe usarse con criterio: **únicamente** para los casos listados arriba. No como decoración general.

---

## 3. Estilo Visual

### La interfaz debe transmitir

- Profesionalismo
- Simplicidad
- Elegancia
- Confianza
- Tecnología
- Organización

### Nunca debe sentirse

- Recargada
- Futurista o de ciencia ficción
- Gamer
- Exagerada
- Infantil

---

## 4. Mobile First

- Toda pantalla debe diseñarse **primero para teléfonos Android**, luego adaptarse a escritorio.
- Nunca construir primero la versión desktop.
- Cada componente debe aprovechar correctamente el ancho disponible en pantallas pequeñas.

### Prohibido en mobile

- Espacios vacíos innecesarios.
- Tarjetas gigantes que ocupen toda la pantalla sin justificación.
- Elementos comprimidos ilegibles.

---

## 5. Espaciado

- Utilizar espacios amplios. Cada sección debe **respirar**.
- Mantener separación consistente entre: títulos, subtítulos, botones, tarjetas y formularios.
- Nunca saturar una pantalla con demasiados elementos.
- El espaciado debe ser predecible y repetible — no arbitrario.

---

## 6. Tipografía

- Utilizar una tipografía **moderna y muy legible**.
- La jerarquía visual se construye mediante **tamaño**, **peso** y **separación**.
- No mediante efectos visuales (sombras de texto, gradientes, subrayados decorativos).
- No utilizar texto decorativo sin función informativa.

### Jerarquía

| Nivel | Uso |
|---|---|
| H1 | Títulos principales de página |
| H2 | Títulos de sección |
| H3 | Subtítulos dentro de secciones |
| Body | Contenido general |
| Small / Caption | Metadatos, etiquetas, fechas |

---

## 7. Componentes

Todos los componentes deben compartir el mismo lenguaje visual:

- Mismos radios de borde.
- Mismos estilos de borde.
- Mismos márgenes y paddings.
- Misma elevación y sombra.

**Nunca mezclar estilos visuales diferentes dentro del mismo producto.**

---

## 8. Botones

| Tipo | Estilo |
|---|---|
| **Principal** | Fondo amarillo institucional, texto negro |
| **Secundario** | Fondo oscuro, borde sutil, texto blanco |
| **Destructivo** | Fondo rojo, texto blanco |

### Estados obligatorios

Todos los botones deben mostrar claramente su estado:

- `normal`
- `hover`
- `activo`
- `deshabilitado` — con `cursor-not-allowed`
- `cargando` — con indicador visual

**Nunca crear un botón sin funcionalidad real.** Si la función no existe aún, el botón no debe existir o debe estar `disabled` con justificación visible.

---

## 9. Formularios

Los formularios deben ser simples, limpios, accesibles y fáciles de completar.

Cada campo debe indicar claramente:

- **Etiqueta** — visible siempre, no solo como placeholder.
- **Validación** — en tiempo real cuando sea posible.
- **Error** — mensaje específico, no genérico.
- **Estado** — vacío, con valor, en foco, deshabilitado.

---

## 10. Tablas

- Las tablas deben priorizar la **legibilidad**.
- No sobrecargar columnas con información secundaria.
- Cada tabla debe permitir crecimiento futuro sin refactor de diseño.
- En mobile: considerar vistas alternativas (cards apiladas) cuando las columnas sean más de 4.

---

## 11. Tarjetas

- Las tarjetas deben contener **únicamente información útil y accionable**.
- Nunca crear tarjetas únicamente decorativas o de relleno.
- Toda tarjeta debe tener un propósito claro: mostrar datos, iniciar una acción o navegar.

---

## 12. Dashboard

El dashboard debe parecer **software empresarial de gestión**.

### Reglas

- No mostrar información inventada bajo ninguna circunstancia.
- Si no existen datos reales, mostrar estados vacíos profesionales:

| Situación | Texto del estado vacío |
|---|---|
| Sin registros | "Sin registros disponibles." |
| Sin actividad | "Sin actividad reciente." |
| Sin lanzamientos | "Aún no existen lanzamientos." |
| Sin ingresos | "No hay ingresos registrados." |

- **Nunca crear estadísticas ficticias.**

---

## 13. Landing

La landing debe **vender confianza**, no solo distribución.

Debe comunicar con claridad:

- Tecnología
- Organización
- Herramientas profesionales
- Gestión integral
- Crecimiento

La landing es la primera impresión del producto. Debe sentirse como la puerta de entrada a software serio.

---

## 14. Responsive

La plataforma debe funcionar correctamente en:

| Dispositivo | Prioridad |
|---|---|
| Android (móvil) | Alta — diseño base |
| Tablet | Media |
| Escritorio | Media |

- Cada componente debe adaptarse **individualmente**.
- No depender únicamente del escalado automático del navegador.

---

## 15. Accesibilidad

Priorizar siempre:

- **Contraste** — mínimo WCAG AA entre texto y fondo.
- **Navegación clara** — jerarquía visual obvia.
- **Tamaños adecuados** — áreas de toque mínimas de 44×44px en mobile.
- **Lectura cómoda** — interlineado y tamaño de fuente apropiados.

---

## 16. Animaciones

- Las animaciones deben ser **discretas y con propósito**.
- Nunca utilizar efectos exagerados, rebotes o movimientos llamativos.
- Las transiciones deben transmitir **fluidez y respuesta**, no entretenimiento.
- Duración máxima recomendada: 250ms para micro-interacciones, 400ms para transiciones de pantalla.

---

## 17. Información

Toda información visible en la plataforma debe provenir de **Neon PostgreSQL**.

Mientras no existan datos reales: mostrar **estados vacíos profesionales** (ver sección Dashboard).

**Nunca inventar:**

- Ingresos
- Artistas
- Reproducciones
- Usuarios
- Actividad
- Porcentajes
- Fechas

---

## 18. Consistencia

- Toda nueva pantalla debe **parecer parte del mismo producto**.
- No deben existir diferencias visuales notables entre módulos.
- Si un patrón de UI ya existe en el proyecto, reutilizarlo. No inventar variantes sin justificación.

---

## 19. Objetivo Final

La plataforma debe generar inmediatamente la sensación de haber sido desarrollada por una empresa tecnológica especializada en software para la industria musical.

Cada interfaz debe reflejar **calidad, orden, confianza y profesionalismo**.
