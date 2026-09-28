/**
 * @file Hoja de papel a tamaño real (px a 96 DPI) con la tipografía de la
 * plantilla. Es el contenedor común del editor y de la impresión.
 *
 * El tamaño sale de `pageSetup` (Carta, Media carta, Oficio…). Además se
 * publica en `data-width-mm` / `data-height-mm` para que `printInvoice`
 * configure la página de la impresora con esas mismas medidas.
 */

import { DEFAULT_FONT_FAMILY } from '@/domain/constants/paperDimensions';
import { getPaperDimensions } from '@/domain/constants/paperSizes';

/**
 * @param {Object} props
 * @param {Object} props.pageSetup   Configuración de página de la plantilla.
 * @param {string} [props.id]        Id DOM (el que clona `printInvoice`).
 * @param {string} [props.className] Clases extra.
 * @param {import('react').Ref<HTMLDivElement>} [props.ref] Referencia al nodo (React 19: `ref` es una prop).
 * @param {import('react').ReactNode} props.children
 *   El resto de props (p. ej. handlers de drag & drop) se pasan al div.
 */
export const InvoiceSheet = ({ pageSetup, id, className = '', ref, children, ...rest }) => {
  const { widthPx, heightPx, widthMm, heightMm } = getPaperDimensions(pageSetup);

  return (
    <div
      ref={ref}
      id={id}
      data-width-mm={widthMm}
      data-height-mm={heightMm}
      className={`print-sheet sheet text-neutral-900 relative overflow-hidden ${className}`}
      style={{
        width: `${widthPx}px`,
        height: `${heightPx}px`,
        fontFamily: pageSetup?.fontFamily || DEFAULT_FONT_FAMILY,
        boxSizing: 'border-box',
      }}
      {...rest}
    >
      {children}
    </div>
  );
};
