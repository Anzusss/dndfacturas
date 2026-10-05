/**
 * @file Tabla de renglones (ítems) de la factura.
 *
 * Formato fiscal: bordes superior e inferior de 1px en el encabezado, texto
 * alineado a la izquierda e importes a la derecha.
 *
 * Pinta un renglón por cada elemento de `data.items`; cada celda muestra el
 * campo indicado por su columna (`column.field`).
 */

import { ITEM_FIELDS_BY_KEY } from '@/domain/constants/dynamicsVariables';
import { formatBoundValue } from '@/utils/formatters';

/** Clases de alineación de texto según `column.align`. */
const ALIGN_CLASS = { left: 'text-left', right: 'text-right' };

/**
 * @param {Object} props
 * @param {Object} props.element
 * @param {import('@/domain/models/tableColumns').TableColumn[]} props.element.columns
 * @param {Object} props.data Datos de la factura (usa `data.items`).
 */
export const TableBlock = ({ element, data }) => {
  const columns = element.columns ?? [];
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <div className="w-full h-full flex flex-col text-[12px] text-black">
      <table className="w-full border-collapse text-[12px] leading-tight">
        <thead>
          <tr className="border-t border-b border-black font-bold">
            {columns.map((column, index) => (
              <th key={index} className={`py-2 px-1 font-bold ${ALIGN_CLASS[column.align] ?? 'text-left'}`}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex} className={`py-2 px-1 ${ALIGN_CLASS[column.align] ?? 'text-left'}`}>
                  {/* Columnas personalizadas (sin `field`) quedan vacías. */}
                  {column.field ? formatBoundValue(item[column.field], ITEM_FIELDS_BY_KEY[column.field]?.format) : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
