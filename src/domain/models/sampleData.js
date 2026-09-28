/**
 * @file Datos de muestra y valores por defecto de los bloques.
 *
 * Capa: DOMINIO.
 * - SAMPLE_INVOICE_DATA: factura de ejemplo que se ve en el editor mientras
 *   se diseña (con el mismo formato que devuelve la capa de traducción de la API).
 * - DEFAULT_TOTALS_ROWS: filas del bloque de totales, enlazadas a campos.
 * - LEGAL_TEXT_*: leyendas con `{{variables}}` que se rellenan al imprimir.
 */

import { INVOICE_TYPES } from '../constants/invoiceTypes';

/**
 * Factura de ejemplo (formato InvoiceData, ver `invoiceData.js`).
 * Los importes van como texto ya formateado; la API real puede enviarlos
 * como números y se formatearán según el campo.
 */
export const SAMPLE_INVOICE_DATA = {
  invoiceType: INVOICE_TYPES.CREDITO,
  cliente: 'LA CASA DEL GRANJERO C.A (LA CASA DEL GRANJERO C.A)',
  rif: 'J-30199938-0',
  direccion: 'CALLE ACOSTA EDIF ELICON PISO PB LOCAL S/N SECTOR MERCADO MUNICIPAL CARUPANO SUCRE',
  telefono: '(412) 760-9195 Ext. 0000',
  facturaNo: 'SERIE H 0000255',
  fecha: '18/02/2026',
  pago: 'CREDITO 07 DIAS',
  tasaCambio: '396,3674 Bs/$',
  municipio: 'Iribarren',
  montoIgtfBs: 'Bs 6.711,29',
  items: [
    {
      cantidad: '20,000',
      um: 'SC25',
      descripcion: 'PURICACHAMA 25%',
      precioUsd: 'US$ 28.22',
      subtotalUsd: 'US$ 564.40',
      subtotalBs: 'Bs 223.709,76(E)',
    },
  ],
  totales: {
    baseImponibleUsd: 'US$ 0.00',
    baseImponibleBs: 'Bs 0,00',
    ivaUsd: 'US$ 0.00',
    ivaBs: 'Bs 0,00',
    exentoUsd: 'US$ 0.00',
    exentoBs: 'Bs 0,00',
    totalGeneralUsd: 'US$ 564.40',
    totalGeneralBs: 'Bs 223.709,76',
    igtfUsd: 'US$ 16.93',
    igtfBs: 'Bs 6.711,29',
  },
};

/**
 * Filas del bloque de totales. Cada importe apunta a un campo (`usdKey`,
 * `bsKey`) en lugar de llevar el valor escrito a mano como antes.
 * `isBold` resalta la fila (normalmente "Total General").
 */
export const DEFAULT_TOTALS_ROWS = [
  { label: 'Base Imponible:', usdKey: 'totales.baseImponibleUsd', bsKey: 'totales.baseImponibleBs' },
  { label: 'I.V.A. 16%:', usdKey: 'totales.ivaUsd', bsKey: 'totales.ivaBs' },
  { label: 'Exento:', usdKey: 'totales.exentoUsd', bsKey: 'totales.exentoBs' },
  { label: 'Total General:', usdKey: 'totales.totalGeneralUsd', bsKey: 'totales.totalGeneralBs', isBold: true },
  { label: 'I.G.T.F. 3%:', usdKey: 'totales.igtfUsd', bsKey: 'totales.igtfBs' },
];

/** Leyenda legal del IGTF y la tasa BCV (plantilla por defecto). */
export const LEGAL_TEXT_IGTF =
  'De cancelar este documento en moneda distinta a la de curso legal en el país, estará sujeta a la percepción del I.G.T.F. del 3% según lo establecido en la Providencia SNAT/2022/000013 de fecha 03/03/2022, la cual podría llegar hasta el monto de {{montoIgtfBs}}\n\nTasa de cambio reflejada por el Banco Central de Venezuela a la fecha {{fecha}}\nTasa: {{tasaCambio}}\nMunicipio: {{municipio}}';

/** Versión corta de la leyenda, usada al insertar un bloque de texto nuevo. */
export const LEGAL_TEXT_IGTF_SHORT =
  'De cancelar este documento en moneda distinta a la de curso legal en el país... Tasa: {{tasaCambio}}';
