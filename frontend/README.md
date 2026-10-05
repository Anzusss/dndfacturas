# 🎨 Serex Admin Template

Este repositorio contiene la **plantilla de administración oficial (Admin Template)** de Grupo Serex. Es una SPA (Single Page Application) moderna, responsiva y altamente estética que implementa el estándar tecnológico corporativo y sirve como base para construir interfaces de administración homogéneas.

---

## 🛠️ Stack Tecnológico Estándar

La plantilla está construida bajo los estándares de desarrollo frontend de la empresa:

* **Core**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool**: [Vite](https://vitejs.dev/) (Entorno de desarrollo ultra-rápido)
* **Enrutamiento**: [React Router v6](https://reactrouter.com/) con soporte para carga diferida (lazy loading) y metadatos dinámicos (`handle`).
* **Estado Global**: [Redux Toolkit](https://redux-toolkit.js.org/) para el manejo del estado de UI (sidebar, notificaciones, temas) y datos de sesión (`authSlice`).
* **Gestión de Datos y API**: [TanStack Query v5](https://tanstack.com/query) (React Query) para sincronización del estado del servidor.
* **Formularios y Validación**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) para validación estricta y segura de esquemas en tiempo de compilación.
* **Diseño y Estilos**: [Tailwind CSS v3](https://tailwindcss.com/) + CSS Variables corporativas + Efectos de **Glassmorphism** modernos.
* **Iconografía**: Google [Material Symbols Outlined](https://fonts.google.com/icons).

---

## 🗂️ Estructura del Proyecto

El proyecto está organizado siguiendo patrones de arquitectura limpia y escalabilidad:

```
admin-panel-serex/
├── .agents/                 # Instrucciones, guías de workflows y reglas para agentes de desarrollo IA
├── dist/                    # Bundle de producción compilado y optimizado
├── src/
│   ├── app/                 # Configuración core de la aplicación
│   │   ├── router/          # Enrutador central y sub-rutas divididas por características
│   │   └── store/           # Redux Store y definición de slices (uiSlice, authSlice)
│   ├── assets/              # Estilos CSS globales, tipografías y recursos gráficos
│   ├── layouts/             # Contenedores de vistas principales
│   │   ├── MainLayout.tsx   # Contenedor principal con Header, Sidebar y Footer
│   │   ├── AuthLayout.tsx   # Contenedor para flujos de login/registro (sin menús de navegación)
│   │   └── components/      # Componentes estructurales (Sidebar, Header, Footer)
│   ├── pages/               # Páginas y vistas agrupadas por dominio o característica de negocio
│   │   ├── auth/            # Login, Registro, Recuperación y Bloqueo de pantalla
│   │   ├── dashboards/      # Vistas de Analítica y E-Commerce
│   │   ├── sales/           # Módulo de ventas (Historial, Crear Venta, Detalle de Venta)
│   │   ├── inventory/       # Gestión de Inventario
│   │   ├── ui-elements/     # Catálogo extendido de componentes UI
│   │   ├── forms/           # Formularios, componentes personalizados, validaciones Zod y Wizards
│   │   ├── tables/          # Tablas simples y Datatables avanzados
│   │   ├── charts/          # Gráficos interactivos (ApexCharts, Chart.js)
│   │   ├── widgets/         # Componentes de tarjetas estadísticas y de visualización rápida
│   │   └── errors/          # Páginas de error (404 Not Found, 500 Server Error)
│   └── utils/               # Funciones utilitarias comunes (ej. formateadores de dinero, helper `cn`)
├── package.json             # Dependencias del proyecto y scripts
└── tsconfig.json            # Configuración del compilador TypeScript
```

---

## ✨ Características y Módulos del Template

### 1. Sistema de Layout Adaptativo
* **Tema Oscuro/Claro Nativo**: Cambios suaves en la interfaz adaptando los colores de fondo y bordes utilizando variables CSS corporativas. El tema es persistente a través del `localStorage`.
* **Sidebar Colapsable**: Adaptación a pantallas pequeñas en dispositivos móviles (modo offcanvas) y pantallas grandes en escritorio (sidebar expandido o colapsable).
* **Paleta de Comandos (Command Palette)**: Acceso interactivo a buscadores de módulos y comandos rápidos mediante la combinación `⌘K` o `Ctrl+K`.
* **Bandeja de Notificaciones Deslizable**: Panel lateral derecho elegante con efectos de desenfoque e historial de alertas del sistema.

### 2. Formularios Avanzados & Validación
* **Validación Zod**: Ejemplos integrados con esquemas Zod que impiden el envío de datos incorrectos e indican los errores en línea al usuario.
* **Componentes de Formulario Interactivos**: Datepickers, selectores avanzados y switches integrados de manera consistente.
* **Wizards (Asistentes)**: Formularios paso a paso con validaciones parciales por etapa.

### 3. Tablas de Datos
* **Tablas Simples**: Diseños limpios para visualizar listados cortos.
* **Datatables Avanzados**: Componentes con soporte para paginación, filtros avanzados en tiempo real, ordenamiento por columnas y exportación de datos.

### 4. Gráficos y Visualización
* Gráficos interactivos responsivos que integran **ApexCharts** y **Chart.js** para mostrar tendencias de ventas, visitas, estados financieros o reportes analíticos.

---

## 🚀 Instalación y Uso Local

Sigue estos pasos para correr el template en tu máquina local:

### 1. Instalar dependencias

```bash
npm install
```

> [!NOTE]
> El proyecto requiere tener a nivel de directorio hermano la carpeta `@gruposerex/ui` ya que consume componentes estilizados corporativos compartidos de dicho paquete local.

### 2. Levantar el entorno de desarrollo

```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite en `http://localhost:5173`.

### 3. Validar Tipos y Compilar para Producción

```bash
# Validar tipos TypeScript y compilar bundle optimizado en /dist
npm run build
```

---

## 🧭 Estándar de Enrutamiento (React Router v6)

Para registrar una nueva página en el template y lograr que el Header muestre su título correspondiente automáticamente:

1. Agrega el objeto de ruta con la propiedad `handle.title` en el archivo de sub-rutas correspondiente (dentro de `src/app/router/routes/`):

```typescript
// Ejemplo: src/app/router/routes/sales.routes.tsx
export const salesRoutes: RouteObject[] = [
  {
    path: 'apps/sales/create',
    element: <SalesCreatePage />,
    handle: { title: 'Registrar Venta' } // <-- Título que leerá el Header automáticamente
  }
];
```

2. El componente [Header.tsx](file:///c:/Projects/NODE/admin-panel-serex/src/layouts/components/Header.tsx) resolverá el título mediante el hook `useMatches` de forma automática al navegar.
