/**
 * Tipos de bloques manipulables en el editor visual de facturas.
 */
export const ELEMENT_TYPES = {
  GRID: 'grid',
  TABLE: 'table',
  TOTALS: 'totals',
  TEXT: 'text',
  VARIABLE: 'variable',
  LOGO: 'logo',
};

/**
 * Variables dinámicas provistas por Microsoft Dynamics ERP basadas en el formato fiscal real.
 */
export const DYNAMICS_VARIABLES = [
  { key: 'cliente', label: 'Cliente', sample: 'LA CASA DEL GRANJERO C.A (LA CASA DEL GRANJERO C.A)' },
  { key: 'rif', label: 'RIF/C.I.', sample: 'J-30199938-0' },
  { key: 'direccion', label: 'Dirección Fiscal', sample: 'CALLE ACOSTA EDIF ELICON PISO PB LOCAL S/N SECTOR MERCADO MUNICIPAL CARUPANO SUCRE' },
  { key: 'telefono', label: 'Teléfono', sample: '(412) 760-9195 Ext. 0000' },
  { key: 'facturaNo', label: 'Factura No.', sample: 'SERIE H 0000255' },
  { key: 'fecha', label: 'Fecha de Emisión', sample: '18/02/2026' },
  { key: 'pago', label: 'Condición de Pago', sample: 'CREDITO 07 DIAS' },
  { key: 'tasaCambio', label: 'Tasa BCV', sample: '396,3674 Bs/$' },
  { key: 'municipio', label: 'Municipio', sample: 'Iribarren' },
  { key: 'montoIgtfBs', label: 'Monto Estimado IGTF (Bs.)', sample: 'Bs 6.711,29' },
];
