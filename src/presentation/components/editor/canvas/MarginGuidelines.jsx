import React from 'react';

/**
 * Componente MarginGuidelines
 * Dibuja las marcas visuales de los márgenes físicos indispensables para papel membretado:
 * - Margen Superior (50 mm ≈ 189 px): Reserva el espacio del membrete pre-impreso del cliente.
 * - Margen Inferior (40 mm ≈ 151 px): Reserva el espacio para firmas, sellos fiscales o colectas.
 *
 * Estas guías poseen la clase `no-print` para que jamás se impriman en papel físico ni en PDF.
 */
export const MarginGuidelines = () => {
  return (
    <>
      {/* Zona reservada superior para membrete físico */}
      <div
        className="no-print absolute top-0 left-0 right-0 border-b-2 border-dashed border-amber-400 bg-amber-500/5 pointer-events-none flex items-end justify-center pb-1 text-[10px] font-mono text-amber-700 font-semibold tracking-wider uppercase z-0"
        style={{ height: '189px' }}
      >
        ▲ Zona Reservada para Membrete Físico (50 mm) ▲
      </div>

      {/* Zona reservada inferior para firmas / pie de página */}
      <div
        className="no-print absolute bottom-0 left-0 right-0 border-t-2 border-dashed border-amber-400 bg-amber-500/5 pointer-events-none flex items-start justify-center pt-1 text-[10px] font-mono text-amber-700 font-semibold tracking-wider uppercase z-0"
        style={{ height: '151px' }}
      >
        ▼ Zona Reservada para Pie / Firmas / Colectas (40 mm) ▼
      </div>
    </>
  );
};
