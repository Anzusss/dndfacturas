/**
 * @file Vista previa reducida de la factura final.
 *
 * La reducción se aplica a un contenedor externo; la hoja en sí conserva su
 * tamaño real, que es lo que clona `printInvoice` para imprimir.
 */

import { getPaperDimensions } from '@/domain/constants/paperSizes';
import { InvoiceDocument } from '@/presentation/components/invoice/InvoiceDocument';

/** Escala de la vista previa respecto al tamaño real de la hoja. */
const PREVIEW_SCALE = 0.75;

/**
 * @param {Object} props
 * @param {Object} props.template Plantilla activa.
 * @param {Object} props.data     Datos de la factura.
 */
export const InvoicePreview = ({ template, data }) => {
  const { widthPx, heightPx } = getPaperDimensions(template.pageSetup);

  return (
    // El contenedor externo ocupa el tamaño ya reducido, para no dejar espacio vacío.
    <div
      className="shadow-lg rounded-md overflow-hidden bg-white"
      style={{ width: widthPx * PREVIEW_SCALE, height: heightPx * PREVIEW_SCALE }}
    >
      <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left' }}>
        <InvoiceDocument template={template} data={data} />
      </div>
    </div>
  );
};
