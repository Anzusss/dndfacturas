/**
 * @file Catálogo de campos de una factura: el "contrato" de datos.
 *
 * Capa: DOMINIO. Son los nombres (rutas) que las plantillas pueden usar y
 * que la capa de traducción de la API (`services/invoiceApi/dynamicsInvoiceMapper.js`)
 * se compromete a rellenar a partir del JSON de Dynamics.
 *
 * `format` indica cómo mostrar el valor si la API lo envía como número:
 * - 'usd'      → US$ 1,234.56
 * - 'ves'      → Bs 1.234,56
 * - 'quantity' → 20,000
 * Si la API envía texto ya formateado, se muestra tal cual.
 */

/**
 * @typedef {Object} InvoiceField
 * @property {string} key     Ruta del dato en InvoiceData (p. ej. `rif` o `totales.ivaUsd`).
 * @property {string} label   Etiqueta legible.
 * @property {'usd'|'ves'|'quantity'} [format]
 */

/** Campos de cabecera (datos del cliente y del documento). @type {InvoiceField[]} */
export const DYNAMICS_VARIABLES = [
  { key: 'cliente', label: 'Cliente' },
  { key: 'rif', label: 'RIF/C.I.' },
  { key: 'direccion', label: 'Dirección Fiscal' },
  { key: 'telefono', label: 'Teléfono' },
  { key: 'facturaNo', label: 'Factura No.' },
  { key: 'fecha', label: 'Fecha de Emisión' },
  { key: 'fechaVencimiento', label: 'Fecha de Vencimiento' },
  { key: 'pago', label: 'Condición de Pago' },
  { key: 'moneda', label: 'Moneda' },
  { key: 'tasaCambio', label: 'Tasa BCV' },
  { key: 'municipio', label: 'Municipio' },
  { key: 'montoIgtfBs', label: 'Monto Estimado IGTF (Bs.)', format: 'ves' },
];

/** Campos de cada renglón (`items[]`) de la tabla. @type {InvoiceField[]} */
export const ITEM_FIELDS = [
  { key: 'cantidad', label: 'Cantidad', format: 'quantity' },
  { key: 'um', label: 'Unidad de medida' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'precioUsd', label: 'Precio / Tarifa (US$)', format: 'usd' },
  { key: 'precioBs', label: 'Precio / Tarifa (Bs.)', format: 'ves' },
  { key: 'subtotalUsd', label: 'Sub-total (US$)', format: 'usd' },
  { key: 'subtotalBs', label: 'Sub-total (Bs.)', format: 'ves' },
];

/** Campos de totales. @type {InvoiceField[]} */
export const TOTAL_FIELDS = [
  { key: 'totales.baseImponibleUsd', label: 'Base imponible (US$)', format: 'usd' },
  { key: 'totales.baseImponibleBs', label: 'Base imponible (Bs.)', format: 'ves' },
  { key: 'totales.ivaUsd', label: 'I.V.A. (US$)', format: 'usd' },
  { key: 'totales.ivaBs', label: 'I.V.A. (Bs.)', format: 'ves' },
  { key: 'totales.exentoUsd', label: 'Exento (US$)', format: 'usd' },
  { key: 'totales.exentoBs', label: 'Exento (Bs.)', format: 'ves' },
  { key: 'totales.totalGeneralUsd', label: 'Total general (US$)', format: 'usd' },
  { key: 'totales.totalGeneralBs', label: 'Total general (Bs.)', format: 'ves' },
  { key: 'totales.igtfUsd', label: 'I.G.T.F. (US$)', format: 'usd' },
  { key: 'totales.igtfBs', label: 'I.G.T.F. (Bs.)', format: 'ves' },
];

/** Crea un índice por clave para búsquedas O(1). */
const indexByKey = (fields) => Object.fromEntries(fields.map((field) => [field.key, field]));

/** @type {Record<string, InvoiceField>} */
export const DYNAMICS_VARIABLES_BY_KEY = indexByKey(DYNAMICS_VARIABLES);
/** @type {Record<string, InvoiceField>} */
export const ITEM_FIELDS_BY_KEY = indexByKey(ITEM_FIELDS);
/** @type {Record<string, InvoiceField>} */
export const TOTAL_FIELDS_BY_KEY = indexByKey(TOTAL_FIELDS);

/**
 * Devuelve la etiqueta que se imprime delante de un campo en un bloque Grid.
 * Añade ":" salvo que la etiqueta ya termine en "No." (p. ej. "Factura No."),
 * para evitar resultados como "Factura No.:".
 *
 * @param {string} label
 * @returns {string}
 */
export const formatFieldLabel = (label) => (label.endsWith('No.') ? label : `${label}:`);
