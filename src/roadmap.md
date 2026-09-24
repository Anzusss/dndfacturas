# Arquitectura Técnica y Roadmap: Creador Visual de Facturas ("Canva-Style")

Este documento detalla la especificación técnica, la selección de librerías, los conceptos clave y la hoja de ruta (roadmap) para el desarrollo del editor visual de facturas.

---

## 1. Resumen de Requisitos y Alcance

* **Editor Visual Interactivo:** Interfaz tipo "Canva" aislada en una ruta (`<Outlet/>`), orientada a manipular bloques de datos, coordenadas X/Y, tamaños y estilos.
* **Fidelidad de Impresión:** Soporte estricto para márgenes físicos, tipografía monoespaciada (`Courier New`) y tablas multimoneda (USD / Bs.).
* **Auditoría y Registro:** Control en el backend sobre la cantidad de veces que se imprime un documento, con capacidad de filtrado por día, semana o mes.
* **Desacoplamiento:** Dynamics u otro sistema externo provee los datos; esta aplicación gestiona la plantilla visual, la inyección de datos y el renderizado final.

---

## 2. Stack Tecnológico

### 2.1. Frontend (Cliente)

#### Core Framework & Build Tool
* ~~**Vite + React**~~ ✅ **COMPLETADO** — Scaffoldeado con `create-vite@latest --template react`. Alias `@/` y plugin Tailwind CSS v4 configurados en `vite.config.js`.
* ~~**Tailwind CSS**~~ ✅ **COMPLETADO** — Tailwind CSS v4 via `@tailwindcss/vite`. `index.css` con reset base y reglas `@media print`.

#### Manejo de Estado
* ~~**Zustand**~~ ✅ **COMPLETADO** — `src/store/useEditorStore.js` gestiona: `elements`, `selectedElementId`, `zoom`, `previewMode`, `showGridLines`, y acciones CRUD de bloques.

#### Interactividad (Drag & Drop / Resize)
* ~~**`react-rnd`**~~ ✅ **COMPLETADO** — `RndBlockWrapper.jsx`: arrastre libre, resize desde esquinas, toolbar flotante con X/Y/W/H en vivo, handles estilo Canva, congelado en `previewMode`.
* **`@hello-pangea/dnd` / `dnd-kit`** — (Alternativa de bloques apilados, no requerida).

#### Formularios y Validaciones
* **React Hook Form** — Pendiente (para paneles de propiedades avanzados).
* **Zod** — Pendiente (validación del JSON antes de enviarlo a la API).

#### Peticiones y Gestión de Datos
* **TanStack Query (React Query)** — Pendiente (conectar con endpoints de NestJS).

#### Motor de Impresión
* ~~**`react-to-print`**~~ ✅ **COMPLETADO** (implementación propia equivalente) — `EditorHeader.jsx`: clona `#invoice-print-sheet` en ventana auxiliar con todos los CSS, oculta labels de editor (`block-editor-label`) y llama `win.print()` limpio.
* **`@react-pdf/renderer`** — Opcional, para exportar PDF descargable.

---

### 2.2. Backend (Servidor) y Base de Datos

* **NestJS** — Pendiente (API RESTful para plantillas, impresiones y auditoría).
* **PostgreSQL (Dockerizado)** — Pendiente (almacenamiento de plantillas en JSONB).
* **TypeORM / Prisma** — Pendiente (modelado de tablas `invoice_templates`, `invoices`, `print_logs`).
* **`date-fns` / `Day.js`** — Pendiente (filtrado de auditorías por fecha).

---

### 2.3. Herramientas Avanzadas (Opcionales)

* **Craft.js** — Framework open source para editores drag-and-drop con serialización nativa.
* **ActiveReportsJS / Stimulsoft** — Componentes comerciales de reportes empresariales.
* **Puppeteer / Playwright** — Headless Chromium en Docker para renderizar PDFs perfectos desde NestJS.

---

## 3. Modelo de Datos (JSON Schema)

```json
{
  "$schema": "InvoiceTemplate",
  "templateId": "factura-fiscal-v1",
  "pageSetup": {
    "size": "LETTER",
    "width": "216mm",
    "minHeight": "279mm",
    "paddingTop": "50mm",
    "paddingBottom": "40mm",
    "fontFamily": "Courier New"
  },
  "elements": [
    { "id": "client-info-block", "type": "grid", "x": 0, "y": 0, "width": "65%", "fields": ["cliente", "rif", "direccion", "telefono"] },
    { "id": "doc-info-block", "type": "grid", "x": 0, "y": 0, "width": "25%", "fields": ["facturaNo", "fecha", "pago"] },
    { "id": "items-table", "type": "table", "columns": ["Cantidad", "UM", "Descripcion", "Precio/Tarifa", "Sub-total US$", "Sub-total Bs."] },
    { "id": "totals-section", "type": "totals", "showIGTF": true, "showIVA": true }
  ]
}
```

---

## 4. Roadmap de Desarrollo

```
[Fase 1 ✅] -> [Fase 2 ✅] -> [Fase 3 ✅] -> [Fase 4 🔲] -> [Fase 5 🔲]
```

### ✅ Fase 1: Configuracion Inicial y Layout — COMPLETA

* ~~[ ] Configurar proyecto Vite + React + Tailwind CSS.~~ ✅ Dependencias instaladas: `react-router-dom`, `zustand`, `react-rnd`, `lucide-react`, Tailwind v4.
* ~~[ ] Ruta aislada dentro del `<Outlet/>`.~~ ✅ Ruta `/editor` en `src/routes/` con `<RouterProvider>`.
* ~~[ ] Contenedor con dimensiones fisicas reales.~~ ✅ Hoja `816px x 1054px` en `CanvasArea.jsx`. Constantes en `src/domain/constants/paperDimensions.js`.
* ~~[ ] Layout de 3 columnas:~~ ✅ Implementado en `EditorPage.jsx`:
  1. ~~Barra lateral izquierda.~~ ✅ `ToolboxSidebar.jsx` — drag desde el HUD al lienzo.
  2. ~~Lienzo central.~~ ✅ `CanvasArea.jsx` — zoom, drop zone, guias de margen.
  3. ~~Barra lateral derecha.~~ ✅ `PropertiesSidebar.jsx` — paneles contextuales por tipo de bloque.

### ✅ Fase 2: Motor del Editor Visual ("Canva") — COMPLETA

* ~~[ ] Instalar y configurar `zustand`.~~ ✅ `src/store/useEditorStore.js`.
* ~~[ ] Integrar `react-rnd`.~~ ✅ `RndBlockWrapper.jsx` — arrastre, resize, toolbar, handles de esquina estilo Canva.
* ~~[ ] Barra de herramientas para anadir bloques:~~ ✅ `ToolboxSidebar.jsx`:
  * ~~Texto estatico.~~ ✅ `TextBlock.jsx`
  * ~~Campos dinamicos (variables Dynamics).~~ ✅ `VariableBlock.jsx` con catalogo completo.
  * ~~Tablas de items.~~ ✅ `TableBlock.jsx`
  * ~~Bloque de totales y leyendas.~~ ✅ `TotalsBlock.jsx` bimonetario USD/Bs.
* ~~[ ] Panel de propiedades.~~ ✅ `PropertiesSidebar.jsx` con: `GridProperties`, `TableProperties`, `TextProperties`, `TotalsProperties`, `PositionSizeControls`, `PageSetupPanel`.

### ✅ Fase 3: Renderizado e Impresion Fiel — COMPLETA

* ~~[ ] CSS `@media print` con borrado de fondos y margenes exactos.~~ ✅ `index.css` — tecnica `visibility:hidden` en body + `visibility:visible` en `#invoice-print-sheet`. Cancela el zoom con `position:fixed`.
* ~~[ ] Integrar motor de impresion conectado al boton "Probar Impresion".~~ ✅ Implementacion propia en `EditorHeader.jsx`: ventana auxiliar con HTML clonado + CSS del documento + ocultado de `.block-editor-label`.
* ~~[ ] Modo Vista Previa / Modo Edicion.~~ ✅ Toggle en `ZoomControls.jsx` — congela arrastre/resize, oculta labels (preservando espacio con `visibility:hidden`), oculta guias y toolbar.

### 🔲 Fase 4: Backend NestJS, PostgreSQL y Auditoria — PENDIENTE

* [ ] Docker con PostgreSQL.
* [ ] Proyecto NestJS + TypeORM/Prisma.
* [ ] Entidades: `invoice_templates`, `invoices`, `print_logs`.
* [ ] Endpoints:
  * `POST /templates` — guardar plantilla (validar con Zod).
  * `POST /invoices/:id/print` — registrar evento de impresion.
  * `GET /invoices/audit` — historial filtrado por fecha (date-fns).
* [ ] TanStack Query en frontend para consumir endpoints.

> **Nota:** `src/services/auditService.js` ya registra impresiones en `localStorage` como mock temporal, listo para conectarse a NestJS.

### 🔲 Fase 5: Integracion Final — PENDIENTE

* [ ] Inyeccion de datos dinamicos desde Microsoft Dynamics.
* [ ] Pruebas de impresion en papel fisico verificando alineacion milimetrica.
* [ ] Acoplar ruta al contenedor/pagina padre manteniendo independencia del editor.

> **Nota:** `src/services/dynamicsService.js` ya existe con datos de muestra simulando respuesta de Dynamics, listo para reemplazarse con llamadas reales.
