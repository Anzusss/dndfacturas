/**
 * @file Formato de valores para mostrarlos en la factura.
 *
 * Capa: UTILIDADES. Si la API envía importes como NÚMEROS, aquí se les da el
 * formato fiscal; si los envía como TEXTO ya formateado, se respetan tal cual.
 */

const USD_FORMAT = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const VES_FORMAT = new Intl.NumberFormat('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const QUANTITY_FORMAT = new Intl.NumberFormat('es-VE', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
const DEFAULT_NUMBER_FORMAT = new Intl.NumberFormat('es-VE', { maximumFractionDigits: 4 });

/** @param {number} amount @returns {string} p. ej. "US$ 1,234.56" */
export const formatUsd = (amount) => `US$ ${USD_FORMAT.format(amount)}`;

/** @param {number} amount @returns {string} p. ej. "Bs 223.709,76" */
export const formatVes = (amount) => `Bs ${VES_FORMAT.format(amount)}`;

/** @param {number} quantity @returns {string} p. ej. "20,000" */
export const formatQuantity = (quantity) => QUANTITY_FORMAT.format(quantity);

/**
 * Convierte un valor de la factura en el texto a imprimir.
 *
 * @param {any} value
 * @param {'usd'|'ves'|'quantity'} [format] Formato del campo (ver catálogo de campos).
 * @returns {string} Cadena vacía si no hay valor.
 */
export const formatBoundValue = (value, format) => {
  if (value === undefined || value === null) return '';
  if (typeof value !== 'number') return String(value);

  switch (format) {
    case 'usd':
      return formatUsd(value);
    case 'ves':
      return formatVes(value);
    case 'quantity':
      return formatQuantity(value);
    default:
      return DEFAULT_NUMBER_FORMAT.format(value);
  }
};
