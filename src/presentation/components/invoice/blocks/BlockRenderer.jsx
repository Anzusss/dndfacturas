/**
 * @file Elige el componente visual de cada tipo de bloque.
 *
 * Lo usan tanto el editor (con datos de muestra) como la impresión (con datos
 * reales), así que lo que se ve al diseñar es lo que se imprime.
 *
 * Para añadir un tipo nuevo: créalo en ELEMENT_TYPES, implementa su
 * componente `XxxBlock` y regístralo en BLOCK_COMPONENTS.
 */

import { ELEMENT_TYPES } from '@/domain/constants/elementTypes';
import { GridBlock } from './GridBlock';
import { TableBlock } from './TableBlock';
import { TotalsBlock } from './TotalsBlock';
import { TextBlock } from './TextBlock';
import { VariableBlock } from './VariableBlock';
import { LineBlock } from './LineBlock';

/** Registro tipo → componente. */
const BLOCK_COMPONENTS = {
  [ELEMENT_TYPES.GRID]: GridBlock,
  [ELEMENT_TYPES.TABLE]: TableBlock,
  [ELEMENT_TYPES.TOTALS]: TotalsBlock,
  [ELEMENT_TYPES.TEXT]: TextBlock,
  [ELEMENT_TYPES.VARIABLE]: VariableBlock,
  [ELEMENT_TYPES.LINE]: LineBlock,
};

/**
 * @param {Object}  props
 * @param {Object}  props.element     Bloque de la plantilla.
 * @param {Object}  props.data        Datos de la factura (InvoiceData).
 * @param {boolean} props.previewMode Aspecto final (impresión) en vez de ayudas de edición.
 */
export const BlockRenderer = ({ element, data, previewMode }) => {
  const Block = BLOCK_COMPONENTS[element.type];

  if (!Block) {
    console.warn(`Tipo de elemento no reconocido: ${element.type}`);
    return null;
  }
  return <Block element={element} data={data} previewMode={previewMode} />;
};
