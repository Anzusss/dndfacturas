import React from 'react';
import { mmToPx } from '@/utils/units';

/**
 * Extrae el valor numérico en milímetros de un string tipo "50mm".
 * @param {string|number} value
 * @param {number} fallback
 * @returns {number}
 */
const parseMm = (value, fallback) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

/**
 * Componente MarginGuidelines
 * Dibuja las marcas visuales de los márgenes físicos configurables para papel membretado:
 * - Margen Superior: Reserva el espacio del membrete pre-impreso del cliente.
 * - Margen Inferior: Reserva el espacio para firmas, sellos fiscales o colectas.
 *
 * Las dimensiones se calculan dinámicamente desde pageSetup (mm → px).
 * Estas guías poseen la clase `no-print` para que jamás se impriman en papel físico ni en PDF.
 *
 * @param {Object} props
 * @param {string} props.paddingTop - Margen superior (ej. "50mm").
 * @param {string} props.paddingBottom - Margen inferior (ej. "40mm").
 */
export const MarginGuidelines = ({ paddingTop = '50mm', paddingBottom = '40mm' }) => {
  const topMm = parseMm(paddingTop, 50);
  const bottomMm = parseMm(paddingBottom, 40);

  const topPx = mmToPx(topMm);
  const bottomPx = mmToPx(bottomMm);

  return (
    <>
      {/* Zona reservada superior para membrete físico */}
      {topPx > 0 && (
        <div
          className="no-print absolute top-0 left-0 right-0 border-b-2 border-dashed border-amber-400 bg-amber-500/5 pointer-events-none flex items-end justify-center pb-1 text-[10px] font-mono text-amber-700 font-semibold tracking-wider uppercase z-0"
          style={{ height: `${topPx}px` }}
        >
          ▲ Zona Reservada para Membrete Físico ({topMm} mm) ▲
        </div>
      )}

      {/* Zona reservada inferior para firmas / pie de página */}
      {bottomPx > 0 && (
        <div
          className="no-print absolute bottom-0 left-0 right-0 border-t-2 border-dashed border-amber-400 bg-amber-500/5 pointer-events-none flex items-start justify-center pt-1 text-[10px] font-mono text-amber-700 font-semibold tracking-wider uppercase z-0"
          style={{ height: `${bottomPx}px` }}
        >
          ▼ Zona Reservada para Pie / Firmas / Colectas ({bottomMm} mm) ▼
        </div>
      )}
    </>
  );
};
