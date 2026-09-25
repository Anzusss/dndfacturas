import React from 'react';
import { Info } from 'lucide-react';

/**
 * Componente TotalsProperties
 * Muestra el resumen de los renglones de liquidación activos del bloque de totales.
 * Informa al usuario sobre la sincronización con Microsoft Dynamics.
 *
 * @param {Object} props
 * @param {Object} props.selectedElement - Elemento tipo TOTALS seleccionado.
 */
export const TotalsProperties = ({ selectedElement }) => {
  const rows = selectedElement.totalsRows || [];

  return (
    <div className="space-y-2 p-3 bg-neutral-50 rounded-lg border border-neutral-200 text-xs">
      <span className="text-[11px] font-semibold text-neutral-700 block mb-1">
        Renglones de Liquidación (US$ / Bs.)
      </span>

      {/* Lista de conceptos cargados en el bloque */}
      <div className="space-y-1 font-mono text-[11px] text-neutral-600">
        {rows.map((r, idx) => (
          <div key={idx} className="flex justify-between border-b border-neutral-200 py-0.5">
            <span className="font-sans text-neutral-700">{r.label}</span>
            <span>{r.usd}</span>
          </div>
        ))}
      </div>

      {/* Nota informativa */}
      <div className="pt-1.5 flex items-start gap-1.5 text-[10.5px] text-muted">
        <Info className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
        <span>Los valores se sincronizan automáticamente con Microsoft Dynamics.</span>
      </div>
    </div>
  );
};
