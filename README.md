# dndFacturas — Creador visual e impresión de facturas

Editor tipo "Canva" para diseñar plantillas de factura fiscal (Carta, Media carta, Oficio…),
con márgenes físicos para papel membretado, **aprobación de plantillas**, **plantilla activa por
tipo de factura** (crédito / contado) e **impresión con datos de Microsoft Dynamics**, auditando
cada impresión y cada cambio de plantilla.

Consulta [`roadmap.md`](roadmap.md) para el alcance completo y las fases pendientes.

> **¿Primera vez en un ordenador nuevo?** Sigue [`GUIA_INICIO.md`](GUIA_INICIO.md): requisitos,
> instalación, prueba rápida, cómo conectar la API de Dynamics y preguntas pendientes.

## Puesta en marcha

### Opción A · Todo completo (frontend + backend + base de datos)

Requisitos: Node 24+ y Docker Desktop abierto.

```bash
npm install && npm run frontend:install && npm --prefix backend install   # dependencias (una vez)
npm run db:up                                 # PostgreSQL único + esquema dndfacturas
npm run backend:dev                           # API en http://localhost:3000/api (docs: /api/docs)
npm run gp-print-studio:up                   # PHP + PostgreSQL GP + SQL Server (Dynamics)
npm run mock-api                              # "Dynamics" simulado en http://localhost:3001 (otra terminal)
npm run dev:backend                           # app en http://localhost:5173 guardando en PostgreSQL
```

### Opción B · Solo frontend (sin Docker ni backend)

```bash
npm install
npm run dev        # app en http://localhost:5173; los datos se guardan en el navegador (localStorage)
```

### Otros comandos

```bash
npm run build          # build de producción del frontend en frontend/dist/
npm run lint           # validación TypeScript del frontend
npm run backend:test   # tests unitarios + e2e del backend (requiere Docker)
```

El backend NestJS está documentado en [`backend/README.md`](backend/README.md). El backend PHP de
GP Print Studio está documentado en [`docs/GP_PRINT_STUDIO_README.md`](docs/GP_PRINT_STUDIO_README.md).

## Base de datos (Docker)

Requisito: Docker Desktop abierto.

```bash
cp .env.example .env   # opcional: cambia credenciales/puertos (si no, usa los valores por defecto)
npm run db:up          # = docker compose up -d
```

La primera vez, el PostgreSQL de NestJS ejecuta automáticamente `database/init/01_schema.sql`
(tablas, reglas y vistas) y `02_seed.sql` (tipos de factura y las dos plantillas por defecto,
aprobadas y activas).

| Servicio | Dirección | Acceso por defecto |
|---|---|---|
| PostgreSQL 16 · Canvas/NestJS | `localhost:5432` | BD `dndfacturas` · usuario `dndfacturas` · contraseña de desarrollo |
| PostgreSQL del Canvas | `localhost:5432` | Usar DBeaver · BD `dndfacturas` · servidor `localhost` |

| Comando | Qué hace |
|---|---|
| `npm run db:up` / `db:down` | Levanta / detiene PostgreSQL del Canvas (los datos se conservan) |
| `npm run db:seed` | Regenera `02_seed.sql` desde el código del dominio |

Tablas: `invoice_types`, `invoice_templates` (una fila por versión, diseño en JSONB),
`active_templates` (una activa por tipo), `template_history` y `print_logs` (auditoría).
Vistas: `v_active_templates`, `v_latest_templates`, `v_invoice_print_counts`.

La base de datos aplica las mismas reglas que la app: una versión aprobada no se modifica ni se
borra, solo se activan versiones aprobadas del mismo tipo, y la auditoría es de solo inserción.

> El frontend usa esta base de datos a través del backend (`npm run dev:backend`). Con
> `npm run dev` sigue funcionando sin backend, guardando en `localStorage`.

### Base de datos de GP Print Studio y Dynamics

El backend PHP vive en `gp-print-studio-backend/`, pero sus servicios se
levantan desde el Compose raíz para compartir red y ciclo de vida:

```bash
npm run gp-print-studio:up
```

| Servicio | Dirección | Uso |
|---|---|---|
| PHP/CodeIgniter | `http://localhost:8080` | API de documentos y formatos |
| PostgreSQL 15 | `localhost:5432` | `gp_print_studio_db`, datos GP y tablas dndfacturas |
| SQL Server 2019 | `localhost:1433` | Datos de Microsoft Dynamics GP |

La pantalla de impresión consulta las cabeceras y detalles de documentos al backend PHP
(`http://localhost:8080/api/documents/...`). PostgreSQL es un único contenedor y una
única base lógica (`gp_print_studio_db`); allí se conservan los datos de GP y se
agregan las tablas de plantillas y auditoría de dndfacturas.

## Flujo de trabajo

```
Diseñador: crea/edita BORRADOR ──▶ Enviar a revisión
Gerente:   Aprobar (o Rechazar con motivo) ──▶ Activar para Crédito / Contado
Imprimir:  nº de factura ──▶ API ──▶ plantilla activa de su tipo ──▶ vista previa ──▶ imprimir ──▶ auditoría
```

- Solo los borradores se editan. Una versión aprobada no cambia nunca: "Crear nueva versión"
  genera la siguiente como borrador y la aprobada sigue imprimiéndose hasta activar la nueva.
- Cada impresión guarda plantilla **y versión**; el historial registra quién hizo qué y cuándo.
- El frontend usa la sesión de la plantilla empresarial y sus perfiles generales para aplicar permisos.
- Importar/exportar: JSON validado; lo importado entra siempre como borrador.

### Rol temporal de desarrollo

Mientras se completa la integración de roles de Identity, el frontend asigna todos los permisos al
rol `GERENTE`. Esto habilita temporalmente editar, revisar, aprobar, activar, importar/exportar e
imprimir facturas desde el entorno local.

Para cambiarlo más adelante, edita `frontend/src/presentation/hooks/useCurrentUser.js`: reemplaza
el `MOCK_ROLE` fijo y restaura el mapeo de `user.role`, `user.roles` o `user.claims.role` recibido
por Identity. El `authSlice` inicial de `frontend/src/app/store/slices/authSlice.ts` también debe
reflejar el rol de desarrollo que se quiera mostrar, pero la autorización del Canvas se centraliza
en `useCurrentUser` y `domain/models/permissions.js`.

## Tamaños de hoja

Configurables por plantilla (panel izquierdo del editor, sin bloque seleccionado):

| Tamaño | Medidas (vertical) | Uso habitual |
|---|---|---|
| Carta | 216 × 279 mm (8,5 × 11 in) | Forma libre estándar |
| Media carta | 140 × 216 mm (5,5 × 8,5 in) | Muy usada en facturas; normalmente **horizontal** (216 × 140 mm) |
| Cuarto de carta | 108 × 140 mm | Recibos / documentos pequeños |
| Oficio | 216 × 330 mm (8,5 × 13 in) | Oficio venezolano (no confundir con Legal EE. UU., 216 × 356 mm) |
| Personalizado | Ancho y alto libres | Papel continuo u otros formatos de imprenta |

- La Providencia SNAT/2011/0071 regula el contenido de la factura, no el tamaño del papel.
- "Restaurar" carga el diseño base del tamaño actual (existe uno específico para media carta horizontal).
- Al reducir la hoja, se avisa de los bloques que quedan fuera y se pueden ajustar con un clic.
- La impresión configura la página de la impresora con las medidas exactas de la hoja.

## Conectar la API de facturas

1. Copia `.env.example` como `.env.local` y pon la URL (`{numero}` = número de factura):
   ```
   VITE_INVOICE_API_URL=https://servidor/api/facturas/{numero}
   ```
  Sin URL, la app usa el **modo simulado** (`frontend/src/services/invoiceApi/mockInvoices.js`).
   Reinicia `npm run dev` tras cambiar el archivo.
2. Ajusta **`frontend/src/services/invoiceApi/dynamicsInvoiceMapper.js`**: `DYNAMICS_FIELD_MAP` indica en
   qué ruta del JSON de la API está cada dato, e `INVOICE_TYPE_ALIASES` los códigos de crédito/contado.
   Es el único archivo que depende del formato de Dynamics.
3. Prueba en **Imprimir** (`/print`):
   - "Pegar JSON" permite probar la traducción con un ejemplo, sin acceso a la API.
   - "Datos técnicos" muestra el JSON recibido y el traducido.
   - Antes de imprimir se listan los campos que la plantilla usa y la factura no trae.
4. Si la API exige una clave secreta, **no la pongas en `.env`**: las variables `VITE_*` son públicas.
   La llamada debería pasar por un backend. El token de sesión se añadirá en `getAuthHeaders()`
   de `invoiceApiService.js`.

**Postman:** importa `mock-api/dndfacturas.postman_collection.json`. Apunta a la API simulada
(`npm run mock-api`); para la real, cambia la variable `baseUrl` de la colección.

## Arquitectura por capas

Las dependencias solo apuntan hacia abajo: una capa puede importar de las inferiores, nunca de las superiores.

```
presentation/   ← Componentes React, páginas, layouts y hooks de UI
     │
store/          ← Estado global (editor y sesión simulada) con Zustand
     │
services/       ← Casos de uso (flujo, impresión) y acceso a datos (localStorage / API)
     │
utils/          ← Funciones puras de apoyo (unidades, formato, imán, impresión, archivos)
     │
domain/         ← Reglas de negocio puras: constantes, modelos, ciclo de vida, permisos (sin React)
```

```
src/
├── domain/
│   ├── constants/   elementTypes, invoiceTypes, dynamicsVariables (contrato de campos),
│   │                paperDimensions, editorConfig
│   └── models/      invoiceTemplate, templateLifecycle, permissions, invoiceData,
│                    templateTransfer, elementFactory, tableColumns, sampleData, printLog
├── services/                    Cada servicio elige implementación: backend (VITE_BACKEND_URL) o local
│   ├── backend/                 httpClient + implementaciones contra la API NestJS
│   ├── local/                   implementaciones sobre localStorage (modo sin backend)
│   ├── invoiceApi/              invoiceApiService (backend/API/mock), dynamicsInvoiceMapper, mockInvoices
│   ├── storage/                 localStorageClient
│   ├── auth/                    configuración del login y sesión de Identity
│   ├── templateWorkflowService  guardar, enviar, aprobar, rechazar, activar, importar, exportar
│   ├── invoicePrintService      preparar factura + plantilla activa, registrar impresión
│   ├── templateService / activeTemplateService / templateHistoryService / auditService
├── store/           useEditorStore, editorSelectors, useSessionStore
├── utils/           units, formatters, snapUtils, printUtils, fileUtils
├── routes/          appRoutes (páginas reutilizables), AppRouter, routePaths
└── presentation/
    ├── hooks/       useCurrentUser, useInvoicePrint, useTemplateManagement, useEditorTestPrint, useToast
    ├── pages/       EditorPage, PrintPage, TemplatesPage, AuditPage, NotFoundPage
    └── components/
        ├── invoice/    InvoiceSheet, InvoiceDocument y bloques (comunes a editor e impresión)
        ├── editor/     cabecera, toolbox, lienzo (react-rnd) y paneles de propiedades
        ├── print/      búsqueda, comprobaciones, vista previa, inspector de datos
        ├── templates/  plantilla activa por tipo, tarjetas, importar, visor JSON
        ├── audit/      filtros, impresiones, historial de cambios
        └── common/     SidebarPanel, FormField, NumberField, Toast y PageHeader
```

## Integración en la plantilla de la empresa

- `frontend/src/app/router/canvasRoutes.tsx` monta el Canvas bajo `/facturacion` dentro del layout empresarial.
- Las alturas ya no dependen de `100vh`, así que el editor se adapta al contenedor.
- La sesión proviene de `@gruposerex/auth-module`; el backend NestJS mantiene compatibilidad temporal
  con cabeceras mientras se completa la validación JWT.

## Convenciones

- **Store con selectores**: `useEditorStore((s) => s.campo)`. Sin selector el componente se
  re-renderiza con cualquier cambio (p. ej. en cada movimiento al arrastrar).
- **Nuevo tipo de bloque**: añádelo a `ELEMENT_TYPES`, crea `XxxBlock.jsx` en
  `components/invoice/blocks/` y regístralo en `BlockRenderer`; si tiene propiedades, crea
  `XxxProperties.jsx` y regístralo en `BlockPropertiesPanel`; para el toolbox, `toolboxCatalog.js`.
- **Datos en los bloques**: nunca se escriben valores a mano; se enlazan a campos del catálogo
  (`dynamicsVariables.js`) o se usan `{{campo}}` en los textos.
- **Formato del JSON**: si cambia, sube `TEMPLATE_SCHEMA_VERSION` y migra en `normalizeTemplate`.
