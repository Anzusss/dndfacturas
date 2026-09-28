/**
 * @file Tipos de bloques manipulables en el editor visual de facturas.
 *
 * Capa: DOMINIO. No depende de React ni de ninguna librería de UI;
 * cualquier capa superior (store, servicios, presentación) puede importarlo.
 */

/**
 * Identificadores de cada tipo de bloque. El valor es el que se persiste
 * en el JSON de la plantilla (`element.type`).
 */
export const ELEMENT_TYPES = {
  GRID: 'grid',
  TABLE: 'table',
  TOTALS: 'totals',
  TEXT: 'text',
  VARIABLE: 'variable',
  LINE: 'line',
  LOGO: 'logo', // Reservado: aún no tiene componente de renderizado.
};

/**
 * Valores antiguos de `type` que pudieron quedar guardados en localStorage
 * y su equivalente actual. Antes `ELEMENT_TYPES.LINE` no existía y las líneas
 * se guardaban con el literal `'LINE'`.
 */
export const LEGACY_ELEMENT_TYPES = {
  LINE: ELEMENT_TYPES.LINE,
};

/**
 * Nombre legible de cada tipo, usado en el panel de propiedades.
 */
export const ELEMENT_TYPE_LABELS = {
  [ELEMENT_TYPES.GRID]: 'Bloque de datos',
  [ELEMENT_TYPES.TABLE]: 'Tabla de renglones',
  [ELEMENT_TYPES.TOTALS]: 'Totales',
  [ELEMENT_TYPES.TEXT]: 'Texto / Leyenda',
  [ELEMENT_TYPES.VARIABLE]: 'Campo ERP',
  [ELEMENT_TYPES.LINE]: 'Línea',
  [ELEMENT_TYPES.LOGO]: 'Logo',
};

/**
 * Tipos que se dibujan sin fondo blanco en el lienzo para no tapar
 * lo que haya debajo (textos sueltos, variables y líneas).
 */
export const TRANSPARENT_ELEMENT_TYPES = [
  ELEMENT_TYPES.LINE,
  ELEMENT_TYPES.TEXT,
  ELEMENT_TYPES.VARIABLE,
];
