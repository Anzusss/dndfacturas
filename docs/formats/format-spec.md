# 📄 Especificación Técnica: Gestor de Formatos de Impresión

## 1. Descripción General
El módulo de Gestión de Formatos permitirá a los usuarios diseñar, versionar y administrar plantillas visuales (layouts) para la impresión de documentos (Facturas, Notas de Crédito, etc.). El frontend utilizará un editor basado en Canvas para drag & drop de elementos (cajas de texto, variables de GP, imágenes, márgenes), mientras que el backend almacenará la estructura en formato JSON.

Para garantizar la trazabilidad, las actualizaciones de un formato no sobrescriben la plantilla original; en su lugar, generan una **nueva versión** y deprecian la anterior.

---

## 2. Modelo de Datos Lógico (Propuesta Relacional)

Se proponen dos tablas para aislar la metadata del formato de sus iteraciones de diseño (versiones). Estas tablas deberían vivir en la base de datos local de la aplicación (PostgreSQL/MySQL), no en la de Dynamics GP.

### Tabla: `document_formats` (Maestro del Formato)
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID (PK) | Identificador único del formato. |
| `name` | VARCHAR(100) | Nombre (ej. "Factura Pre-impresa Legal"). |
| `document_type_id` | INT | Tipo de doc en GP (3 = Factura, 4 = NC). |
| `active_version_id` | UUID (FK) | Apunta a la versión actualmente en uso. |
| `created_at` | TIMESTAMP | Fecha de creación. |

### Tabla: `format_versions` (Historial de Versiones)
| Campo | Tipo | Descripción |
|---|---|---|
| `id` | UUID (PK) | Identificador de esta versión específica. |
| `format_id` | UUID (FK) | Relación al `document_formats`. |
| `version` | INT | Número incremental (1, 2, 3...). |
| `layout_json` | JSON/JSONB | Almacena toda la config del canvas (márgenes, fuentes, coords de X/Y de cada caja de texto, variables asignadas). |
| `status` | ENUM | `DRAFT`, `ACTIVE`, `ARCHIVED`. |
| `created_at` | TIMESTAMP | Fecha en la que se guardó la versión. |

---

## 3. Contratos REST API Propuestos

- **`GET /api/formats`**
  Lista los formatos disponibles y su versión activa actual.
- **`POST /api/formats`**
  Crea un nuevo formato desde cero (crea el registro maestro y su versión 1).
- **`GET /api/formats/{format_id}`**
  Obtiene toda la metadata del formato y el `layout_json` de la versión activa para renderizar el Canvas.
- **`POST /api/formats/{format_id}/versions`**
  Guarda una modificación del diseño. Automáticamente crea la versión N+1, la marca como `ACTIVE` y marca la anterior como `ARCHIVED`.
- **`GET /api/formats/{format_id}/versions`**
  Retorna el historial de cambios (útil para "rollback" a una versión anterior).

---

## 4. Escenarios de Fallo y Casos Límite (Edge Cases)

1. **Estructura JSON Inválida (Corrupción de Formato):** Si el Frontend envía un `layout_json` que no respeta el esquema de Canvas (faltan ejes X/Y o variables), el Backend debe rechazar la creación de la versión para evitar crashear el renderizador de impresión. Se validará con una clase de validación estructurada.
2. **Concurrencia de Edición:** Si dos usuarios editan la versión 1 al mismo tiempo y le dan "Guardar", el sistema podría crear dos "versión 2". El Backend controlará esto bloqueando inserciones si el `version_number` enviado no coincide con el último disponible.
3. **Impresión con Formatos Huérfanos:** Si se desactiva un formato o no tiene versión activa, el endpoint de impresión debe retornar un error amigable indicando que "El documento no tiene una plantilla de impresión válida asignada" en vez de fallar.

---

## 5. Prototipos Visuales ASCII (Pantalla de Canvas)

```text
======================================================================
| 🖨️  GP Print Studio  |  [Factura Legal V2 - ACTIVO]      [ GUARDAR ] |
======================================================================
| Herramientas        |                CANVAS                        |
|                     |                                              |
| [T] Texto Estático  | +------------------------------------------+ |
| [$] Variable GP     | |  [LOGO_EMPRESA]         [Nro: FACT-001]  | |
| [ ] Imagen          | |                                          | |
| [-] Línea Divisoria | |  Cliente: [customer_name]                | |
|                     | |  RIF: [rif]       Fecha: [document_date] | |
| Propiedades         | |                                          | |
|                     | | ---------------------------------------- | |
| Fuente: [ Arial ]v  | | [TABLA_DE_ARTICULOS]                     | |
| Tamaño: [ 12px  ]v  | | [quantity] | [item_desc] | [subtotal]    | |
| Negrita: [x]        | |                                          | |
|                     | |                                          | |
| Eje X: 150px        | |                     TOTAL: [grand_total] | |
| Eje Y: 20px         | +------------------------------------------+ |
======================================================================
```
