/**
 * @file Resumen (solo lectura) de las filas del bloque de totales y del
 * campo de la factura al que está enlazado cada importe.
 */

import { Info } from 'lucide-react';
import { DEFAULT_TOTALS_ROWS } from '@/domain/models/sampleData';
import { TOTAL_FIELDS_BY_KEY } from '@/domain/constants/dynamicsVariables';
import { PropertySection } from './PropertySection';

/** Etiqueta legible del campo enlazado (o el texto fijo si no hay enlace). */
const describeBinding = (key, fallback) => (key ? TOTAL_FIELDS_BY_KEY[key]?.label ?? key : fallback ?? '—');

/**
 * @param {Object} props
 * @param {Object} props.element Bloque de tipo TOTALS.
 */
export const TotalsProperties = ({ element }) => {
  const rows = element.totalsRows ?? DEFAULT_TOTALS_ROWS;

  return (
    <PropertySection title="Renglones de Liquidación (US$ / Bs.)">
      <div className="space-y-1.5 text-[11px]">
        {rows.map((row, index) => (
          <div key={index} className="border-b border-neutral-200 pb-1">
            <div className="font-medium text-neutral-700">{row.label}</div>
            <div className="font-mono text-[10px] text-neutral-500">
              {describeBinding(row.usdKey, row.usd)} · {describeBinding(row.bsKey, row.bs)}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-1.5 flex items-start gap-1.5 text-[10.5px] text-muted">
        <Info className="w-3.5 h-3.5 text-primary-500 shrink-0 mt-0.5" />
        <span>Los importes se toman de la factura de Dynamics al imprimir.</span>
      </div>
    </PropertySection>
  );
};
