/**
 * @file Modelo de columnas de la tabla de renglones.
 *
 * Capa: DOMINIO. Cada columna sabe qué campo del renglón muestra (`field`,
 * una clave de ITEM_FIELDS) y cómo se alinea (`align`), de modo que el
 * cuerpo de la tabla sigue siempre a los encabezados.
 */

/**
 * @typedef {Object} TableColumn
 * @property {string}         label Texto del encabezado.
 * @property {string|null}    field Clave de ITEM_FIELDS (`null` = columna libre, celda vacía).
 * @property {'left'|'right'} align Alineación del contenido.
 */

/** Campos en el orden de las columnas por defecto (para migrar columnas antiguas). */
const DEFAULT_FIELD_ORDER = ['cantidad', 'um', 'descripcion', 'precioUsd', 'subtotalUsd', 'subtotalBs'];

/** Nombres de campo usados en versiones anteriores → nombre actual. */
const LEGACY_FIELD_ALIASES = {
  cant: 'cantidad',
  desc: 'descripcion',
  precio: 'precioUsd',
  subUsd: 'subtotalUsd',
  subBs: 'subtotalBs',
};

/** Columnas estándar de la factura fiscal bimonetaria. @type {TableColumn[]} */
export const DEFAULT_TABLE_COLUMNS = [
  { label: 'Cantidad', field: 'cantidad', align: 'left' },
  { label: 'UM', field: 'um', align: 'left' },
  { label: 'Descripción del Bien/Servicio', field: 'descripcion', align: 'left' },
  { label: 'Precio/Tarifa (US$)', field: 'precioUsd', align: 'right' },
  { label: 'Sub-total (US$)', field: 'subtotalUsd', align: 'right' },
  { label: 'Sub-total (Bs.)', field: 'subtotalBs', align: 'right' },
];

/**
 * Crea una columna personalizada sin campo asociado.
 * @param {string} label
 * @returns {TableColumn}
 */
export const createCustomColumn = (label) => ({ label, field: null, align: 'left' });

/**
 * Convierte columnas de versiones anteriores al modelo actual:
 * - strings → objetos (regla heredada: 3 primeras a la izquierda, resto a la derecha);
 * - nombres de campo antiguos (`cant`, `desc`…) → nombres actuales.
 *
 * @param {Array<string|TableColumn>} [columns]
 * @returns {TableColumn[]}
 */
export const normalizeTableColumns = (columns = []) =>
  columns.map((column, index) => {
    if (typeof column === 'string') {
      return { label: column, field: DEFAULT_FIELD_ORDER[index] ?? null, align: index < 3 ? 'left' : 'right' };
    }
    return { ...column, field: LEGACY_FIELD_ALIASES[column.field] ?? column.field ?? null };
  });
