/**
 * @file Tamaños de hoja disponibles para las plantillas.
 *
 * Capa: DOMINIO.
 *
 * La Providencia SNAT/2011/0071 del SENIAT regula el CONTENIDO de las
 * facturas y quién imprime la forma libre, pero no impone un tamaño de papel.
 * En Venezuela las imprentas autorizadas ofrecen sobre todo:
 * - Carta (21,6 × 27,9 cm).
 * - Media carta (21,6 × 14 cm): muy usada en facturas, normalmente en horizontal.
 * - Cuarto de carta (10,8 × 14 cm).
 * - Oficio venezolano (21,6 × 33 cm; distinto del "Legal" de EE. UU., 21,6 × 35,6 cm).
 * Para otros formatos (p. ej. papel continuo) existe la opción "Personalizado".
 *
 * Las medidas se definen en VERTICAL (ancho ≤ alto); la orientación
 * horizontal simplemente intercambia ancho y alto.
 */

import { mmToScreenPx } from './paperDimensions';

export const PAPER_ORIENTATION = {
  PORTRAIT: 'portrait',
  LANDSCAPE: 'landscape',
};

export const PAPER_ORIENTATION_LABELS = {
  [PAPER_ORIENTATION.PORTRAIT]: 'Vertical',
  [PAPER_ORIENTATION.LANDSCAPE]: 'Horizontal',
};

/** Id del tamaño libre, cuyas medidas se guardan en `pageSetup.width` / `minHeight`. */
export const CUSTOM_PAPER_SIZE = 'CUSTOM';

/**
 * @typedef {Object} PaperSize
 * @property {string} id
 * @property {string} label
 * @property {number} widthMm   Ancho en vertical.
 * @property {number} heightMm  Alto en vertical.
 * @property {string} inches    Medida en pulgadas (como se pide en la imprenta).
 * @property {string} defaultOrientation Orientación habitual al elegirlo.
 */

/** @type {PaperSize[]} */
export const PAPER_SIZES = [
  {
    id: 'LETTER',
    label: 'Carta',
    widthMm: 216,
    heightMm: 279,
    inches: '8,5 × 11 in',
    defaultOrientation: PAPER_ORIENTATION.PORTRAIT,
  },
  {
    id: 'HALF_LETTER',
    label: 'Media carta',
    widthMm: 140,
    heightMm: 216,
    inches: '5,5 × 8,5 in',
    defaultOrientation: PAPER_ORIENTATION.LANDSCAPE,
  },
  {
    id: 'QUARTER_LETTER',
    label: 'Cuarto de carta',
    widthMm: 108,
    heightMm: 140,
    inches: '4,25 × 5,5 in',
    defaultOrientation: PAPER_ORIENTATION.PORTRAIT,
  },
  {
    id: 'OFICIO',
    label: 'Oficio',
    widthMm: 216,
    heightMm: 330,
    inches: '8,5 × 13 in',
    defaultOrientation: PAPER_ORIENTATION.PORTRAIT,
  },
];

/** Índice por id. */
export const PAPER_SIZES_BY_ID = Object.fromEntries(PAPER_SIZES.map((size) => [size.id, size]));

/** Límites del tamaño personalizado (mm). */
export const CUSTOM_PAPER_LIMITS_MM = { MIN: 50, MAX_WIDTH: 330, MAX_HEIGHT: 500 };

/** Espacio mínimo imprimible que debe quedar entre los márgenes superior e inferior (mm). */
export const MIN_PRINTABLE_HEIGHT_MM = 20;

/** Extrae el número de un valor tipo "216mm". */
const parseMmValue = (value, fallback) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * @typedef {Object} PaperDimensions
 * @property {string} sizeId
 * @property {string} orientation
 * @property {number} widthMm
 * @property {number} heightMm
 * @property {number} widthPx   Ancho en px de pantalla (96 DPI).
 * @property {number} heightPx  Alto en px de pantalla.
 */

/**
 * Medidas reales de la hoja de una plantilla, según tamaño y orientación.
 * Un tamaño desconocido (datos antiguos o importados) se trata como Carta.
 *
 * @param {Object} pageSetup
 * @returns {PaperDimensions}
 */
export const getPaperDimensions = (pageSetup = {}) => {
  let widthMm;
  let heightMm;
  let sizeId = pageSetup.size;
  const orientation = pageSetup.orientation ?? PAPER_ORIENTATION.PORTRAIT;

  if (sizeId === CUSTOM_PAPER_SIZE) {
    widthMm = parseMmValue(pageSetup.width, 216);
    heightMm = parseMmValue(pageSetup.minHeight, 279);
  } else {
    const size = PAPER_SIZES_BY_ID[sizeId] ?? PAPER_SIZES_BY_ID.LETTER;
    sizeId = size.id;
    const isLandscape = orientation === PAPER_ORIENTATION.LANDSCAPE;
    widthMm = isLandscape ? size.heightMm : size.widthMm;
    heightMm = isLandscape ? size.widthMm : size.heightMm;
  }

  return {
    sizeId,
    orientation,
    widthMm,
    heightMm,
    widthPx: mmToScreenPx(widthMm),
    heightPx: mmToScreenPx(heightMm),
  };
};

/**
 * Cambios de `pageSetup` para un nuevo tamaño/orientación. Mantiene
 * `width` y `minHeight` con las medidas reales (se leen desde otros sistemas).
 *
 * @param {Object} params
 * @param {string} params.size
 * @param {string} [params.orientation]
 * @param {number} [params.customWidthMm]  Solo para CUSTOM.
 * @param {number} [params.customHeightMm] Solo para CUSTOM.
 * @returns {Object} Campos a mezclar en `pageSetup`.
 */
export const buildPaperSetup = ({ size, orientation, customWidthMm, customHeightMm }) => {
  const isCustom = size === CUSTOM_PAPER_SIZE;
  const base = isCustom
    ? { size, orientation: PAPER_ORIENTATION.PORTRAIT, width: `${customWidthMm}mm`, minHeight: `${customHeightMm}mm` }
    : { size, orientation: orientation ?? PAPER_SIZES_BY_ID[size]?.defaultOrientation ?? PAPER_ORIENTATION.PORTRAIT };

  const dims = getPaperDimensions(base);
  return { ...base, width: `${dims.widthMm}mm`, minHeight: `${dims.heightMm}mm` };
};

/**
 * Texto descriptivo de la hoja, p. ej. "Media carta · Horizontal (216 × 140 mm)".
 * @param {Object} pageSetup
 * @returns {string}
 */
export const describePaper = (pageSetup) => {
  const dims = getPaperDimensions(pageSetup);
  const label = dims.sizeId === CUSTOM_PAPER_SIZE ? 'Personalizado' : PAPER_SIZES_BY_ID[dims.sizeId].label;
  const orientation = dims.sizeId === CUSTOM_PAPER_SIZE ? '' : ` · ${PAPER_ORIENTATION_LABELS[dims.orientation]}`;
  return `${label}${orientation} (${dims.widthMm} × ${dims.heightMm} mm)`;
};

/**
 * Ajusta un rectángulo para que quede completamente dentro de la hoja
 * (reduce el tamaño si no cabe y lo desplaza hacia dentro).
 *
 * @param {{x:number, y:number, width:number, height:number}} rect
 * @param {{widthPx:number, heightPx:number}} sheet
 */
export const fitRectToSheet = (rect, sheet) => {
  const width = Math.min(rect.width, sheet.widthPx);
  const height = Math.min(rect.height, sheet.heightPx);
  return {
    width,
    height,
    x: Math.max(0, Math.min(rect.x, sheet.widthPx - width)),
    y: Math.max(0, Math.min(rect.y, sheet.heightPx - height)),
  };
};
