/**
 * @file Tipos de factura que maneja la empresa.
 *
 * Capa: DOMINIO. Cada tipo tiene como máximo UNA plantilla activa, que es la
 * que se usa al imprimir una factura de ese tipo. Para añadir un tipo nuevo
 * basta con agregarlo aquí (y su alias en el mapper de la API si hace falta).
 */

export const INVOICE_TYPES = {
  CREDITO: 'CREDITO',
  CONTADO: 'CONTADO',
};

/** Nombre legible de cada tipo. */
export const INVOICE_TYPE_LABELS = {
  [INVOICE_TYPES.CREDITO]: 'Crédito',
  [INVOICE_TYPES.CONTADO]: 'Contado',
};

/** Lista ordenada de tipos (para selectores y paneles). */
export const INVOICE_TYPE_LIST = Object.values(INVOICE_TYPES);

/**
 * @param {string} type
 * @returns {boolean} `true` si es un tipo de factura conocido.
 */
export const isValidInvoiceType = (type) => INVOICE_TYPE_LIST.includes(type);
