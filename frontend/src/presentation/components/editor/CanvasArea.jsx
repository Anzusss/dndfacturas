/**
 * @file Área central del editor: fondo de escritorio + hoja de papel escalable.
 *
 * La hoja (`#invoice-print-sheet`) es el nodo que `printInvoice` clona para
 * la impresión de prueba; todo lo que tenga la clase `no-print` se omite.
 * Mientras se diseña, los bloques muestran la factura de ejemplo
 * (SAMPLE_INVOICE_DATA).
 */

import { useRef } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { SAMPLE_INVOICE_DATA } from '@/domain/models/sampleData';
import { PRINT_SHEET_ID } from '@/utils/printUtils';
import { InvoiceSheet } from '@/presentation/components/invoice/InvoiceSheet';
import { MarginGuidelines } from './canvas/MarginGuidelines';
import { RndBlockWrapper } from './canvas/RndBlockWrapper';
import { CanvasGuides } from './canvas/CanvasGuides';
import { useCanvasDrop } from './canvas/hooks/useCanvasDrop';

export const CanvasArea = () => {
  const sheetRef = useRef(null);
  const dropHandlers = useCanvasDrop(sheetRef);

  const elements = useEditorStore((s) => s.template.elements);
  const pageSetup = useEditorStore((s) => s.template.pageSetup);
  const zoom = useEditorStore((s) => s.zoom);
  const previewMode = useEditorStore((s) => s.previewMode);
  const showGridLines = useEditorStore((s) => s.showGridLines);
  const setSelectedElementId = useEditorStore((s) => s.setSelectedElementId);

  return (
    <div
      // Fondo gris de escritorio; un clic fuera de los bloques quita la selección.
      className="flex-1 overflow-auto bg-neutral-100 p-8 flex justify-center items-start min-h-0 select-none"
      onClick={() => setSelectedElementId(null)}
    >
      {/* Contenedor escalado: el zoom se aplica aquí para no alterar las coordenadas de la hoja. */}
      <div
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}
        className="transition-transform duration-100 ease-out"
      >
        <InvoiceSheet
          ref={sheetRef}
          id={PRINT_SHEET_ID}
          pageSetup={pageSetup}
          className="rounded-lg"
          {...dropHandlers}
        >
          {showGridLines && !previewMode && (
            <MarginGuidelines paddingTop={pageSetup.paddingTop} paddingBottom={pageSetup.paddingBottom} />
          )}

          {!previewMode && <CanvasGuides />}

          {elements.map((element) => (
            <RndBlockWrapper key={element.id} element={element} data={SAMPLE_INVOICE_DATA} />
          ))}
        </InvoiceSheet>
      </div>
    </div>
  );
};
