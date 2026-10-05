/**
 * @file Bloque de pares etiqueta/valor (datos del cliente, control del
 * documento…). Cada campo de `element.fields` es una clave del catálogo de
 * variables de cabecera.
 */

import { Fragment } from 'react';
import { DYNAMICS_VARIABLES_BY_KEY, formatFieldLabel } from '@/domain/constants/dynamicsVariables';
import { displayField } from '../bindings';

/**
 * Ancho de la columna de etiquetas. El bloque de control de documento
 * (Factura No., Fecha, Pago) usa etiquetas algo más estrechas.
 */
const LABEL_COLUMN_WIDTH = { docInfo: '85px', default: '90px' };

/**
 * @param {Object}   props
 * @param {Object}   props.element
 * @param {string[]} props.element.fields Claves de las variables a mostrar.
 * @param {Object}   props.data           Datos de la factura.
 * @param {boolean}  props.previewMode    Impresión/vista previa: los datos que faltan quedan en blanco.
 */
export const GridBlock = ({ element, data, previewMode }) => {
  const isDocInfo = element.fields?.includes('facturaNo');

  return (
    <div className="w-full h-full p-1.5 flex flex-col justify-start text-[12px] text-black">
      {/* Cuadrícula de 2 columnas: [etiqueta en negrita, valor] */}
      <div
        className="grid text-[12px] leading-tight"
        style={{
          gridTemplateColumns: `${isDocInfo ? LABEL_COLUMN_WIDTH.docInfo : LABEL_COLUMN_WIDTH.default} 1fr`,
          rowGap: '6px',
          columnGap: '8px',
        }}
      >
        {element.fields?.map((field) => (
          <Fragment key={field}>
            <div className="font-bold select-none">
              {formatFieldLabel(DYNAMICS_VARIABLES_BY_KEY[field]?.label ?? field)}
            </div>
            {/* break-words: los valores largos (p. ej. la dirección) saltan de línea. */}
            <div className="uppercase break-words">{displayField(data, field, { showPlaceholder: !previewMode })}</div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};
