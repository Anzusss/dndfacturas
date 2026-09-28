/**
 * @file Bloque de liquidación fiscal bimonetaria en 3 columnas:
 * [Concepto] [Importe US$] [Importe Bs.]
 *
 * Cada importe sale de un campo de la factura (`usdKey`, `bsKey`). Las filas
 * sin campo (texto fijo heredado) muestran su texto `usd` / `bs`.
 */

import { Fragment } from 'react';
import { DEFAULT_TOTALS_ROWS } from '@/domain/models/sampleData';
import { displayField } from '../bindings';

/**
 * Valor de una celda: el campo enlazado o, si no hay, el texto fijo.
 * @param {Object} data
 * @param {string} [key]      Ruta del campo.
 * @param {string} [fallback] Texto fijo.
 * @param {'usd'|'ves'} format
 */
const cellValue = (data, key, fallback, format) => (key ? displayField(data, key, format) : fallback ?? '');

/**
 * @param {Object} props
 * @param {Object} props.element
 * @param {Array<{label:string, usdKey?:string, bsKey?:string, isBold?:boolean}>} [props.element.totalsRows]
 * @param {Object} props.data Datos de la factura.
 */
export const TotalsBlock = ({ element, data }) => {
  const rows = element.totalsRows ?? DEFAULT_TOTALS_ROWS;

  return (
    <div className="w-full h-full p-2 flex flex-col justify-end text-[12px] text-black">
      <div
        className="grid text-[12px] text-right pt-2"
        style={{ gridTemplateColumns: 'auto 100px 120px', rowGap: '5px' }}
      >
        {rows.map((row, index) => {
          const weight = row.isBold ? 'font-bold' : '';
          return (
            <Fragment key={index}>
              <div className={`text-left pr-2 ${weight}`}>{row.label}</div>
              <div className={weight}>{cellValue(data, row.usdKey, row.usd, 'usd')}</div>
              <div className={weight}>{cellValue(data, row.bsKey, row.bs, 'ves')}</div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
