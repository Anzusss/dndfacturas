# Diccionario de Datos: Módulo de Formatos de Impresión

Este documento describe la estructura física de la base de datos (PostgreSQL) para el almacenamiento de layouts de impresión y sus versiones.

## 1. Tabla `document_formats`

Almacena la cabecera principal de un formato. Representa el contenedor lógico del diseño (ej. "Factura Legal").

| Columna | Tipo de Dato | Llaves | Nulable | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | `UUID` | PK | NO | Identificador único del formato. Se genera automáticamente mediante `gen_random_uuid()`. |
| `name` | `VARCHAR(100)` | - | NO | Nombre legible para el usuario final (ej. "Plantilla Factura Dólares"). |
| `description` | `TEXT` | - | SÍ | Descripción larga opcional sobre el propósito del formato. |
| `document_type_id` | `INT` | - | NO | ID numérico que mapea con el `SOPTYPE` de Dynamics GP (3 = Facturas, 4 = Notas de Crédito). |
| `active_version_id` | `UUID` | FK | SÍ | Apunta al `id` de la tabla `document_format_versions`. Define qué diseño es el que se usa actualmente al imprimir. |
| `created_by_id` | `UUID` | FK | SÍ | Identificador del usuario que creó este formato (Auditoría). |
| `created_at` | `TIMESTAMPTZ` | - | NO | Fecha y hora de creación. Default: `CURRENT_TIMESTAMP`. |
| `updated_at` | `TIMESTAMPTZ` | - | NO | Fecha y hora de la última modificación de los metadatos. Default: `CURRENT_TIMESTAMP`. |
| `deleted_at` | `TIMESTAMPTZ` | - | SÍ | Fecha de eliminación lógica (Soft Delete). Si es nulo, el formato está activo. |

---

## 2. Tabla `document_format_versions`

Almacena el historial inmutable de diseños (layouts). Cada vez que se guarda el canvas, se inserta un nuevo registro aquí.

| Columna | Tipo de Dato | Llaves | Nulable | Descripción |
| :--- | :--- | :---: | :---: | :--- |
| `id` | `UUID` | PK | NO | Identificador único de esta versión de diseño. Se genera mediante `gen_random_uuid()`. |
| `format_id` | `UUID` | FK | NO | Apunta al `id` de la tabla `document_formats`. (`ON DELETE CASCADE`). |
| `version_number` | `INT` | - | NO | Número de iteración incremental (1, 2, 3, etc.). |
| `layout_json` | `JSONB` | - | NO | Objeto JSON con toda la configuración del Canvas. Se usa `JSONB` para búsquedas y validaciones nativas en Postgres. |
| `status` | `VARCHAR(20)` | - | NO | Estado de la versión. Valores permitidos: `DRAFT` (Borrador), `ACTIVE` (En Uso), `ARCHIVED` (Depreciada). Default: `DRAFT`. |
| `created_by_id` | `UUID` | FK | SÍ | Identificador del usuario que creó esta versión (Auditoría). |
| `created_at` | `TIMESTAMPTZ` | - | NO | Fecha y hora en la que se guardó este diseño. Default: `CURRENT_TIMESTAMP`. |

### 2.1 Índices y Restricciones
- **Restricción UNIQUE:** `(format_id, version_number)` para evitar que un mismo formato tenga dos versiones con el mismo número por problemas de concurrencia.
- **FK Reference:** El campo `format_id` referencia a `document_formats(id)` en borrado en cascada, por si se requiere limpiar la BD.
- **Index:** `idx_document_format_versions_status` para optimizar consultas que filtren solo versiones activas.
