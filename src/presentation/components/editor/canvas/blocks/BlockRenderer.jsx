import React from 'react';
import { ELEMENT_TYPES } from '@/domain/constants/elementTypes';
import { GridBlock } from './GridBlock';
import { TableBlock } from './TableBlock';
import { TotalsBlock } from './TotalsBlock';
import { TextBlock } from './TextBlock';
import { VariableBlock } from './VariableBlock';

/**
 * Componente BlockRenderer
 * Actúa como despachador visual del lienzo. Evalúa la propiedad `type` del elemento
 * y monta el subcomponente correspondiente para mantener desacoplada la lógica de renderizado.
 *
 * @param {Object} props
 * @param {Object} props.element - Definición del bloque actual (type, x, y, width, height, etc.).
 * @param {boolean} props.previewMode - Indicador de congelamiento de edición y vista previa.
 */
export const BlockRenderer = ({ element, previewMode }) => {
  switch (element.type) {
    case ELEMENT_TYPES.GRID:
      return <GridBlock element={element} previewMode={previewMode} />;

    case ELEMENT_TYPES.TABLE:
      return <TableBlock element={element} previewMode={previewMode} />;

    case ELEMENT_TYPES.TOTALS:
      return <TotalsBlock element={element} previewMode={previewMode} />;

    case ELEMENT_TYPES.TEXT:
      return <TextBlock element={element} previewMode={previewMode} />;

    case ELEMENT_TYPES.VARIABLE:
      return <VariableBlock element={element} />;

    case ELEMENT_TYPES.LINE:
    case 'LINE':
      return (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div
            className="w-full"
            style={{
              // Usamos border-top en lugar de background-color para asegurar la impresión
              borderTopWidth: `${element.thickness || 1}px`,
              borderTopStyle: 'solid',
              borderTopColor: element.color || '#000000',
            }}
          />
        </div>
      );

    default:
      console.warn(`Tipo de elemento no reconocido: ${element.type}`);
      return null;
  }
};
