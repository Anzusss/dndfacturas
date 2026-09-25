import React from 'react';
import { ELEMENT_TYPES } from '@/domain/constants/elementTypes';
import { GridBlock } from './GridBlock';
import { TableBlock } from './TableBlock';
import { TotalsBlock } from './TotalsBlock';
import { TextBlock } from './TextBlock';
import { VariableBlock } from './VariableBlock';
import { LineBlock } from './LineBlock'; // Importa el nuevo componente

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
      return <LineBlock element={element} />; // Usa el componente extraído
    default:
      console.warn(`Tipo de elemento no reconocido: ${element.type}`);
      return null;
  }
};