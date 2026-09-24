# Arquitectura Técnica y Roadmap: Creador Visual de Facturas ("Canva-Style")

Este documento detalla la especificación técnica, la selección de librerías, los conceptos clave y la hoja de ruta (roadmap) para el desarrollo del editor visual de facturas. El objetivo principal es desacoplar el diseño visual rígido de herramientas como Microsoft Dynamics, permitiendo a los desarrolladores diseñar, personalizar e imprimir facturas sobre formato carta (216mm x 279mm) respetando márgenes fijos para papel membretado y auditando cada impresión realizada.

---

## 1. Resumen de Requisitos y Alcance

* **Editor Visual Interactivo:** Interfaz tipo "Canva" aislada en una ruta (`<Outlet/>`), orientada a manipular bloques de datos, coordenadas X/Y, tamaños y estilos.
* **Fidelidad de Impresión:** Soporte estricto para márgenes físicos (por ejemplo: `padding: 50mm 15mm 40mm 15mm` para colectas o membretes), tipografía monoespaciada (`Courier New`) y tablas multimoneda (USD / Bs.).
* **Auditoría y Registro:** Control en el backend sobre la cantidad de veces que se imprime un documento, con capacidad de filtrado por día, semana o mes.
* **Desacoplamiento:** Dynamics u otro sistema externo provee los datos del cliente, RIF, totales e ítems; esta aplicación gestiona la plantilla visual, la inyección de datos y el renderizado final.

---

## 2. Stack Tecnológico y Concepto de Librerías

### 2.1. Frontend (Cliente)

#### Core Framework & Build Tool
* **Vite + React:** Enrutamiento rápido y entorno de desarrollo de alto rendimiento.
* **Tailwind CSS:** Framework de utilidades CSS para dar estilo al editor, paneles laterales y controles de interfaz.

#### Manejo de Estado del Editor Visual
* **Zustand:**
  * *Concepto:* Librería de gestión de estado global ultra ligera basada en hooks.
  * *Uso:* Manejará el estado del lienzo en tiempo real (lista de elementos arrastrados, elemento seleccionado, nivel de zoom, historial de deshacer/rehacer). Evita *re-renders* innecesarios en todo el árbol de componentes mientras se mueven objetos por la pantalla.

#### Interactividad y Arrastre (Drag & Drop / Resize)
* **`react-rnd` (React Resizable and Draggable):**
  * *Concepto:* Componente que envuelve elementos del DOM para hacerlos arrastrables (X, Y) y redimensionables (Ancho, Alto) con controles visuales.
  * *Uso:* Base para posicionar textos, etiquetas, cuadros de totales y logos dentro del lienzo en milímetros (`mm`) o píxeles (`px`).
* **`@hello-pangea/dnd` / `dnd-kit` (Alternativa por bloques):**
  * *Concepto:* Librerías avanzadas para reordenar listas y contenedores.
  * *Uso:* Si se opta por un diseño en bloques apilados (Header, Tabla de Ítems, Leyendas Legales, Totales) en lugar de coordenadas absolutas libres.

#### Formularios y Validaciones
* **React Hook Form:**
  * *Concepto:* Librería para el manejo de formularios basada en referencias (uncontrolled components) que minimiza renderizados.
  * *Uso:* Manejo de los paneles de propiedades (editar tamaño de letra, cambio de alineación, etiquetas dinámicas).
* **Zod:**
  * *Concepto:* Librería de declaración y validación de esquemas TypeScript-first.
  * *Uso:* Validar la estructura del objeto JSON que define la plantilla antes de guardarla o enviarla a la API.

#### Peticiones y Gestión de Datos
* **TanStack Query (React Query):**
  * *Concepto:* Gestor de estado asíncrono para almacenamiento en caché, sincronización y actualización del estado del servidor en React.
  * *Uso:* Carga de plantillas guardadas, envío de registros de impresión y consulta de reportes de auditoría por rangos de fecha.

#### Motor de Impresión
* **`react-to-print`:**
  * *Concepto:* Utilidad que toma un componente React/DOM montado y abre la ventana nativa de impresión del navegador (`window.print()`) aplicando estilos específicos de `@media print`.
  * *Uso:* Imprimir directamente la factura montada en pantalla manteniendo los márgenes exactos (`50mm` superior, `40mm` inferior).
* **`@react-pdf/renderer` (Opción alternativa/complementaria):**
  * *Concepto:* Motor para crear documentos PDF directamente mediante componentes React (`<Document>`, `<Page>`, `<View>`, `<Text>`).
  * *Uso:* Para generar un archivo PDF físico estricto en el lado del cliente o descargable para almacenamiento legal.

---

### 2.2. Backend (Servidor) y Base de Datos

#### Framework e Infraestructura
* **NestJS:**
  * *Concepto:* Framework progresivo de Node.js estructurado en módulos, controladores y servicios, ideal para aplicaciones empresariales escalables.
  * *Uso:* Proporcionar la API RESTful para guardar plantillas, procesar solicitudes de impresión y auditar eventos.
* **PostgreSQL (Dockerizado):**
  * *Concepto:* Base de datos relacional robusta con soporte nativo para tipos de datos JSON (`JSONB`).
  * *Uso:* Guardar las plantillas del editor en formato `JSONB`, las facturas emitidas y la tabla de auditoría.
* **TypeORM / Prisma:**
  * *Concepto:* ORM (Object-Relational Mapping) para interactuar con PostgreSQL mediante clases o esquemas tipados.
  * *Uso:* Modelar y consultar las tablas `invoice_templates`, `invoices` y `print_logs`.

#### Fechas y Reportes
* **`date-fns` / `Day.js`:**
  * *Concepto:* Librerías de manipulación de fechas ligeras e inmutables.
  * *Uso:* Filtrar auditorías e impresiones por día específico, semana en curso o mes calendario.

---

### 2.3. Tecnologías de Paga y Herramientas Avanzadas (Opcionales)

* **Craft.js (Open Source Avanzado):** Framework especializado para construir editores *drag-and-drop* en React con serialización de código nativa.
* **ActiveReportsJS / Stimulsoft Reports.JS (Comerciales de Paga):** Componentes integrables de reportes empresariales con diseñador visual incluido.
* **Puppeteer / Playwright (Headless Chromium en Docker):** Permite levantar un navegador en segundo plano en NestJS para renderizar la plantilla HTML/CSS y retornar un PDF perfecto e inmutable.

---

## 3. Modelo de Datos y Estructura de Plantilla (JSON Schema)

El editor visual guarda el diseño en un objeto JSON reutilizable en PostgreSQL.

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
    {
      "id": "client-info-block",
      "type": "grid",
      "x": 0,
      "y": 0,
      "width": "65%",
      "fields": ["cliente", "rif", "direccion", "telefono"]
    },
    {
      "id": "doc-info-block",
      "type": "grid",
      "x": 0,
      "y": 0,
      "width": "25%",
      "fields": ["facturaNo", "fecha", "pago"]
    },
    {
      "id": "items-table",
      "type": "table",
      "columns": ["Cantidad", "UM", "Descripción", "Precio/Tarifa", "Sub-total US$", "Sub-total Bs."]
    },
    {
      "id": "totals-section",
      "type": "totals",
      "showIGTF": true,
      "showIVA": true
    }
  ]
}
```

---

## 4. Roadmap de Desarrollo Paso a Paso

```
[ Fase 1: Setup & Canvas Base ] -> [ Fase 2: Motor Drag & Drop ] -> [ Fase 3: Impresión & Margen ] -> [ Fase 4: Backend NestJS & Auditoría ] -> [ Fase 5: Integración ]
```

### Fase 1: Configuración Inicial y Layout en RUTA `<Outlet/>`
* [ ] Configuración del proyecto en Vite + React + Tailwind CSS.
* [ ] Crear la ruta aislada dentro del `<Outlet/>` sin estilos del sistema padre.
* [ ] Configurar el contenedor con dimensiones físicas reales (`width: 216mm`, `min-height: 279mm`, `padding: 50mm 15mm 40mm 15mm`).
* [ ] Crear el layout de 3 columnas en Tailwind:
  1. Barra lateral izquierda (Herramientas / Añadir elementos).
  2. Lienzo central (Hoja de papel sobre fondo gris).
  3. Barra lateral derecha (Propiedades del elemento seleccionado).

### Fase 2: Motor del Editor Visual ("Canva")
* [ ] Instalar y configurar `zustand` para almacenar la lista de elementos en el lienzo.
* [ ] Integrar `react-rnd` para permitir que los elementos agregados puedan arrastrarse y redimensionarse.
* [ ] Implementar la barra de herramientas para añadir:
  * Cajas de texto estático.
  * Campos dinámicos (variables que vendrán de Dynamics como `{{cliente}}`, `{{rif}}`).
  * Tablas de ítems con encabezados personalizados.
  * Bloque de leyendas legales y totales.
* [ ] Conectar el panel de propiedades para cambiar fuentes (`Courier New`), bordes, alineaciones y visibilidad de campos.

### Fase 3: Renderizado e Impresión Fiel
* [ ] Implementar la regla CSS `@media print` garantizando el borrado de fondos de pantalla y respeto estricto de márgenes.
* [ ] Integrar `react-to-print` conectado al botón "Probar Impresión".
* [ ] Crear un interruptor "Modo Vista Previa / Modo Edición" para congelar los controles de arrastre y ver el documento tal como se imprimirá.

### Fase 4: Backend NestJS, PostgreSQL y Auditoría
* [ ] Configurar contenedores Docker con PostgreSQL.
* [ ] Crear proyecto NestJS y conectar TypeORM/Prisma.
* [ ] Diseñar entidades y tablas de DB:
  * `invoice_templates`: Guarda el JSON de la plantilla.
  * `invoices`: Guarda facturas generadas.
  * `print_logs`: Guarda `id`, `invoice_id`, `timestamp`, `user_id`.
* [ ] Crear endpoints en NestJS:
  * `POST /templates`: Guardar/actualizar plantilla (validada con Zod).
  * `POST /invoices/:id/print`: Registrar un evento de impresión.
  * `GET /invoices/audit`: Consultar historial filtrado por fecha (día, semana, mes) usando `date-fns`.
* [ ] Conectar TanStack Query en el frontend para consumir los endpoints.

### Fase 5: Integración Final, Ajustes e Inyección a la App Padre
* [ ] Probar la inyección de datos dinámicos simulando la respuesta de Microsoft Dynamics.
* [ ] Realizar pruebas de impresión en papel físico o PDF comprobando la alineación milimétrica.
* [ ] Acoplar la ruta dentro del contenedor/página padre manteniendo la independencia del editor.