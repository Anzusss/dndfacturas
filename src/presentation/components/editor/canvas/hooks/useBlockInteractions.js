/**
 * @file Hook con la lógica de arrastre y redimensión de un bloque (react-rnd).
 *
 * Durante el gesto la geometría se guarda en un estado LOCAL (`liveRect`) y
 * solo al soltar se escribe en el store. Así no se re-renderiza toda la hoja
 * en cada movimiento del ratón.
 *
 * - Mantén pulsado Alt mientras arrastras para desactivar el imán.
 * - Los bloques se alinean con los demás bloques y con los bordes/centro de la hoja.
 */

import { useRef, useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { getElementRect } from '@/domain/models/elementFactory';
import { getPaperDimensions } from '@/domain/constants/paperSizes';
import { calculateSnap, calculateResizeSnap } from '@/utils/snapUtils';

const RECT_KEYS = ['x', 'y', 'width', 'height'];

/**
 * Obtiene los destinos de alineación en el momento del gesto.
 * Se lee con `getState()` en lugar de suscribirse a `template.elements`,
 * para que un bloque no se re-renderice cuando se mueve otro.
 */
const getSnapTargets = () => {
  const { elements, pageSetup } = useEditorStore.getState().template;
  const sheet = getPaperDimensions(pageSetup);
  return [
    ...elements.map((el) => ({ id: el.id, ...getElementRect(el) })),
    // La propia hoja como destino de alineación (bordes y centro).
    { id: '__sheet__', x: 0, y: 0, width: sheet.widthPx, height: sheet.heightPx },
  ];
};

/** Redondea la geometría a píxeles enteros antes de persistirla. */
const roundRect = (rect) => Object.fromEntries(RECT_KEYS.map((key) => [key, Math.round(rect[key])]));

/**
 * @param {Object} element Bloque a controlar.
 * @returns {{
 *   rect: {x:number, y:number, width:number, height:number},
 *   handlers: Object
 * }} `rect` es la geometría a pintar (en vivo durante el gesto) y
 *    `handlers` los callbacks para <Rnd>.
 */
export const useBlockInteractions = (element) => {
  const updateElement = useEditorStore((s) => s.updateElement);
  const setGuideLines = useEditorStore((s) => s.setGuideLines);
  const clearGuideLines = useEditorStore((s) => s.clearGuideLines);

  // Estado para pintar + ref con el último valor. La ref evita leer un valor
  // obsoleto en `onDragStop` si React aún no ha re-renderizado tras el último `onDrag`.
  const [liveRect, setLiveRectState] = useState(null);
  const liveRectRef = useRef(null);

  const setLiveRect = (rect) => {
    liveRectRef.current = rect;
    setLiveRectState(rect);
  };

  const baseRect = getElementRect(element);

  /** Persiste la geometría final (solo si cambió) y limpia el estado del gesto. */
  const commit = (finalRect) => {
    const rounded = roundRect(finalRect);
    const changed = RECT_KEYS.some((key) => rounded[key] !== baseRect[key]);
    // Un simple clic también dispara onDragStop; así se evita una escritura inútil en el store.
    if (changed) updateElement(element.id, rounded);

    setLiveRect(null);
    clearGuideLines();
  };

  /** Arrastre: calcula el imán y muestra las guías. */
  const onDrag = (event, data) => {
    const moved = { ...baseRect, x: data.x, y: data.y };

    if (event.altKey) {
      setLiveRect(moved);
      clearGuideLines();
      return;
    }

    const snap = calculateSnap({ id: element.id, ...moved }, getSnapTargets());
    setLiveRect({ ...moved, x: snap.snappedX, y: snap.snappedY });
    setGuideLines({ x: snap.activeGuideX, y: snap.activeGuideY });
  };

  const onDragStop = (_event, data) => {
    commit(liveRectRef.current ?? { ...baseRect, x: data.x, y: data.y });
  };

  /** Redimensión: `ref.offsetWidth/Height` ya vienen sin escalar por el zoom. */
  const onResize = (event, direction, ref, _delta, position) => {
    const resized = { x: position.x, y: position.y, width: ref.offsetWidth, height: ref.offsetHeight };

    if (event.altKey) {
      setLiveRect(resized);
      clearGuideLines();
      return;
    }

    const snap = calculateResizeSnap({ id: element.id, ...resized }, getSnapTargets(), direction);
    setLiveRect({ x: snap.snappedX, y: snap.snappedY, width: snap.snappedWidth, height: snap.snappedHeight });
    setGuideLines({ x: snap.activeGuideX, y: snap.activeGuideY });
  };

  const onResizeStop = (_event, _direction, ref, _delta, position) => {
    commit(
      liveRectRef.current ?? { x: position.x, y: position.y, width: ref.offsetWidth, height: ref.offsetHeight },
    );
  };

  return {
    rect: liveRect ?? baseRect,
    handlers: { onDrag, onDragStop, onResize, onResizeStop },
  };
};
