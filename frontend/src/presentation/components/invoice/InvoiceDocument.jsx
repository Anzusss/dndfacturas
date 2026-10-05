/**
 * @file Factura final (solo lectura): plantilla + datos → hoja lista para imprimir.
 *
 * Cada bloque se posiciona igual que en el editor (misma caja con borde de
 * 1px transparente que usa react-rnd), para que la impresión coincida al
 * píxel con el diseño.
 */

import { getElementRect } from '@/domain/models/elementFactory';
import { PRINT_SHEET_ID } from '@/utils/printUtils';
import { InvoiceSheet } from './InvoiceSheet';
import { BlockRenderer } from './blocks/BlockRenderer';

/**
 * @param {Object} props
 * @param {Object} props.template Plantilla (versión) a usar.
 * @param {Object} props.data     Datos de la factura (InvoiceData).
 * @param {string} [props.id]     Id DOM de la hoja (por defecto el que imprime `printInvoice`).
 */
export const InvoiceDocument = ({ template, data, id = PRINT_SHEET_ID }) => (
  <InvoiceSheet id={id} pageSetup={template.pageSetup}>
    {template.elements.map((element) => {
      const rect = getElementRect(element);
      return (
        <div
          key={element.id}
          className="absolute border border-transparent"
          style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height, boxSizing: 'border-box' }}
        >
          <BlockRenderer element={element} data={data} previewMode />
        </div>
      );
    })}
  </InvoiceSheet>
);
