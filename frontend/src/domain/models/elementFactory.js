/**
 * @file Fábrica de bloques (elementos) del lienzo.
 *
 * Capa: DOMINIO. Reúne en un solo lugar las reglas para crear, duplicar y
 * medir bloques, que antes estaban repetidas en el store, el lienzo, el
 * toolbox y los hooks de arrastre (valores como 57, 200, 350 o 120 escritos
 * a mano en varios archivos).
 */

import { fitRectToSheet, getPaperDimensions } from '../constants/paperSizes';

/** Hoja por defecto (Carta vertical) cuando no se indica ninguna. */
const DEFAULT_SHEET = getPaperDimensions();

/** Tamaño por defecto de un bloque cuando no se especifica. */
export const DEFAULT_ELEMENT_SIZE = { width: 350, height: 120 };

/** Posición por defecto (≈15mm del borde izquierdo, bajo el membrete). */
export const DEFAULT_ELEMENT_POSITION = { x: 57, y: 200 };

/** Grosor (px) y color por defecto de un bloque de línea. */
export const LINE_DEFAULTS = { thickness: 1, color: '#000000' };

/** Separación vertical al apilar un bloque nuevo bajo el último. */
const STACK_OFFSET_Y = 30;

/** Desfase aplicado a un bloque duplicado para que no quede encima del original. */
const DUPLICATE_OFFSET = 20;

const isNumber = (value) => typeof value === 'number' && Number.isFinite(value);

/**
 * Genera un id único para un bloque. Se añade un sufijo aleatorio porque
 * `Date.now()` por sí solo puede repetirse si se insertan dos bloques en el
 * mismo milisegundo.
 *
 * @param {string} type Tipo del bloque (se usa como prefijo legible).
 * @returns {string}
 */
export const generateElementId = (type = 'block') =>
  `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/**
 * Devuelve la geometría (x, y, width, height) de un bloque, completando con
 * los valores por defecto los datos que falten.
 *
 * @param {Object} element
 * @returns {{x:number, y:number, width:number, height:number}}
 */
export const getElementRect = (element) => ({
  x: isNumber(element.x) ? element.x : DEFAULT_ELEMENT_POSITION.x,
  y: isNumber(element.y) ? element.y : DEFAULT_ELEMENT_POSITION.y,
  width: isNumber(element.width) ? element.width : DEFAULT_ELEMENT_SIZE.width,
  height: isNumber(element.height) ? element.height : DEFAULT_ELEMENT_SIZE.height,
});

/**
 * Calcula la Y por defecto para un bloque nuevo: justo debajo del bloque
 * situado más abajo. Si se sale de la hoja, `fitRectToSheet` lo recoloca.
 *
 * @param {Object[]} existingElements
 * @returns {number}
 */
const getNextStackY = (existingElements) => {
  if (existingElements.length === 0) return DEFAULT_ELEMENT_POSITION.y;
  const lowestY = Math.max(...existingElements.map((el) => getElementRect(el).y));
  return lowestY + STACK_OFFSET_Y;
};

/**
 * Crea un bloque completo a partir de datos parciales (los que llegan del
 * toolbox o de un "drop" en el lienzo). Asigna id y geometría si faltan y lo
 * ajusta para que quepa en la hoja (p. ej. una tabla de 702px en media carta).
 *
 * @param {Object}   data             Datos parciales del bloque (al menos `type`).
 * @param {Object[]} existingElements Bloques ya presentes en la hoja.
 * @param {{widthPx:number, heightPx:number}} [sheet] Medidas de la hoja.
 * @returns {Object} Bloque listo para añadirse a la plantilla.
 */
export const createElement = (data, existingElements = [], sheet = DEFAULT_SHEET) => {
  const rect = fitRectToSheet(
    {
      x: isNumber(data.x) ? data.x : DEFAULT_ELEMENT_POSITION.x,
      y: isNumber(data.y) ? data.y : getNextStackY(existingElements),
      width: isNumber(data.width) ? data.width : DEFAULT_ELEMENT_SIZE.width,
      height: isNumber(data.height) ? data.height : DEFAULT_ELEMENT_SIZE.height,
    },
    sheet,
  );

  return {
    // Copia profunda: los datos del toolbox referencian constantes compartidas
    // (columnas, renglones…) que no deben quedar ligadas al bloque.
    ...structuredClone(data),
    id: data.id ?? generateElementId(data.type),
    ...rect,
  };
};

/**
 * Crea una copia independiente de un bloque, con nuevo id, título "(Copia)"
 * y un pequeño desfase dentro de los límites de la hoja.
 * Se usa `structuredClone` para que arreglos internos (campos, columnas,
 * renglones) no queden compartidos entre original y copia.
 *
 * @param {Object} element
 * @param {{widthPx:number, heightPx:number}} [sheet] Medidas de la hoja.
 * @returns {Object}
 */
export const duplicateElementData = (element, sheet = DEFAULT_SHEET) => {
  const rect = getElementRect(element);
  return {
    ...structuredClone(element),
    id: generateElementId(element.type),
    title: `${element.title || 'Bloque'} (Copia)`,
    ...fitRectToSheet({ ...rect, x: rect.x + DUPLICATE_OFFSET, y: rect.y + DUPLICATE_OFFSET }, sheet),
  };
};

/**
 * Indica si un bloque se sale de la hoja (p. ej. tras cambiar a un papel más pequeño).
 * @param {Object} element
 * @param {{widthPx:number, heightPx:number}} sheet
 * @returns {boolean}
 */
export const isElementOutsideSheet = (element, sheet) => {
  const rect = getElementRect(element);
  return rect.x + rect.width > sheet.widthPx || rect.y + rect.height > sheet.heightPx;
};
