import React from 'react';

/**
 * Valores por defecto para el bloque de totales en caso de que la plantilla
 * no especifique una lista personalizada de renglones de liquidación.
 * Muestra el formato bimonetario requerido para facturación en Venezuela (US$ / Bs.).
 */
const DEFAULT_TOTALS = [
  { label: 'Base Imponible:', usd: 'US$ 0.00', bs: 'Bs 0,00' },
  { label: 'I.V.A. 16%:', usd: 'US$ 0.00', bs: 'Bs 0,00' },
  { label: 'Exento:', usd: 'US$ 0.00', bs: 'Bs 0,00' },
  { label: 'Total General:', usd: 'US$ 564.40', bs: 'Bs 223.709,76', isBold: true },
  { label: 'I.G.T.F. 3%:', usd: 'US$ 16.93', bs: 'Bs 6.711,29' },
];

/**
 * Componente TotalsBlock
 * Renderiza la sección inferior de liquidación fiscal con estructura de 3 columnas:
 * 1. Etiqueta / Concepto del impuesto (ej. Base Imponible, I.V.A., IGTF).
 * 2. Monto expresado en Divisas (US$).
 * 3. Monto expresado en Moneda de curso legal (Bs.).
 *
 * @param {Object} props
 * @param {Object} props.element - Datos y configuración del bloque de totales.
 * @param {boolean} props.previewMode - Si está activo, oculta los metadatos de edición.
 */
export const TotalsBlock = ({ element, previewMode }) => {
  // Usa los renglones configurados en el objeto o el respaldo estándar
  const rows = element.totalsRows || DEFAULT_TOTALS;

  return (
    <div className="w-full h-full p-2 flex flex-col justify-end text-[12px] text-black">

      {/* Grid de liquidación fiscal bimonetaria a 3 columnas */}
      <div
        style={{
          paddingTop: '8px',
          display: 'grid',
          gridTemplateColumns: 'auto 100px 120px', // [Concepto, US$, Bs.]
          rowGap: '5px',
          textAlign: 'right',
        }}
        className="text-[12px]"
      >
        {rows.map((row, idx) => (
          <React.Fragment key={idx}>
            {/* Columna 1: Concepto / Etiqueta */}
            <div className={`text-left pr-2 ${row.isBold ? 'font-bold' : ''}`}>
              {row.label}
            </div>

            {/* Columna 2: Importe en Dólares (US$) */}
            <div className={row.isBold ? 'font-bold' : ''}>
              {row.usd}
            </div>

            {/* Columna 3: Importe en Bolívares (Bs.) */}
            <div className={row.isBold ? 'font-bold' : ''}>
              {row.bs}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
