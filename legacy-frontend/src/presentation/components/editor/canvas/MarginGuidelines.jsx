/**
 * @file Zonas reservadas de margen físico (franjas ámbar) sobre la hoja:
 * - Superior: espacio del membrete pre-impreso.
 * - Inferior: espacio para firmas, sellos fiscales o colectas.
 *
 * Las medidas llegan en mm desde `pageSetup` y se convierten a px.
 * Llevan la clase `no-print`, por lo que nunca salen en la impresión.
 */

import { mmToPx, parseMm } from '@/utils/units';
import { PAPER_DIMENSIONS } from '@/domain/constants/paperDimensions';

/**
 * Franja de margen reutilizable para la zona superior o inferior.
 * @param {Object} props
 * @param {'top'|'bottom'} props.position
 * @param {number} props.heightPx
 * @param {string} props.label
 */
const MarginZone = ({ position, heightPx, label }) => {
  if (heightPx <= 0) return null;

  const positionClasses =
    position === 'top'
      ? 'top-0 border-b-2 items-end pb-1'
      : 'bottom-0 border-t-2 items-start pt-1';

  return (
    <div
      className={`no-print absolute left-0 right-0 ${positionClasses} border-dashed border-amber-400 bg-amber-500/5 pointer-events-none flex justify-center text-[10px] font-mono text-amber-700 font-semibold tracking-wider uppercase z-0`}
      style={{ height: `${heightPx}px` }}
    >
      {label}
    </div>
  );
};

/**
 * @param {Object} props
 * @param {string} [props.paddingTop]    Margen superior, p. ej. "50mm".
 * @param {string} [props.paddingBottom] Margen inferior, p. ej. "40mm".
 */
export const MarginGuidelines = ({ paddingTop, paddingBottom }) => {
  const topMm = parseMm(paddingTop, PAPER_DIMENSIONS.MARGIN_TOP_MM);
  const bottomMm = parseMm(paddingBottom, PAPER_DIMENSIONS.MARGIN_BOTTOM_MM);

  return (
    <>
      <MarginZone
        position="top"
        heightPx={mmToPx(topMm)}
        label={`▲ Zona Reservada para Membrete Físico (${topMm} mm) ▲`}
      />
      <MarginZone
        position="bottom"
        heightPx={mmToPx(bottomMm)}
        label={`▼ Zona Reservada para Pie / Firmas / Colectas (${bottomMm} mm) ▼`}
      />
    </>
  );
};
