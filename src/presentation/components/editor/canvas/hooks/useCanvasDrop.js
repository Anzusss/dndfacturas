/**
 * @file Hook que convierte la hoja en zona de destino para bloques
 * arrastrados desde el Toolbox.
 */

import { useEditorStore } from '@/store/useEditorStore';
import { getPaperDimensions } from '@/domain/constants/paperSizes';
import { DEFAULT_ELEMENT_SIZE } from '@/domain/models/elementFactory';
import { readDragPayload } from '../../dragAndDrop';

/** Distancia mínima (px) entre el bloque soltado y el borde de la hoja. */
const DROP_EDGE_PADDING = 10;

/** Limita un valor al rango [min, max]. */
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * @param {import('react').RefObject<HTMLElement>} sheetRef Referencia a la hoja.
 * @returns {{ onDragOver: (e:DragEvent) => void, onDrop: (e:DragEvent) => void }}
 *   Handlers listos para esparcir sobre el elemento de la hoja.
 */
export const useCanvasDrop = (sheetRef) => {
  const addElement = useEditorStore((s) => s.addElement);

  /** Permite soltar y muestra el cursor de "copiar". */
  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  };

  /**
   * Crea el bloque en la posición del cursor. Como la hoja está escalada con
   * `transform: scale(zoom)`, las coordenadas de pantalla se dividen por el
   * zoom para obtener coordenadas reales de la hoja.
   */
  const onDrop = (event) => {
    event.preventDefault();
    const { previewMode, zoom, template } = useEditorStore.getState();
    if (previewMode) return;

    const data = readDragPayload(event);
    const sheetRect = sheetRef.current?.getBoundingClientRect();
    if (!data || !sheetRect) return;

    // Medidas de la hoja actual; el bloque nunca puede ser más grande que ella.
    const sheet = getPaperDimensions(template.pageSetup);
    const width = Math.min(data.width ?? DEFAULT_ELEMENT_SIZE.width, sheet.widthPx);
    const height = Math.min(data.height ?? DEFAULT_ELEMENT_SIZE.height, sheet.heightPx);
    const rawX = (event.clientX - sheetRect.left) / zoom;
    const rawY = (event.clientY - sheetRect.top) / zoom;

    addElement({
      ...data,
      width,
      height,
      // Mantiene el bloque completamente dentro de la hoja.
      x: clamp(Math.round(rawX), 0, Math.max(0, sheet.widthPx - width - DROP_EDGE_PADDING)),
      y: clamp(Math.round(rawY), 0, Math.max(0, sheet.heightPx - height - DROP_EDGE_PADDING)),
    });
  };

  return { onDragOver, onDrop };
};
