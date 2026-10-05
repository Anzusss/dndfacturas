# Changelog

Todos los cambios notables de este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2026-08-31

### Eliminado (Removed)
- Se eliminaron las rutas y páginas de autenticación no utilizadas (`auth.routes.tsx`) y la vista de Datatable Avanzado (`AdvancedTablesPage.tsx`) junto con su configuración de navegación.

## [1.0.2] - 2026-08-31

### Añadido (Added)
- Se añadió soporte para títulos de vista dinámicos y declarativos en toda la configuración de enrutamiento modular usando el objeto de metadata `handle: { title: '...' }`.
- Se creó una guía detallada y estandarizada para desarrolladores en el [README.md](file:///c:/Projects/NODE/admin-panel-serex/README.md) centrada en el uso del Serex Admin Template.

### Cambiado (Changed)
- Se optimizó el componente [Header.tsx](file:///c:/Projects/NODE/admin-panel-serex/src/layouts/components/Header.tsx) reemplazando la lógica de mapeo manual de nombres de vista por la resolución automática mediante el hook `useMatches` de `react-router-dom`.

## [1.0.1] - 2026-08-27

### Añadido (Added)
- Nueva arquitectura SPA construida con React, Vite y TypeScript (migrada desde plantillas estáticas HTML/EJS).
- Enrutamiento modular con `react-router-dom` separado por características de negocio (Dominio/Aplicación).
- Estado global centralizado implementado con Redux Toolkit (`uiSlice`, `authSlice`).
- Panel lateral deslizable (Offcanvas) funcional para la bandeja de Notificaciones.
- Integración de `clsx` y `tailwind-merge` para una composición dinámica y segura de clases CSS.

### Cambiado (Changed)
- Se estandarizaron los alias de ruta (usando `@/`) eliminando las importaciones relativas frágiles (`../../../`).
- Mejoras significativas en el modo oscuro (Dark Mode): Los componentes como el Footer, el Header y la barra de búsqueda (Command Palette) ahora emplean clases Tailwind seguras contra deslumbramientos (glassmorphism con fondos `slate-800/80`).
- Consolidación del enrutamiento dividiéndolo en 10 sub-rutas orientadas a módulos para prevenir un `router.tsx` monolítico.

### Eliminado (Removed)
- Eliminadas todas las dependencias estáticas de plantillas EJS (`.ejs`) y archivos `.html` crudos distribuidos a lo largo del repositorio que pertenecían a la arquitectura anterior.
- Limpieza masiva de múltiples archivos `.css` y `.js` antiguos del panel que no estaban siendo utilizados o han sido reemplazados por Tailwind CSS.
