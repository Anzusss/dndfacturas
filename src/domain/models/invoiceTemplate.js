import { PAPER_DIMENSIONS } from '../constants/paperDimensions';
import { ELEMENT_TYPES } from '../constants/elementTypes';

/**
 * Plantilla por defecto modelada fielmente a partir del formato real de factura fiscal
 * (Microsoft Dynamics + providencia fiscal SENIAT y doble moneda US$ / Bs.).
 */
export const createDefaultInvoiceTemplate = () => ({
  $schema: 'InvoiceTemplate',
  templateId: 'factura-fiscal-real-v1',
  name: 'Factura Fiscal Membretada (Formato Carta)',
  pageSetup: {
    size: PAPER_DIMENSIONS.SIZE,
    width: `${PAPER_DIMENSIONS.WIDTH_MM}mm`,
    minHeight: `${PAPER_DIMENSIONS.HEIGHT_MM}mm`,
    paddingTop: `${PAPER_DIMENSIONS.MARGIN_TOP_MM}mm`,
    paddingBottom: `${PAPER_DIMENSIONS.MARGIN_BOTTOM_MM}mm`,
    paddingLeft: `${PAPER_DIMENSIONS.MARGIN_LEFT_MM}mm`,
    paddingRight: `${PAPER_DIMENSIONS.MARGIN_RIGHT_MM}mm`,
    fontFamily: PAPER_DIMENSIONS.FONT_FAMILY_DEFAULT,
  },
  elements: [
    {
      id: 'client-info-block',
      type: ELEMENT_TYPES.GRID,
      title: 'Datos del Cliente',
      x: 57,
      y: 195,
      width: 440,
      height: 115,
      fields: ['cliente', 'rif', 'direccion', 'telefono'],
    },
    {
      id: 'doc-info-block',
      type: ELEMENT_TYPES.GRID,
      title: 'Control de Documento',
      x: 520,
      y: 195,
      width: 239,
      height: 95,
      fields: ['facturaNo', 'fecha', 'pago'],
    },
    {
      id: 'items-table-block',
      type: ELEMENT_TYPES.TABLE,
      title: 'Tabla de Bienes / Servicios',
      x: 57,
      y: 330,
      width: 702,
      height: 140,
      columns: [
        'Cantidad',
        'UM',
        'Descripción del Bien/Servicio',
        'Precio/Tarifa (US$)',
        'Sub-total (US$)',
        'Sub-total (Bs.)',
      ],
      sampleRows: [
        {
          cant: '20,000',
          um: 'SC25',
          desc: 'PURICACHAMA 25%',
          precio: 'US$ 28.22',
          subUsd: 'US$ 564.40',
          subBs: 'Bs 223.709,76(E)',
        },
      ],
    },
    {
      id: 'legal-text-block',
      type: ELEMENT_TYPES.TEXT,
      title: 'Leyenda Legal IGTF y Tasa BCV',
      x: 57,
      y: 540,
      width: 702,
      height: 120,
      content:
        'De cancelar este documento en moneda distinta a la de curso legal en el país, estará sujeta a la percepción del I.G.T.F. del 3% según lo establecido en la Providencia SNAT/2022/000013 de fecha 03/03/2022, la cual podría llegar hasta el monto de Bs 6711,29\n\nTasa de cambio reflejada por el Banco Central de Venezuela a la fecha 18/02/2026\nTasa: 396,3674 Bs/$\nMunicipio: Iribarren',
    },
    {
      id: 'totals-section-block',
      type: ELEMENT_TYPES.TOTALS,
      title: 'Resumen de Totales y Liquidación',
      x: 379,
      y: 680,
      width: 380,
      height: 155,
      totalsRows: [
        { label: 'Base Imponible:', usd: 'US$ 0.00', bs: 'Bs 0,00' },
        { label: 'I.V.A. 16%:', usd: 'US$ 0.00', bs: 'Bs 0,00' },
        { label: 'Exento:', usd: 'US$ 0.00', bs: 'Bs 0,00' },
        { label: 'Total General:', usd: 'US$ 564.40', bs: 'Bs 223.709,76', isBold: true },
        { label: 'I.G.T.F. 3%:', usd: 'US$ 16.93', bs: 'Bs 6.711,29' },
      ],
    },
  ],
});
