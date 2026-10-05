/**
 * @file Contrato de arrastre entre el Toolbox (origen) y el lienzo (destino).
 *
 * Ambos lados usan estas funciones para que el formato del `dataTransfer`
 * esté definido en un único sitio.
 */

/** Tipo MIME con el que viaja el bloque arrastrado. */
const TOOLBOX_DRAG_FORMAT = 'application/json';

/**
 * Guarda los datos del bloque en el evento `dragstart`.
 * @param {DragEvent} event
 * @param {Object} payload Datos parciales del bloque a crear.
 */
export const writeDragPayload = (event, payload) => {
  event.dataTransfer.setData(TOOLBOX_DRAG_FORMAT, JSON.stringify(payload));
  event.dataTransfer.effectAllowed = 'copy';
};

/**
 * Lee los datos del bloque en el evento `drop`.
 * @param {DragEvent} event
 * @returns {Object|null} `null` si lo soltado no viene del Toolbox o no es JSON válido.
 */
export const readDragPayload = (event) => {
  const raw = event.dataTransfer.getData(TOOLBOX_DRAG_FORMAT);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Datos de arrastre no válidos:', error);
    return null;
  }
};
