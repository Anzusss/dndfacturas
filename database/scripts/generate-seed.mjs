/**
 * @file Genera `database/init/02_seed.sql` a partir del código del dominio.
 *
 * Así los datos iniciales de la base de datos (tipos de factura, plantillas
 * por defecto y su activación) son EXACTAMENTE los mismos que usa el frontend,
 * sin copiar JSON a mano.
 *
 * Uso:  npm run db:seed
 * Vuelve a ejecutarlo si cambian las plantillas por defecto o los tipos de factura,
 * y recrea la base de datos (docker compose down -v && docker compose up -d).
 *
 * Usa el cargador de módulos de Vite para poder importar el código de `src/`
 * tal cual (alias "@/", imports sin extensión).
 */

import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const OUTPUT = fileURLToPath(new URL('../init/02_seed.sql', import.meta.url));

/** Escapa un texto como literal SQL: 'O''Brien'. */
const sqlText = (value) => (value === null || value === undefined ? 'NULL' : `'${String(value).replace(/'/g, "''")}'`);

/** JSON como literal JSONB (con comillas simples escapadas). */
const sqlJson = (value) => `${sqlText(JSON.stringify(value))}::jsonb`;

/** Array de texto de PostgreSQL: ARRAY['A','B']::text[]. */
const sqlTextArray = (values) => `ARRAY[${values.map(sqlText).join(', ')}]::text[]`;

const vite = await createServer({
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});

try {
  const { INVOICE_TYPE_LIST, INVOICE_TYPE_LABELS } = await vite.ssrLoadModule('/src/domain/constants/invoiceTypes.js');
  const { INVOICE_TYPE_ALIASES } = await vite.ssrLoadModule('/src/services/invoiceApi/dynamicsInvoiceMapper.js');
  const { createDefaultInvoiceTemplate, createDefaultContadoTemplate } = await vite.ssrLoadModule(
    '/src/domain/models/invoiceTemplate.js',
  );

  const templates = [createDefaultInvoiceTemplate(), createDefaultContadoTemplate()];

  const invoiceTypesSql = INVOICE_TYPE_LIST.map(
    (code) => `  (${sqlText(code)}, ${sqlText(INVOICE_TYPE_LABELS[code])}, ${sqlTextArray(INVOICE_TYPE_ALIASES[code] ?? [])})`,
  ).join(',\n');

  const templatesSql = templates
    .map(
      (t) => `  (${sqlText(t.templateId)}, ${t.version}, ${sqlText(t.name)}, ${sqlText(t.invoiceType)}, ${sqlText(t.status)},
   ${t.schemaVersion}, ${sqlJson(t.pageSetup)},
   ${sqlJson(t.elements)},
   ${sqlText(t.updatedBy)}, ${sqlText(t.updatedBy)}, ${sqlText(t.approvedBy)}, now())`,
    )
    .join(',\n');

  const activeSql = templates
    .map((t) => `  (${sqlText(t.invoiceType)}, ${sqlText(t.templateId)}, ${t.version}, 'sistema')`)
    .join(',\n');

  const historySql = templates
    .flatMap((t) => [
      `  (${sqlText(t.templateId)}, ${t.version}, ${sqlText(t.name)}, ${sqlText(t.invoiceType)}, 'CREADA', 'sistema', 'Plantilla inicial')`,
      `  (${sqlText(t.templateId)}, ${t.version}, ${sqlText(t.name)}, ${sqlText(t.invoiceType)}, 'APROBADA', 'sistema', NULL)`,
      `  (${sqlText(t.templateId)}, ${t.version}, ${sqlText(t.name)}, ${sqlText(t.invoiceType)}, 'ACTIVADA', 'sistema', ${sqlText(`Activa para facturas de ${INVOICE_TYPE_LABELS[t.invoiceType]}`)})`,
    ])
    .join(',\n');

  const sql = `-- =============================================================================
-- dndFacturas · Datos iniciales
--
-- ARCHIVO GENERADO por database/scripts/generate-seed.mjs (npm run db:seed).
-- No lo edites a mano: cambia el código del dominio y vuelve a generarlo.
--
-- Se ejecuta automáticamente después de 01_schema.sql al crear la base de datos.
-- =============================================================================

BEGIN;

-- Tipos de factura y sus códigos en Dynamics
INSERT INTO invoice_types (code, label, dynamics_aliases) VALUES
${invoiceTypesSql};

-- Plantillas por defecto (versión 1, aprobadas)
INSERT INTO invoice_templates (
  template_id, version, name, invoice_type, status,
  schema_version, page_setup,
  elements,
  created_by, updated_by, approved_by, approved_at
) VALUES
${templatesSql};

-- Plantilla activa de cada tipo
INSERT INTO active_templates (invoice_type, template_id, template_version, activated_by) VALUES
${activeSql};

-- Historial inicial
INSERT INTO template_history (template_id, version, template_name, invoice_type, action, user_email, comment) VALUES
${historySql};

COMMIT;
`;

  await writeFile(OUTPUT, sql, 'utf8');
  console.log(`Generado ${OUTPUT} (${templates.length} plantillas, ${INVOICE_TYPE_LIST.length} tipos de factura).`);
} finally {
  await vite.close();
}
