/**
 * @file Cálculo del "imán" (snap) y de las guías inteligentes de alineación.
 *
 * Capa: UTILIDADES. Funciones puras: reciben rectángulos y devuelven la
 * posición/tamaño ajustados y las guías que deben dibujarse.
 *
 * Cada rectángulo aporta 3 líneas por eje: inicio, centro y fin.
 * Mejora respecto a la versión anterior: se elige la línea MÁS CERCANA entre
 * todos los bloques; antes ganaba el último bloque de la lista que estuviera
 * dentro del umbral, aunque hubiera otro más cercano.
 */

/** Distancia en píxeles a partir de la cual se activa el imán. */
export const SNAP_THRESHOLD = 5;

/**
 * @typedef {{x:number, y:number, width:number, height:number, id?:string}} Rect
 * @typedef {{value:number, offset:number}} MovingPoint
 *   `value` es la coordenada del punto del bloque en movimiento y `offset`
 *   su distancia al origen del bloque (0 = borde inicial).
 */

/**
 * Líneas de referencia de un rectángulo en un eje: [inicio, centro, fin].
 * @param {Rect} rect
 * @param {'x'|'y'} axis
 * @returns {number[]}
 */
const getAxisLines = (rect, axis) => {
  const start = axis === 'x' ? rect.x : rect.y;
  const size = axis === 'x' ? rect.width : rect.height;
  return [start, start + size / 2, start + size];
};

/**
 * Puntos del bloque en movimiento que pueden "pegarse" a una línea.
 * @param {Rect} rect
 * @param {'x'|'y'} axis
 * @returns {MovingPoint[]}
 */
const getMovingPoints = (rect, axis) => {
  const start = axis === 'x' ? rect.x : rect.y;
  const size = axis === 'x' ? rect.width : rect.height;
  return [0, size / 2, size].map((offset) => ({ value: start + offset, offset }));
};

/**
 * Busca la combinación punto/línea más cercana dentro del umbral.
 * @param {MovingPoint[]} points
 * @param {number[]} lines
 * @returns {{line:number, offset:number}|null}
 */
const findClosestLine = (points, lines) => {
  let best = null;
  for (const { value, offset } of points) {
    for (const line of lines) {
      const distance = Math.abs(value - line);
      if (distance < SNAP_THRESHOLD && (!best || distance < best.distance)) {
        best = { distance, line, offset };
      }
    }
  }
  return best;
};

/**
 * Reúne las líneas de referencia de todos los rectángulos destino
 * (excluyendo el propio bloque).
 * @param {Rect} block
 * @param {Rect[]} targets
 */
const collectLines = (block, targets) => {
  const others = targets.filter((target) => target.id !== block.id);
  return {
    linesX: others.flatMap((target) => getAxisLines(target, 'x')),
    linesY: others.flatMap((target) => getAxisLines(target, 'y')),
  };
};

/**
 * Ajusta la posición de un bloque que se está ARRASTRANDO.
 *
 * @param {Rect}   block   Bloque en movimiento con su posición actual.
 * @param {Rect[]} targets Rectángulos contra los que alinear (otros bloques, la hoja…).
 * @returns {{snappedX:number, snappedY:number, activeGuideX:number|null, activeGuideY:number|null}}
 */
export const calculateSnap = (block, targets) => {
  const { linesX, linesY } = collectLines(block, targets);
  const snapX = findClosestLine(getMovingPoints(block, 'x'), linesX);
  const snapY = findClosestLine(getMovingPoints(block, 'y'), linesY);

  return {
    snappedX: snapX ? snapX.line - snapX.offset : block.x,
    snappedY: snapY ? snapY.line - snapY.offset : block.y,
    activeGuideX: snapX?.line ?? null,
    activeGuideY: snapY?.line ?? null,
  };
};

/**
 * Ajusta posición y tamaño de un bloque que se está REDIMENSIONANDO.
 * Solo se "imanta" el borde que el usuario arrastra (según `direction`),
 * manteniendo fijo el borde opuesto.
 *
 * @param {Rect}   block     Bloque con su geometría actual.
 * @param {Rect[]} targets   Rectángulos contra los que alinear.
 * @param {string} direction Dirección de react-rnd: 'right', 'topLeft', 'bottomRight'…
 * @returns {{snappedX:number, snappedY:number, snappedWidth:number, snappedHeight:number,
 *            activeGuideX:number|null, activeGuideY:number|null}}
 */
export const calculateResizeSnap = (block, targets, direction) => {
  const { linesX, linesY } = collectLines(block, targets);
  const dir = direction.toLowerCase();

  let { x, y, width, height } = block;
  let activeGuideX = null;
  let activeGuideY = null;

  // Eje X: borde derecho (cambia el ancho) o izquierdo (cambia x y ancho).
  if (dir.includes('right')) {
    const snap = findClosestLine([{ value: x + width, offset: 0 }], linesX);
    if (snap) {
      width = snap.line - x;
      activeGuideX = snap.line;
    }
  } else if (dir.includes('left')) {
    const right = x + width;
    const snap = findClosestLine([{ value: x, offset: 0 }], linesX);
    if (snap) {
      x = snap.line;
      width = right - snap.line; // El borde derecho queda intacto.
      activeGuideX = snap.line;
    }
  }

  // Eje Y: borde inferior (cambia el alto) o superior (cambia y y alto).
  if (dir.includes('bottom')) {
    const snap = findClosestLine([{ value: y + height, offset: 0 }], linesY);
    if (snap) {
      height = snap.line - y;
      activeGuideY = snap.line;
    }
  } else if (dir.includes('top')) {
    const bottom = y + height;
    const snap = findClosestLine([{ value: y, offset: 0 }], linesY);
    if (snap) {
      y = snap.line;
      height = bottom - snap.line; // El borde inferior queda intacto.
      activeGuideY = snap.line;
    }
  }

  return {
    snappedX: x,
    snappedY: y,
    snappedWidth: width,
    snappedHeight: height,
    activeGuideX,
    activeGuideY,
  };
};
