# dndFacturas · Backend (NestJS)

API REST para plantillas de factura, plantilla activa por tipo, auditoría de impresiones y proxy
hacia la API de facturas de Microsoft Dynamics.

- **NestJS 12** (TypeScript, ES modules) · **TypeORM 1.x** · **PostgreSQL 16** (docker-compose de la raíz)
- Validación con `class-validator` · documentación **Swagger** en `/api/docs`
- Tests con **Vitest** (unitarios + e2e contra una base de datos de pruebas)

## Puesta en marcha

```bash
# 1. Base de datos (desde la raíz del proyecto)
docker compose up -d

# 2. Backend
cd backend
npm install
cp .env.example .env      # opcional: los valores por defecto ya sirven para desarrollo
npm run start:dev         # http://localhost:3000/api · docs en http://localhost:3000/api/docs
```

Para que el frontend use este backend: en la raíz, `npm run dev:backend` (usa `.env.backend`).

| Script | Qué hace |
|---|---|
| `npm run start:dev` | Arranca con recarga automática |
| `npm run build` / `start:prod` | Compila a `dist/` y lo ejecuta |
| `npm test` | Tests unitarios del dominio |
| `npm run test:e2e` | Tests e2e (requiere Docker; usan la BD `dndfacturas_test`) |
| `npm run lint` | oxlint con análisis de tipos |

## Arquitectura

```
src/
├── main.ts / app.setup.ts   Arranque y configuración global (prefijo /api, CORS, validación, Swagger)
├── app.module.ts            Conexión a BD, guard global y módulos
├── config/                  Variables de entorno validadas y opciones de TypeORM
├── domain/                  Reglas puras (espejo de src/domain del frontend): permisos,
│                            ciclo de vida, validación de plantillas, periodos de auditoría
├── common/
│   ├── auth/                Autenticación SIMULADA por cabeceras + @RequirePermission
│   ├── filters/             Errores de PostgreSQL (triggers) → HTTP 400/409
│   ├── dto/ · types/        DTOs y tipos compartidos
└── modules/                 Un módulo por recurso: entity → service → controller
    ├── templates/           Versiones de plantillas y flujo de aprobación
    ├── active-templates/    Plantilla activa por tipo de factura
    ├── template-history/    Historial de cambios (solo inserción)
    ├── print-logs/          Auditoría de impresiones (solo inserción)
    ├── invoice-types/       Catálogo de tipos de factura
    ├── invoices/            Proxy a la API de Dynamics
    └── health/              Estado del servicio y de la BD
```

- **El esquema lo gestionan los scripts SQL** de `database/init/` (TypeORM con `synchronize: false`).
  Si cambias una tabla, cambia el SQL y la entidad correspondiente.
- Las reglas del flujo se validan en los servicios **y** en la base de datos (triggers): una
  versión aprobada no se modifica, solo se activan versiones aprobadas del mismo tipo, y la
  auditoría no se puede editar ni borrar.
- Cada acción que modifica datos se guarda **en una transacción junto con su entrada de historial**.

## Endpoints

| Método | Ruta | Permiso |
|---|---|---|
| GET | `/api/health` | — |
| GET | `/api/invoice-types` | — |
| GET | `/api/templates?latest=true` | — |
| GET | `/api/templates/:id/next-version` | — |
| GET | `/api/templates/:id/versions/:v` | — |
| PUT | `/api/templates/:id/versions/:v` (guardar borrador) | EDIT_TEMPLATES |
| DELETE | `/api/templates/:id/versions/:v` (solo borradores) | EDIT_TEMPLATES |
| POST | `/api/templates/:id/versions/:v/submit` | EDIT_TEMPLATES |
| POST | `/api/templates/:id/versions/:v/approve` | REVIEW_TEMPLATES |
| POST | `/api/templates/:id/versions/:v/reject` `{ comment }` | REVIEW_TEMPLATES |
| POST | `/api/templates/:id/versions/:v/export` | TRANSFER_TEMPLATES |
| POST | `/api/templates/import` | TRANSFER_TEMPLATES |
| GET | `/api/active-templates` | — |
| GET | `/api/active-templates/:tipo/template` | — |
| PUT | `/api/active-templates/:tipo` `{ templateId, version }` | ACTIVATE_TEMPLATES |
| GET | `/api/template-history?period=&search=&limit=` | — |
| GET | `/api/print-logs?period=&search=&limit=` | — |
| GET | `/api/print-logs/count?invoiceId=` | — |
| POST | `/api/print-logs` | PRINT_INVOICES |
| GET | `/api/invoices/:numero` (proxy a Dynamics) | PRINT_INVOICES |

Roles: `DISENADOR` (editar, enviar, importar/exportar, imprimir) y `GERENTE` (todo).

## Autenticación (simulada)

Hoy el usuario llega en las cabeceras `X-User-Email` y `X-User-Role`, que envía el frontend con el
selector "Rol (simulado)". **Antes de producción** hay que sustituirlo por el inicio de sesión de la
empresa: solo cambia `resolveUser` en `src/common/auth/mock-auth.guard.ts`; los endpoints y
`@RequirePermission` siguen igual.

## API de Dynamics

`DYNAMICS_API_URL` (con `{numero}`) y `DYNAMICS_API_TOKEN` en `.env`. El token se queda en el
servidor. Por defecto apunta a la API simulada (`npm run mock-api` en la raíz). El JSON se devuelve
tal cual; la traducción a los campos de la plantilla está en el frontend
(`src/services/invoiceApi/dynamicsInvoiceMapper.js`).
