/**
 * @file Tiradores circulares decorativos en las 4 esquinas del bloque
 * seleccionado (estilo Canva). El redimensionado real lo gestiona react-rnd;
 * estos círculos solo indican visualmente dónde agarrar.
 */

/** Posición de cada esquina. */
const CORNERS = ['-top-1.5 -left-1.5', '-top-1.5 -right-1.5', '-bottom-1.5 -left-1.5', '-bottom-1.5 -right-1.5'];

export const SelectionHandles = () => (
  <>
    {CORNERS.map((position) => (
      <div
        key={position}
        className={`no-print absolute ${position} w-3 h-3 bg-white border-2 border-primary-600 rounded-full shadow-sm pointer-events-none`}
      />
    ))}
  </>
);
